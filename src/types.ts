export type TProcessableImageType = 'rgb' | 'rgba';

export interface IProcessImageOptions<Type extends TProcessableImageType = TProcessableImageType> {
  /**
   * Image data to be modified.
   */
  image: ImageData;
  /**
   * Filter function value.
   */
  value: number;
  /**
   * From which pixel filter should modify image.
   */
  from?: number;
  /**
   * To which pixel filter should modify image.
   */
  to?: number;
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
export type TProcessImageFunc<ImageType extends TProcessableImageType = TProcessableImageType> = (
  options: IProcessImageOptions<ImageType>,
) => void;

/**
 * Describes any CSS filter which could be used in CSS's filter property.
 */
export interface ICSSFilter<ImageType extends TProcessableImageType = TProcessableImageType> {
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
   * Applies filter to pixel or set of RGB/RGBA pixels.
   */
  processImage: TProcessImageFunc<ImageType>;
}