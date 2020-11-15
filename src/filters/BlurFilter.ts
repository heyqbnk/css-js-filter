import {createCSSFilter} from '../createCSSFilter';
import {imageDataRGB, imageDataRGBA} from 'stackblur-canvas';

export const BlurFilter = createCSSFilter({
  cssFunctionName: 'blur',
  cssFunctionValuePostfix: 'px',
  defaultValue: 0,
  name: 'BlurFilter',
  processImage(image, radius, type) {
    if (type === 'rgba') {
      return imageDataRGBA(image, 0, 0, image.width, image.height, radius * 2);
    }
    return imageDataRGB(image, 0, 0, image.width, image.height, radius * 2);
  },
});
