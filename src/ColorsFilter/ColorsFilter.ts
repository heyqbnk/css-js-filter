import {ColorsConverter} from '../ColorsConverter';
import {IProcessImageOptions, TProcessableImageType} from '../types';
import {getBytesCount} from '../utils';

interface IGetBoundsOptions<Type extends TProcessableImageType = TProcessableImageType> {
  /**
   * Image data to be modified.
   */
  image: ImageData;
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
 * Библиотека которая может работать с цветами.
 */
export class ColorsFilter {
  /**
   * Formats "from" and "to" depending on image, its type and passed
   * "from" and "to".
   * @param {IGetBoundsOptions<ImageType>} options
   * @returns {[number, number]}
   */
  static getBounds<ImageType extends TProcessableImageType = TProcessableImageType>(
    options: IGetBoundsOptions<ImageType>,
  ): [number, number] {
    const {image: {data}, from, to, type} = options;
    const bytesCount = getBytesCount(type);
    const _from = from || 0;
    const _to = to || (data.length / bytesCount - 1);
    const pixelsCount = data.length / bytesCount;

    if (_from < 0 || _from >= _to || _to >= pixelsCount) {
      throw new Error(`Incorrect bounds passed: [${_from}, ${_to}]`);
    }
    return [_from * bytesCount, (_to + 1) * bytesCount];
  }

  /**
   * Changes pixel brightness.
   * @returns {[number, number, number]}
   * @param options
   */
  static brighten<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const multiplier = value / 100;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += bytesCount) {
      for (let j = 0; j < 3; j++) {
        data[i + j] *= multiplier;
      }
    }
  }

  /**
   * Changes pixel contrast.
   * @returns {[number, number, number]}
   * @param options
   */
  static contrast<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const multiplier = value / 100;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += bytesCount) {
      for (let j = 0; j < 3; j++) {
        data[i + j] = multiplier * (data[i + j] - 128) + 128;
      }
    }
  }

  /**
   * Grayscales pixel.
   * @returns {[number, number, number]}
   * @param options
   */
  static grayscale<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const multiplier = value / 100;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += bytesCount) {
      const targetValue = data[i] * 0.299 +
        data[i + 1] * 0.587 +
        data[i + 2] * 0.114;

      for (let j = 0; j < 3; j++) {
        data[i + j] += (targetValue - data[i + j]) * multiplier;
      }
    }
  }

  /**
   * Inverts pixels.
   * @param options
   */
  static invert<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const multiplier = value / 100;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += bytesCount) {
      for (let j = 0; j < 3; j++) {
        const targetValue = 255 - data[i + j];
        const diff = targetValue - data[i + j];

        data[i + j] += diff * multiplier;
      }
    }
  }

  /**
   * Opacifies pixel.
   * @param options
   */
  static opacify(options: IProcessImageOptions<'rgba'>) {
    const {value, image: {data}} = options;
    const multiplier = value / 100;
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += 4) {
      data[i + 3] *= multiplier;
    }
  }

  /**
   * Rotates hue. Works the same as in browsers.
   * @see https://stackoverflow.com/questions/19187905/why-doesnt-hue-rotation-by-180deg-and-180deg-yield-the-original-color/19325417#19325417
   * @param options
   */
  static rotateHueBrowser<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);
    const matrix = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];

    // Coefficients for luminosity.
    const lumR = 0.2126;
    const lumG = 0.7152;
    const lumB = 0.0722;

    // Coefficients for hue rotation.
    const hueRotateR = 0.143;
    const hueRotateG = 0.140;
    const hueRotateB = 0.283;

    const cos = Math.cos(value * Math.PI / 180);
    const sin = Math.sin(value * Math.PI / 180);

    matrix[0] = lumR + (1 - lumR) * cos - lumR * sin;
    matrix[1] = lumG - lumG * cos - lumG * sin;
    matrix[2] = lumB - lumB * cos + (1 - lumB) * sin;

    matrix[3] = lumR - lumR * cos + hueRotateR * sin;
    matrix[4] = lumG + (1 - lumG) * cos + hueRotateG * sin;
    matrix[5] = lumB - lumB * cos - hueRotateB * sin;

    matrix[6] = lumR - lumR * cos - (1 - lumR) * sin;
    matrix[7] = lumG - lumG * cos + lumG * sin;
    matrix[8] = lumB + (1 - lumB) * cos + lumB * sin;

    for (let i = from; i < to; i += bytesCount) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = matrix[0] * r + matrix[1] * g + matrix[2] * b;
      data[i + 1] = matrix[3] * r + matrix[4] * g + matrix[5] * b;
      data[i + 2] = matrix[6] * r + matrix[7] * g + matrix[8] * b;
    }
  }

  /**
   * Rotates hue. Works as it should.
   * @param options
   */
  static rotateHue<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const amount = value / 360;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += bytesCount) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const [h, s, l] = ColorsConverter.rgbToHsl(r, g, b);
      const rgb = ColorsConverter.hslToRgb(h + amount, s, l);

      for (let j = 0; j < 3; j++) {
        data[i + j] = rgb[j];
      }
    }
  }

  /**
   * Changes pixel saturation.
   * @returns {[number, number, number]}
   * @param options
   */
  static saturate<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const multiplier = value / 100;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += bytesCount) {
      const [h, s, l] = ColorsConverter.rgbToHsl(data[i], data[i + 1], data[i + 2]);
      const [r, g, b] = ColorsConverter.hslToRgb(h, s * multiplier, l);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
  }

  /**
   * Applies sepia to pixel.
   * @see https://dyclassroom.com/image-processing-project/how-to-convert-a-color-image-into-sepia-image
   * @param options
   */
  static sepia<ImageType extends TProcessableImageType>(
    options: IProcessImageOptions<ImageType>,
  ) {
    const {value, type, image: {data}} = options;
    const multiplier = value / 100;
    const bytesCount = getBytesCount(type);
    const [from, to] = this.getBounds(options);

    for (let i = from; i < to; i += bytesCount) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;

      data[i] = r + (tr - r) * multiplier;
      data[i + 1] = g + (tg - g) * multiplier;
      data[i + 2] = b + (tb - b) * multiplier;
    }
  }
}