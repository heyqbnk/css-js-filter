import {TProcessableImageType} from './types';

type TRGBAComponent = number;
type TR = TRGBAComponent;
type TG = TRGBAComponent;
type TB = TRGBAComponent;
type TA = TRGBAComponent;

/**
 * Returns bytes count for specified pixel type.
 * @param {TProcessableImageType} type
 * @returns {number}
 */
export function getBytesCount(type: TProcessableImageType): number {
  return type === 'rgb' ? 3 : 4;
}

/**
 * Applies function f to each pixel of image.
 * @param {ImageData} image
 * @param {"rgb"} type
 * @param {(r: number, g: number, b: number) => any} f
 */
export function forEachPixel(
  image: ImageData,
  type: 'rgb',
  f: (index: number, r: TR, g: TG, b: TB) => any,
): void;
export function forEachPixel(
  image: ImageData,
  type: 'rgba',
  f: (index: number, r: TR, g: TG, b: TB, a: TA) => any,
): void;
export function forEachPixel(
  image: ImageData,
  type: TProcessableImageType,
  f: (index: number, r: TR, g: TG, b: TB) => any,
): void;
export function forEachPixel(
  image: ImageData,
  type: TProcessableImageType,
  f: (index: number, ...args: any[]) => any,
) {
  const {data} = image;
  const bytesCount = getBytesCount(type);

  for (let i = 0; i < data.length; i += bytesCount) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (type === 'rgba') {
      const a = data[i + 3];

      f.call(f, i, r, g, b, a);
    } else {
      f.call(f, i, r, g, b);
    }
  }
}

export function _forEachPixel(
  image: ImageData,
  type: TProcessableImageType,
  f: (from: number, to: number) => any,
) {
  const {data} = image;
  const bytesCount = getBytesCount(type);
  const stepsCount = Math.floor(data.length / bytesCount);

  for (let i = 0; i < stepsCount; i++) {
    f.call(f, i, i + bytesCount);
  }
}

/**
 * Changes pixel in image.
 * @param {ImageData} image
 * @param type
 * @param {number} from
 * @param {number[]} componentsOrData
 */
export function assignPixel(
  image: ImageData,
  type: TProcessableImageType,
  from: number,
  componentsOrData: number[] | ImageData
) {
  const components = componentsOrData instanceof ImageData
    ? componentsOrData.data
    : componentsOrData;
  const bytesCount = getBytesCount(type);
  const length = Math.min(components.length, bytesCount);

  for (let i = 0; i < length; i++) {
    image.data[from + i] = components[i];
  }
}

/**
 * Changes pixel in image.
 * @param {ImageData} image
 * @param type
 * @param {number} from
 * @param {number[]} componentsOrData
 */
export function _assignPixel(
  image: ImageData,
  type: TProcessableImageType,
  from: number,
  componentsOrData: number[] | ImageData
) {
  const components = componentsOrData instanceof ImageData
    ? componentsOrData.data
    : componentsOrData;
  const bytesCount = getBytesCount(type);

  for (let i = 0; i < bytesCount; i++) {
    image.data[from + i] = components[i];
  }
}