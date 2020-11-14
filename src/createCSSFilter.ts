import {
  IApplyToSettings,
  ICSSFilter,
  TCSSFilterApplyToImage,
  TProcessImageFunc,
} from './types';
import {getBytesCount} from './utils';

type TDefaultValue = {
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
}

type TGetCSSFilter = {
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
} & {
  /**
   * Returns CSS filter text representation, which could be used as
   * CSS's filter property.
   * @param {string} value
   * @returns {string}
   */
  getCSSFilter(value: number): string;
}

type TOptions = TDefaultValue & TGetCSSFilter & {
  /**
   * Filter class name.
   */
  name?: string;

  /**
   * Function which processes image pixels and applies filter logic.
   */
  processImage: TProcessImageFunc;
};

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

  const getCSSFilter = 'getCSSFilter' in options
    ? options.getCSSFilter
    : (value: number) => {
      return `${cssFunctionName}(${value}${cssFunctionValuePostfix})`;
    };
  const isDefault = 'isDefault' in options
    ? options.isDefault
    : (value: number) => {
      const {defaultValue} = options;

      return Array.isArray(defaultValue)
        ? defaultValue.includes(value)
        : defaultValue === value;
    };

  function applyTo(image: ImageData, value: number, settings?: IApplyToSettings): ImageData;
  function applyTo(image: Uint8ClampedArray, value: number, settings?: IApplyToSettings): Uint8ClampedArray;
  function applyTo(image: number[], value: number, settings?: IApplyToSettings): number[];
  function applyTo(image: TCSSFilterApplyToImage, value: number, settings: IApplyToSettings = {}): any {
    const {byRef = true, type = 'rgba'} = settings;
    let data = image instanceof ImageData
      ? image.data
      : image;

    if (data.length % getBytesCount(type)) {
      throw new Error(
        'Entity is corrupted. Choose another entity type or check ' +
        'entity itself',
      );
    }
    // In case, modify by reference is not needed, create data copy.
    data = byRef ? data : data.slice(0);

    // Process image data.
    processImage(data, value, type);

    if (image instanceof ImageData) {
      if (byRef) {
        return image;
      }
      return new ImageData(
        data instanceof Uint8ClampedArray
          ? data
          : new Uint8ClampedArray(data),
        image.width,
        image.height,
      );
    }
    return data;
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