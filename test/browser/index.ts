/// <reference path="./types.d.ts"/>
import imageUrl from './image.jpg';
import {
  ICSSFilter, BrightnessFilter,
  ContrastFilter,
  SaturationFilter,
  SepiaFilter,
  HueRotationBrowserFilter,
  HueRotationFilter,
  GrayscaleFilter,
} from '../../src';

type TTitle = string;
type TMin = number;
type TMax = number;
type TValue = number;
const filters: [ICSSFilter, TTitle, TMin, TMax, TValue][] = [
  [BrightnessFilter, 'Brightness', 0, 200, 100],
  [ContrastFilter, 'Contrast', 0, 200, 100],
  [SaturationFilter, 'Saturation', 0, 200, 100],
  [SepiaFilter, 'Sepia', 0, 100, 0],
  [HueRotationBrowserFilter, 'Hue rotation (browser)', 0, 360, 0],
  [HueRotationFilter, 'Hue rotation (original)', 0, 360, 0],
  [GrayscaleFilter, 'Grayscale', 0, 100, 0],
];

/**
 * Redraws canvas with image and filters.
 */
function redraw(canvas: HTMLCanvasElement, type: 'css' | 'js') {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('No canvas context found');
  }
  canvas.width = window.innerWidth;
  canvas.height = canvas.width / image.width * image.height;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (type === 'js') {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    filters.forEach(([Filter, , , , value]) => {
      if (Filter.isDefault(value)) {
        return;
      }
      Filter.applyTo(imageData, value);
    });
    context.putImageData(imageData, 0, 0);
  } else {
    canvas.style.filter = filters
      .reduce<string[]>((acc, [Filter, , , , value]) => {
        if (!Filter.isDefault(value)) {
          acc.push(Filter.getCSSFilter(value));
        }
        return acc;
      }, [])
      .join(' ');
  }
}

/**
 * Creates onChange handler for input.
 * @param {ICSSFilter} filter
 * @param currentValueBlock
 * @returns {(ev: Event) => void}
 */
function createOnFilterChange(
  filter: ICSSFilter,
  currentValueBlock: HTMLDivElement,
  canvas: HTMLCanvasElement,
  type: 'css' | 'js'
) {
  return (ev: Event) => {
    const f = filters.find(f => f[0] === filter);
    const value = (ev.target as HTMLInputElement).value;
    currentValueBlock.innerText = value;

    if (f) {
      f[4] = parseInt(value);
      redraw(canvas, type);
    }
  };
}

/**
 * Finds input and do required operations with it.
 * @param {ICSSFilter} filter
 * @param title
 * @param min
 * @param max
 * @param {number} value
 */
function createFilter(
  filter: ICSSFilter,
  title: string,
  min: number,
  max: number,
  value: number,
) {
  const label = document.createElement('label');
  label.className = 'filter';
  const titleBlock = document.createElement('div');
  titleBlock.innerText = title;
  titleBlock.className = 'filter__title';

  const rangesBlock = document.createElement('div');
  rangesBlock.className = 'filter__ranges';
  const from = document.createElement('div');
  from.innerText = min.toString();
  rangesBlock.append(from);
  const current = document.createElement('div');
  current.innerText = value.toString();
  rangesBlock.append(current);
  const to = document.createElement('div');
  to.innerText = max.toString();
  rangesBlock.append(to);

  const input = document.createElement('input');
  input.className = 'filter__input';
  input.min = min.toString();
  input.max = max.toString();
  input.value = value.toString();
  input.type = 'range';
  input.onchange = createOnFilterChange(filter, current, jsCanvas, 'js');
  input.oninput = createOnFilterChange(filter, current,  cssCanvas, 'css');

  label.append(titleBlock, input, rangesBlock);
  filtersBlock.append(label);
}

const cssCanvas = document.getElementById('css-canvas') as HTMLCanvasElement;
const jsCanvas = document.getElementById('js-canvas') as HTMLCanvasElement;
const filtersBlock = document.getElementById('filters') as HTMLDivElement;

// Create filters.
filters.forEach(([filter, title, min, max, value]) => {
  createFilter(filter, title, min, max, value);
});

const image = new Image();
image.src = imageUrl;
image.onload = () => {
  redraw(cssCanvas, 'css');
  redraw(jsCanvas, 'js');
}

