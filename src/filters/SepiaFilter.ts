import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';

export const SepiaFilter = createCSSFilter({
  cssFunctionName: 'sepia',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'SepiaFilter',
  processImage(image, amount, type) {
    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.sepia(r, g, b, amount / 100));
    }));

    return image;
  },
});