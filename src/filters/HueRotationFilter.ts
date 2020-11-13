import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';

export const HueRotationFilter = createCSSFilter({
  cssFunctionName: 'hue-rotate',
  cssFunctionValuePostfix: 'deg',
  defaultValue: 0,
  name: 'HueRotationFilter',
  processImage(image, angle, type) {
    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.hueRotation(r, g, b, angle));
    }));

    return image;
  },
});
