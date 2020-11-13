import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';

export const SaturationFilter = createCSSFilter({
  cssFunctionName: 'saturate',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'SaturationFilter',
  processImage(image, amount, type) {
    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.saturate(r, g, b, amount / 100));
    }));

    return image;
  },
});
