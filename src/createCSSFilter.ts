import {
  IApplyToSettings,
  ICSSFilter,
  TProcessableImage,
  TProcessImageFunc,
} from './types';
import {getBytesCount} from './utils';

type TOptions = {
  /**
   * Filter class name.
   */
  name?: string;

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

  /**
   * Function which processes image pixels and applies filter logic.
   */
  processImage: TProcessImageFunc;
} & ({
  /**
   * Default value or values for this filter. For example, if its brightness
   * filter, default value is 100 because by default images has 100%
   * brightness.
   */
  defaultValue: number | number[];
} | {
  /**
   * Overrides isDefault method.
   * @param {number} value
   * @returns {boolean}
   */
  isDefault(value: number): boolean;
})

/**
 * Creates CSS filter.
 * @param {IOptions} options
 * @returns {ICSSFilter}
 */
export function createCSSFilter(
  options: TOptions,
): ICSSFilter {
  const {
    name, cssFunctionName, cssFunctionValuePostfix, processImage,
  } = options;

  const isDefault = 'isDefault' in options
    ? options.isDefault
    : (value: number) => {
      const {defaultValue} = options;

      return Array.isArray(defaultValue)
        ? defaultValue.includes(value)
        : defaultValue === value;
    };

  function applyTo(image: Uint8ClampedArray, value: number, settings?: IApplyToSettings): Uint8ClampedArray;
  function applyTo(image: number[], value: number, settings?: IApplyToSettings): number[];
  function applyTo(image: TProcessableImage, value: number, settings: IApplyToSettings = {}): any {
    const {byRef = false, type = 'rgba'} = settings;

    if (image.length % getBytesCount(type)) {
      throw new Error(
        'Entity is corrupted. Choose another entity type or check ' +
        'entity itself',
      );
    }
    return processImage(byRef ? image : image.slice(0), value, type);
  }

  class CSSFilter {
    static applyTo = applyTo;

    static isDefault = isDefault;

    static getCSSFilter(value: number): string {
      return `${cssFunctionName}(${value}${cssFunctionValuePostfix})`;
    }
  }

  if (typeof name === 'string') {
    Object.defineProperty(CSSFilter, 'name', {value: name});
  }
  return CSSFilter;
}