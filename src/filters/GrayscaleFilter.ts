import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';
import {ColorsFilter} from '../ColorsFilter';

export const GrayscaleFilter = createCSSFilter({
  cssFunctionName: 'grayscale',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'GrayscaleFilter',
  processImage(image, amount, type) {
    const multiplier = amount / 100;

    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.grayscale(r, g, b, multiplier));
    }));

    return image;
  },
});
