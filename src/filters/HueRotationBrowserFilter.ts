import {createCSSFilter} from '../createCSSFilter';
import {ColorsFilter} from '../ColorsFilter';

export const HueRotationBrowserFilter = createCSSFilter({
  cssFunctionName: 'hue-rotate',
  cssFunctionValuePostfix: 'deg',
  defaultValue: 0,
  name: 'HueRotationBrowserFilter',
  processImage: ColorsFilter.rotateHueBrowser.bind(ColorsFilter),
});
