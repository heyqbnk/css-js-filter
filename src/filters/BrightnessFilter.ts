import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';

export const BrightnessFilter = createCSSFilter({
  cssFunctionName: 'brightness',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'BrightnessFilter',
  processImage(image, amount, type) {
    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.brighten(r, g, b, amount / 100));
    }));

    return image;
  },
});
