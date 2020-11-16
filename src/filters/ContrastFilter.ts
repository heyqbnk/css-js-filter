import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const ContrastFilter = createCSSFilter({
  cssFunctionName: 'contrast',
  cssFunctionValuePostfix: '%',
  defaultValue: 100,
  name: 'ContrastFilter',
  processImage: ColorsFilter.contrast.bind(ColorsFilter),
});
