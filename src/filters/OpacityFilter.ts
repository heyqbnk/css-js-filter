import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const OpacityFilter = createCSSFilter<number, 'rgba'>({
  cssFunctionName: 'opacity',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'OpacityFilter',
  processImage: (image, value, type) => {
    const multiplier = value / 100;
    const {data} = image;

    for (let i = 3; i < data.length; i += 4) {
      data[i] = ColorsFilter.opacify(data[i], multiplier);
    }
    return image;
  },
});
