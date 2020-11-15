import {
  createCSSFilter,
  SepiaFilter,
  HueRotationBrowserFilter,
  SaturationFilter, forEachPixel, assignPixel, ICSSFilter,
} from '../src';

// Remember instagram filter definition. Its order is important:
// sepia(.5) hue-rotate(-30deg) saturate(1.4)
const filters: [ICSSFilter, number][] = [
  [SepiaFilter, 50],
  [HueRotationBrowserFilter, -30],
  [SaturationFilter, 140],
];

const Inst1977CSSFilter = createCSSFilter({
  name: 'Inst1977CSSFilter',
  // Define custom getCSSFilter function. We are assuming, that value
  // should be in limits like [0, 100]. Lets call it filter's "intensity".
  getCSSFilter(intensity: number): string {
    // When we are changing from 0 to 100, we should see difference
    // between images. Filter becomes much more noticeable when value comes
    // really close to 100.
    intensity = Math.min(Math.max(intensity, 0), 100) / 100;

    // Loop through each filter and use its settings.
    return filters
      .map(([Filter, value]) => Filter.getCSSFilter(value * intensity))
      .join(' ');
  },
  defaultValue: 0,
  // Custom filter's JS part.
  processImage: (image, intensity, type) => {
    intensity = Math.min(Math.max(intensity, 0), 100) / 100;

    // Loop through each pixel.
    forEachPixel(image, type, ((i, r, g, b) => {
      // Apply all of the filters to pixel.
      filters.forEach(([Filter, value]) => {
        // NOTE: To be replaced in near future.
        const pixel = new ImageData(new Uint8ClampedArray([r, g, b]), 3, 1);
        const {data} = Filter.applyTo(pixel, value * intensity, {type: 'rgb'});
        const _r = data[0];
        const _g = data[0];
        const _b = data[0];

        assignPixel(image, i, [_r, _g, _b]);
      });
    }));

    return image;
  },
});