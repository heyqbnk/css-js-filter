import {ColorsFilter} from '../ColorsFilter';
import {createCSSFilter} from '../createCSSFilter';

export const SaturationFilter = createCSSFilter({
  cssFunctionName: 'saturate',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'SaturationFilter',
  processImage: ColorsFilter.saturate.bind(ColorsFilter),
});
