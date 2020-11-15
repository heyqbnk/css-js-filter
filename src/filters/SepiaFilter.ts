import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';

export const SepiaFilter = createCSSFilter({
  cssFunctionName: 'sepia',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'SepiaFilter',
  processImage(image, amount, type) {
    const multiplier = amount / 100;

    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.sepia(r, g, b, multiplier));
    }));

    return image;
  },
});