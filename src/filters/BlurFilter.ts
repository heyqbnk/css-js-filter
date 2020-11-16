import {createCSSFilter} from '../createCSSFilter';
import {imageDataRGB, imageDataRGBA} from 'stackblur-canvas';

export const BlurFilter = createCSSFilter({
  cssFunctionName: 'blur',
  cssFunctionValuePostfix: 'px',
  defaultValue: 0,
  name: 'BlurFilter',
  processImage(options) {
    const {value, type, image, from, to} = options;

    if (type === 'rgba') {
      // FIXME
      return imageDataRGBA(image, 0, 0, image.width, image.height, value * 2);
    }
    // FIXME
    return imageDataRGB(image, 0, 0, image.width, image.height, value * 2);
  },
});
