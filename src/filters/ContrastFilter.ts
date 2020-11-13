import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';

export const ContrastFilter = createCSSFilter({
  cssFunctionName: 'contrast',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'ContrastFilter',
  processImage(image, amount, type) {
    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.contrast(r, g, b, amount / 100));
    }));

    return image;
  },
});
