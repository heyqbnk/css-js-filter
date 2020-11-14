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
  /**
   * Should processor modify entity by its reference. If true, entity
   * value is not cloned and will be changed by reference. You should pass
   * true to make filter work faster because cloning entity will take some
   * time.
   * @default true
   */
  byRef?: boolean;
}

/**
 * Function which applies filter to image.
 */
export type TProcessImageFunc = <T extends TProcessableImage>(
  image: T,
  value: number,
  type: TProcessableImageType,
) => T;

export interface ICSSFilter {
  /**
   * Returns CSS filter function applied to passed value. As a result,
   * it should return something like "brightness(50%)". So, it could be used
   * in CSS's "filter" property.
   * @param {number} value
   * @returns {string}
   */
  getCSSFilter(value: number): string;
  /**
   * States if passed value is default for this filter.
   * @param {number} value
   * @returns {boolean}
   */
  isDefault(value: number): boolean;
  /**
   * Applies filter to pixel or set of RGB/RGBA pixels. To make it more
   * @param image
   * @param value
   * @param settings
   * @returns {T}
   */
  applyTo<T extends TCSSFilterApplyToImage>(
    image: T,
    value: number,
    settings?: IApplyToSettings,
  ): T;
}