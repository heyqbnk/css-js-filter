import {
  IApplyToSettings,
  ICSSFilter,
  TCSSFilterApplyToImage, TCSSFilterDefaultValue, TProcessableImageType,
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

type TGetCSSFilterMixin<V = TCSSFilterDefaultValue> = {
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

type TOptions<Value = TCSSFilterDefaultValue, ImageType extends TProcessableImageType = TProcessableImageType> =
  & TDefaultValueMixin<Value>
  & TGetCSSFilterMixin<Value>
  & {
  /**
   * Filter class name.
   */
  name?: string;

  /**
   * Function which processes image pixels and applies filter logic.
   */
  processImage: TProcessImageFunc<Value, ImageType>;
};

/**
 * Creates CSS filter.
 * @param {IOptions} options
 * @returns {ICSSFilter}
 */
export function createCSSFilter<Value = TCSSFilterDefaultValue, 
  ImageType extends TProcessableImageType = TProcessableImageType>(
  options: TOptions<Value, ImageType>,
): ICSSFilter<Value, ImageType> {
  const {name, processImage} = options;

  const getCSSFilter = 'getCSSFilter' in options
    ? options.getCSSFilter
    : (value: Value) => {
      const {cssFunctionName, cssFunctionValuePostfix} = options;

      return `${cssFunctionName}(${value}${cssFunctionValuePostfix})`;
    };
  const isDefault = 'isDefault' in options
    ? options.isDefault
    : (value: Value) => options.defaultValue === value;

  function applyTo(image: ImageData, value: Value, settings: IApplyToSettings<ImageType>): ImageData;
  function applyTo(image: Uint8ClampedArray, value: Value, settings: IApplyToSettings<ImageType>): Uint8ClampedArray;
  function applyTo(image: number[], value: Value, settings: IApplyToSettings<ImageType>): number[];
  function applyTo(image: TCSSFilterApplyToImage, value: Value, settings: IApplyToSettings<ImageType>): any {
    const {type} = settings;
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