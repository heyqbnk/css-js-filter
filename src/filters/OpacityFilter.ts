import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const OpacityFilter = createCSSFilter<'rgba'>({
  cssFunctionName: 'opacity',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'OpacityFilter',
  processImage: ColorsFilter.opacify.bind(ColorsFilter),
});
