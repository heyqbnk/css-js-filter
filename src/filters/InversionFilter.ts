import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const InversionFilter = createCSSFilter({
  cssFunctionName: 'invert',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'GrayscaleFilter',
  processImage: ColorsFilter.invert.bind(ColorsFilter),
});
