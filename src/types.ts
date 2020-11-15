export type TProcessableImageType = 'rgb' | 'rgba';

export interface IApplyToSettings<Type extends TProcessableImageType = TProcessableImageType> {
  /**
   * Defines passed image type. So, when filter is applied to image, it
   * should modify specific bytes. Passing image type defines which bytes
   * should be modified.
   */
  type: Type;
}

/**
 * Function which applies filter to image.
 */
export type TProcessImageFunc<Value = TCSSFilterDefaultValue,
  ImageType extends TProcessableImageType = TProcessableImageType> =
  (
    image: ImageData,
    value: Value,
    type: ImageType,
  ) => ImageData;

/**
 * CSS filter default value's default type.
 */
export type TCSSFilterDefaultValue = number;

/**
 * Describes any CSS filter which could be used in CSS's filter property.
 */
export interface ICSSFilter<Value = TCSSFilterDefaultValue, 
  ImageType extends TProcessableImageType = TProcessableImageType> {
  /**
   * Returns CSS filter function applied to passed value. As a result,
   * it should return something like "brightness(50%)". So, it could be used
   * in CSS's "filter" property.
   * @param {Value} value
   * @returns {string}
   */
  getCSSFilter(value: Value): string;

  /**
   * States if passed value is default for this filter.
   * @param {Value} value
   * @returns {boolean}
   */
  isDefault(value: Value): boolean;

  /**
   * Applies filter to pixel or set of RGB/RGBA pixels. To make it more
   * @param image
   * @param value
   * @param settings
   * @returns {T}
   */
  applyTo(
    image: ImageData,
    value: Value,
    settings: IApplyToSettings<ImageType>,
  ): ImageData;
}