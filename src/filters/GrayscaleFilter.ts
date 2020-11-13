import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';
import {ColorsFilter} from '../ColorsFilter';

export const GrayscaleFilter = createCSSFilter({
  cssFunctionName: 'grayscale',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'GrayscaleFilter',
  processImage(image, amount, type) {
    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.grayscale(r, g, b, amount / 100));
    }));

    return image;
  },
});
