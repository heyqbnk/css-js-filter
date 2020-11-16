# css-js-filter

Set of predefined CSS filters realised via JS along with
utils to create your own.

## Installation
```bash
yarn add css-js-filter
```
or
```bash
npm i css-js-filter
```

## Usage

### Basic

Each filter class contains realisation for both JS and CSS parts. So, if
it is required to modify image directly (means modify its pixels), then JS
part of filter should be used. In case when the only 1 required thing from 
filter is to display what will happen, when we apply it via JS,we could use 
filter's CSS part.

#### JavaScript / TypeScript

```typescript
import {BrightnessFilter} from 'css-js-filter';

// Lets imagine, we have some canvas with image inside.
const canvas = document.getElementById('canvas');

// Get canvas context.
const context = canvas.getContext('2d');

// Get canvas image data which should be modified.
const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

// Decrease image brightness by 70%
const modifiedImageData = BrightnessFilter.processImage({
  image: imageData, 
  value: 30, 
  type: 'rgba',
});

// Put modified image data on canvas.
context.putImageData(modifiedImageData, 0, 0);

// Now we have new image with decreased brightness on canvas!
```

#### CSS
In case when there is no real need to modify image directly, it is
strongly recommended to use CSS part of filters. Remember, that use of CSS 
works much faster than JS does. 

You could use CSS filters when the only 1 thing is required from filters - 
to display what happens, when you apply them.

Then, when you should really apply filters to image and download it, you have 
to switch to JS way.  

Let's look how it works.

```typescript
import {BrightnessFilter, SaturationFilter} from 'css-js-filter';

const canvas = document.getElementById('canvas');

// Get filter CSS representation.
const brightnessFilter = BrightnessFilter.getCSSFilter(30);
const saturationFilter = SaturationFilter.getCSSFilter(23);

// As a result, we are getting here value "brightness(30%) saturate(23%)".
const cssFilter = [brightnessFilter, saturationFilter].join(' ');

// Then, we should use created filter in canvas style (or any other 
// element).
canvas.style.filter = cssFilter;

// ...and, thats all!
```

Moreover, created CSS filter is compatible with canvas context's filter 
property. Nevertheless, context's filter is not supported by some browsers.

```typescript
import {BrightnessFilter, SaturationFilter} from 'css-js-filter';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Get filter CSS representation.
const brightnessFilter = BrightnessFilter.getCSSFilter(30);
const saturationFilter = SaturationFilter.getCSSFilter(23);

// As a result, we are getting here value "brightness(30%) saturate(23%)".
const cssFilter = [brightnessFilter, saturationFilter].join(' ');
context.filter = cssFilter;

// Then, we should draw image or some another primitive. Pay attention to the 
// moment, that we are not using putImageData due to this method avoids all
// modifications and replaces pixels directly.
const image = new Image();
image.src = '...';
image.onload = () => context.drawImage(image, 0, 0);
```

Of course, you could use those filters not only for canvas but the other
html elements. It only generates a string, compatible with CSS's filter
property.

### Advanced

#### Creating Instagram filter

As an example, we take Instagram's filter "1977". According to this 
[link](https://github.com/picturepan2/instagram.css/blob/b08f80f0578926e24ad195a26bdc0fc7f46749da/dist/instagram.css#L16), 
we can find out which CSS filters are applied when this filter is used. So,
lets try to create JS filter for "1977".

```typescript
import {
  composeCSSFilters,
  SepiaFilter,
  HueRotationBrowserFilter,
  SaturationFilter,
} from 'css-js-filter';

// Remember instagram filter definition. Its order is important:
// sepia(.5) hue-rotate(-30deg) saturate(1.4)
const Inst1977CSSFilter = composeCSSFilters({
  name: 'Inst1977CSSFilter',
  filters: [
    [SepiaFilter, 50],
    [HueRotationBrowserFilter, -30],
    [SaturationFilter, 140],
  ],
});
```

## Preview

Firstly, clone repository:

```bash
git clone git@github.com:wolframdeus/css-js-filter.git
```

After, when repository is cloned, install all dependencies:
```bash
yarn install
```

Finally, run preview and go to http://localhost:9000 :
```bash
yarn dev:browser
```