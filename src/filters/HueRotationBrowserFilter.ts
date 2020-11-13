import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';
import {assignPixel, forEachPixel} from '../utils';

export const HueRotationBrowserFilter = createCSSFilter({
  cssFunctionName: 'hue-rotate',
  cssFunctionValuePostfix: 'deg',
  defaultValue: 0,
  name: 'HueRotationBrowserFilter',
  processImage(image, angle, type) {
    forEachPixel(image, type, ((i, r, g, b) => {
      assignPixel(image, i, ColorsFilter.hueRotationBrowser(r, g, b, angle));
    }));

    return image;
  },
});
