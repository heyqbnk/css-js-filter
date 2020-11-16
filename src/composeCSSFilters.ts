import {ICSSFilter} from './types';
import {createCSSFilter} from './createCSSFilter';
import {getBytesCount} from './utils';

interface IOptions {
  /**
   * CSS filter name.
   */
  name?: string;
  /**
   * Array of tuples, where filter is specified on the first place, and
   * its usual value on the second.
   */
  filters: [ICSSFilter, number][];
}

/**
 * Composes several CSS filters. As value, accepts
 * @param {IOptions} options
 * @returns {ICSSFilter}
 */
export function composeCSSFilters(options: IOptions): ICSSFilter {
  const {name, filters} = options;

  return createCSSFilter({
    name,
    getCSSFilter(intensity: number): string {
      // When we are changing from 0 to 100, we should see difference
      // between images. Filter becomes much more noticeable when value comes
      // really close to 100.
      intensity = Math.min(Math.max(intensity, 0), 100) / 100;

      // Loop through each filter and use its settings.
      return filters
        .map(([Filter, value]) => Filter.getCSSFilter(value * intensity))
        .join(' ');
    },
    defaultValue: 0,
    processImage: (options) => {
      const {type, value, from, to, image} = options;
      const bytesCount = getBytesCount(type);
      const intensity = Math.min(Math.max(value, 0), 100) / 100;
      const dataCopy = image.data.slice();

      // Apply all of the filters.
      filters.forEach(([Filter, value]) => {
        Filter.processImage({image, value, type, from, to});
      });
      const {data} = image;

      for (let i = 0; i < data.length; i += bytesCount) {
        for (let j = 0; j < bytesCount; j++) {
          const targetValue = data[i];
          const diff = targetValue - dataCopy[i + j];
          data[i] = dataCopy[i + j] + diff * intensity;
        }
      }
    },
  });
}