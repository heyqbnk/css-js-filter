import {
  ICSSFilter,
  TProcessableImageType,
  TProcessImageFunc,
} from './types';

type TDefaultValueMixin = {
  /**
   * Default value or values for this filter. For example, if its brightness
   * filter, default value is 100 because by default images has 100%
   * brightness.
   */
  defaultValue: number;
} | {
  /**
   * Overrides isDefault method.
   * @param {number} value
   * @returns {boolean}
   */
  isDefault(value: number): boolean;
}

type TGetCSSFilterMixin = {
  /**
   * CSS filter function name. For example: hue-rotate, contrast
   * brightness, etc.
   */
  cssFunctionName: string;

  /**
   * Text which is passed right after intensity. They could be
   * "%", "deg" or "px".
   */
  cssFunctionValuePostfix?: string;
} | {
  /**
   * Returns CSS filter text representation, which could be used as
   * CSS's filter property.
   * @param {number} value
   * @returns {string}
   */
  getCSSFilter(value: number): string;
}

type TOptions<ImageType extends TProcessableImageType = TProcessableImageType> =
  & TDefaultValueMixin
  & TGetCSSFilterMixin
  & {
  /**
   * Filter class name.
   */
  name?: string;

  /**
   * Function which processes image pixels and applies filter logic.
   */
  processImage: TProcessImageFunc<ImageType>;
};

/**
 * Creates CSS filter.
 * @param {IOptions} options
 * @returns {ICSSFilter}
 */
export function createCSSFilter<ImageType extends TProcessableImageType = TProcessableImageType>(
  options: TOptions<ImageType>,
): ICSSFilter<ImageType> {
  const {name, processImage} = options;

  const getCSSFilter = 'getCSSFilter' in options
    ? options.getCSSFilter
    : (value: number) => {
      const {cssFunctionName, cssFunctionValuePostfix} = options;

      return `${cssFunctionName}(${value}${cssFunctionValuePostfix})`;
    };
  const isDefault = 'isDefault' in options
    ? options.isDefault
    : (value: number) => options.defaultValue === value;

  class CSSFilter {
    static processImage = processImage;
    static getCSSFilter = getCSSFilter;
    static isDefault = isDefault;
  }

  if (typeof name === 'string') {
    Object.defineProperty(CSSFilter, 'name', {value: name});
  }
  return CSSFilter;
}