import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';
import {ColorsFilter} from '../ColorsFilter';

export const InversionFilter = createCSSFilter({
  cssFunctionName: 'invert',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'GrayscaleFilter',
  processImage(image, amount, type) {
    const multiplier = amount / 100;

    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.invert(r, g, b, multiplier));
    }));

    return image;
  },
});
