import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const OpacityFilter = createCSSFilter<number, 'rgba'>({
  cssFunctionName: 'opacity',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'OpacityFilter',
  processImage: (image, value, type) => {
    const multiplier = value / 100;

    for (let i = 3; i < image.length; i += 4) {
      image[i] = ColorsFilter.opacify(image[i], multiplier);
    }
    return image;
  },
});
