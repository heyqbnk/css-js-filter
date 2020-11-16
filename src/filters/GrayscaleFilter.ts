import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const GrayscaleFilter = createCSSFilter({
  cssFunctionName: 'grayscale',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'GrayscaleFilter',
  processImage: ColorsFilter.grayscale.bind(ColorsFilter),
});
