export type TProcessableImage = Uint8ClampedArray | number[];
export type TCSSFilterApplyToImage = Uint8ClampedArray | ImageData | number[];
export type TProcessableImageType = 'rgb' | 'rgba';

export interface IApplyToSettings {
  /**
   * Defines passed image type. So, when filter is applied to image, it
   * should modify specific bytes. Passing image type defines which bytes
   * should be modified.
   * @default 'rgba'
   */
  type?: TProcessableImageType;
}

/**
 * Function which applies filter to image.
 */
export type TProcessImageFunc<V = TCSSFilterDefaultValue> =
  <T extends TProcessableImage>(
    image: T,
    value: V,
    type: TProcessableImageType,
  ) => T;

/**
 * CSS filter default value default type.
 */
export type TCSSFilterDefaultValue = number;

export interface ICSSFilter<V = TCSSFilterDefaultValue> {
  /**
   * Returns CSS filter function applied to passed value. As a result,
   * it should return something like "brightness(50%)". So, it could be used
   * in CSS's "filter" property.
   * @param {V} value
   * @returns {string}
   */
  getCSSFilter(value: V): string;

  /**
   * States if passed value is default for this filter.
   * @param {V} value
   * @returns {boolean}
   */
  isDefault(value: V): boolean;

  /**
   * Applies filter to pixel or set of RGB/RGBA pixels. To make it more
   * @param image
   * @param value
   * @param settings
   * @returns {T}
   */
  applyTo<T extends TCSSFilterApplyToImage>(
    image: T,
    value: V,
    settings?: IApplyToSettings,
  ): T;
}