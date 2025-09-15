# Utils Module

Utils is a lightweight and versatile TypeScript utility class designed to provide commonly used functions for web development. It is a collection of various helper functions that can be used in a variety of projects.

## Installation

### ES Module

```js
import { Utils } from './utils.js';
// or
import { utils } from './utils.js';
```

### IIFE (Immediately Invoked Function Expression)

```js
<script src="utils-iife.js"></script>
// ...
// Utils is available globally
```

### TypeScript

```ts
import { Utils, UtilsSingleton, utils } from './utils';

// Use the singleton instance
const randomNum = Utils.rand(1, 10);

// Or use the class directly
const myUtils = new UtilsSingleton();
const color = myUtils.getRandomColor();
```

## Documentation

For complete API documentation with examples, visit the [generated documentation](./docs/).

## Features

- **Mathematical utilities**: Random numbers, interpolation, normalization, clamping
- **Color manipulation**: RGB/Hex conversion, color transitions, random colors
- **Geometric calculations**: Angles, distances, rotations, positioning
- **Array and object utilities**: Picking, property removal, formatting
- **Animation helpers**: Color transitions with callbacks
- **TypeScript support**: Full type definitions and IntelliSense

## Quick Start

```ts
import { Utils } from './utils';

// Generate random numbers
const randomInt = Utils.rand(1, 100);
const randomDecimal = Utils.decimalRand(0, 1, 2);

// Work with colors
const hexColor = Utils.rgbToHex(255, 0, 0); // "#ff0000"
const randomColor = Utils.getRandomColor();

// Calculate distances and angles
const distance = Utils.getDistance({x: 0, y: 0}, {x: 3, y: 4}); // 5
const angle = Utils.getAngle({x: 0, y: 0}, {x: 1, y: 1});

// Format numbers
const formatted = Utils.formatIntegerWithCommas(1234567); // "1,234,567"


```

### Global Dependency
Utils relies on the `VYLO` variable being globally accessible in some APIs.