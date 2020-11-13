import {TProcessableImage, TProcessableImageType} from './types';
import {ColorsFilter} from './ColorsFilter';
import {isNumber} from 'util';

interface IForEachPixelMappersMap {
  rgb: (r: number, g: number, b: number) => any;
  rgba: (r: number, g: number, b: number, a: number) => any;
}

/**
 * Returns bytes count for specified pixel type.
 * @param {TProcessableImageType} type
 * @returns {number}
 */
export function getBytesCount(type: TProcessableImageType): number {
  return type === 'rgb' ? 3 : 4;
}

type TRGBAComponent = number;
type TR = TRGBAComponent;
type TG = TRGBAComponent;
type TB = TRGBAComponent;
type TA = TRGBAComponent;

/**
 * Applies function f to each pixel of image.
 * @param {TProcessableImage} image
 * @param {"rgb"} type
 * @param {(r: number, g: number, b: number) => any} f
 */
export function forEachPixel(
  image: TProcessableImage,
  type: 'rgb',
  f: (index: number, r: TR, g: TG, b: TB) => any,
): void;
export function forEachPixel(
  image: TProcessableImage,
  type: 'rgba',
  f: (index: number, r: TR, g: TG, b: TB, a: TA) => any,
): void;
export function forEachPixel(
  image: TProcessableImage,
  type: TProcessableImageType,
  f: (index: number, r: TR, g: TG, b: TB) => any,
): void;
export function forEachPixel(
  image: TProcessableImage,
  type: TProcessableImageType,
  f: (index: number, ...args: any[]) => any,
) {
  const bytesCount = getBytesCount(type);

  for (let i = 0; i < image.length; i += bytesCount) {
    const r = image[i];
    const g = image[i + 1];
    const b = image[i + 2];

    if (type === 'rgba') {
      const a = image[i + 3];

      f.call(f, i, r, g, b, a);
    } else {
      f.call(f, i, r, g, b);
    }
  }
}

/**
 * Changes pixel in image.
 * @param {TProcessableImage} image
 * @param {number} from
 * @param {number[]} components
 */
export function assignPixel(
  image: TProcessableImage,
  from: number,
  components: number[]
) {
  for (let i = 0; i < components.length; i++) {
    image[from + i] = components[i];
  }
}