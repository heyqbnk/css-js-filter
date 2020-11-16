import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const SepiaFilter = createCSSFilter({
  cssFunctionName: 'sepia',
  cssFunctionValuePostfix: '%',
  defaultValue: 0,
  name: 'SepiaFilter',
  processImage: ColorsFilter.sepia.bind(ColorsFilter),
});