import {
  IApplyToSettings,
  ICSSFilter,
  TCSSFilterApplyToImage, TCSSFilterDefaultValue,
  TProcessImageFunc,
} from './types';
import {getBytesCount} from './utils';

type TDefaultValueMixin<V = TCSSFilterDefaultValue> = {
  /**
   * Default value or values for this filter. For example, if its brightness
   * filter, default value is 100 because by default images has 100%
   * brightness.
   */
  defaultValue: V;
} | {
  /**
   * Overrides isDefault method.
   * @param {V} value
   * @returns {boolean}
   */
  isDefault(value: V): boolean;
}

type TGetCSSFilter<V = TCSSFilterDefaultValue> = {
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
   * @param {V} value
   * @returns {string}
   */
  getCSSFilter(value: V): string;
}

type TOptions<V = TCSSFilterDefaultValue> = TDefaultValueMixin<V>
  & TGetCSSFilter<V>
  & {
  /**
   * Filter class name.
   */
  name?: string;

  /**
   * Function which processes image pixels and applies filter logic.
   */
  processImage: TProcessImageFunc<V>;
};

/**
 * Creates CSS filter.
 * @param {IOptions} options
 * @returns {ICSSFilter}
 */
export function createCSSFilter<V = TCSSFilterDefaultValue>(
  options: TOptions<V>,
): ICSSFilter<V> {
  const {name, processImage} = options;

  const getCSSFilter = 'getCSSFilter' in options
    ? options.getCSSFilter
    : (value: V) => {
      const {cssFunctionName, cssFunctionValuePostfix} = options;

      return `${cssFunctionName}(${value}${cssFunctionValuePostfix})`;
    };
  const isDefault = 'isDefault' in options
    ? options.isDefault
    : (value: V) => options.defaultValue === value;

  function applyTo(image: ImageData, value: V, settings?: IApplyToSettings): ImageData;
  function applyTo(image: Uint8ClampedArray, value: V, settings?: IApplyToSettings): Uint8ClampedArray;
  function applyTo(image: number[], value: V, settings?: IApplyToSettings): number[];
  function applyTo(image: TCSSFilterApplyToImage, value: V, settings: IApplyToSettings = {}): any {
    const {type = 'rgba'} = settings;
    let data = image instanceof ImageData
      ? image.data
      : image;

    if (data.length % getBytesCount(type)) {
      throw new Error(
        'Entity is corrupted. Choose another entity type or check ' +
        'entity itself',
      );
    }

    // Process image data.
    processImage(data, value, type);

    return image;
  }

  class CSSFilter {
    static applyTo = applyTo;
    static getCSSFilter = getCSSFilter;
    static isDefault = isDefault;
  }

  if (typeof name === 'string') {
    Object.defineProperty(CSSFilter, 'name', {value: name});
  }
  return CSSFilter;
}