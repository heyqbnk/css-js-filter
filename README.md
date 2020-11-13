# css-js-filter

Set of predefined CSS filters realised via JS along with
utils to create your own.

## Usage

### Using predefined filters

#### With Javascript
If we want to modify images directly, we have to use filter's
JS part.

```typescript
import {BrightnessFilter} from 'css-js-filter';

// Lets imagine, we have some canvas with image inside.
const canvas = document.getElementById('canvas');

// Get canvas context.
const context = canvas.getContext('2d');

// Get canvas image data.
const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

// Decrease image brightness by 70%
// Variant 1:
const modifiedBytes = BrightnessFilter.applyTo(imageData.data, 30);
const modifiedImageData = new ImageData(modifiedBytes, imageData.width, imageData.height);

// Variant 2 (better way):
const modifiedImageData = BrightnessFilter.applyTo(imageData, 30);

// Put modified image data on canvas.
context.putImageData(modifiedImageData, 0, 0);

// Now we have new image with decreased brightness on canvas!
```

#### With CSS
In case when there is no real need to modify pixels directly, it is
strongly recommended to use CSS way. Remember, that use of CSS works much
faster than JS does. Let's look how it works.

```typescript
import {BrightnessFilter} from 'css-js-filter';

// Lets imagine, we have some canvas with image inside.
const canvas = document.getElementById('canvas');

// Get filter CSS representation. As a result, we are getting
// here value "brightness(30%)".
const cssFilter = BrightnessFilter.getCSSFilter(30);

// Then, we should use created filter in canvas style.
canvas.style.filter = cssFilter;

// ...and, thats all!
```

Of course, you could use those filters not only for canvas but the other
html elements. It only generates a string, compatible for CSS's filter
property.