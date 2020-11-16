import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const BrightnessFilter = createCSSFilter({
  cssFunctionName: 'brightness',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'BrightnessFilter',
  processImage: ColorsFilter.brighten.bind(ColorsFilter),
});
