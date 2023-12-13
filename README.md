# Utils

Utils is a lightweight and versatile JavaScript utility class designed to provide commonly used functions for web development. It is a collection of various helper functions that can be used in a variety of projects.

# Usage
To use Utils in your project, simply import it as follows:

```js
import { Utils } from './utils.min.mjs';
```

You can then call any of the functions available in the Utils class.

# API
decimalRand(pNum1, pNum2, pPlaces)
- Generates a random decimal number between **`pNum1`** and **`pNum2`** with **`pPlaces`** decimal places.

rand(pNum1, pNum2)
- Generates a random integer between **`pNum1`** and **`pNum2`**.

getPercentage(pValue, pTotalValue)
- Calculates the percentage of **`pValue`** in relation to **`pTotalValue`**.

clamp(pNumber, pMin, pMax)
- Clamps **`pNumber`** between **`pMin`** and **`pMax`**.

lerp(pStart, pEnd, pAmount)
- Linearly interpolates between **`pStart`** and **`pEnd`** by **`pAmount`**.

flooredLerp(pStart, pEnd, pAmount)
- Linearly interpolates between **`pStart`** and **`pEnd`** by **`pAmount`**, then floors the result.

round(pNumber, pPlace)
- Rounds pNumber to **`pPlace`** decimal places.

normalize(pVal, pMin, pMax)
- Normalizes pVal between **`pMin`** and **`pMax`**.

within(pVal, pMin, pMax)
- Checks if **`pVal`** is within the range of **`pMin`** and **`pMax`**.

formatIntegerWithCommas(pNum)
- Formats **`pNum`** as a string with commas between every three digits.

toRadians(pDegrees)
- Converts degrees to radians.

toDegrees(pRadians)
- Converts radians to degrees.

pick(pArray)
- Returns a random element from **`pArray`**.

removeProperties(pObject, pExclude)
- Removes all properties from **`pObject`**, excluding those in **`pExclude`**.

prob(pChance)
- Returns true with a probability of **`pChance`**, and false with a probability of **`100 - pChance`**.

getInverseDir(pDir)
- Returns the opposite direction of **`pDir`**.

getAngleFromDir(pDir)
- Returns the angle in radians corresponding to **`pDir`**.

generateID(pIDLength)
- Generates a random unique ID string of length **`pIDLength`**.

decimalToHex(pDecimal, pChars)
- Converts a decimal number to a hexadecimal color string with pChars characters. **`pChars`** can either be **`3`** or **`6`**.

addIntensity(pColor, pPercent)
- Increases the intensity of pColor by **`pPercent`** **`percent`**.

rgbToHex(pR, pG, pB)
- Converts an RGB color to a hexadecimal color string.

hexToRgb(pHex)
- Converts a hexadecimal color string to an RGB color.

rgbToDecimal(pR, pG, pB)
- Converts an RGB color to a decimal number.

hexToDecimal(pHex)
- Converts a hexadecimal color string to a decimal number.

grabColor(pSwitch, pG, pB)
- Returns a color object with a hexadecimal color string, tagless hexadecimal color string, RGB string, RGB color array, RGB normalized array, RGB object, and decimal color number. If **`pSwitch`** is a number, **`pG`** and **`pB`** must also be numbers and represent the green and blue components of the color respectively. If **`pSwitch`** is a string, it can either be a hexadecimal color string or a decimal color.

getRandomColor()
- Gets a random color in the hex format.

getRandomColorBetween(pColor1, pColor2, pAmount = 0.5)
- Gets a random color between **`pColor1`** and **`pColor2`** in the decimal format. **`pAmount`** can be used to change how close the returned color is to either **`pColor1`** or **`pColor2`**.

transitionColor(pInstance, pStartColor='#000', pEndColor='#fff', pDuration=1000, pIterativeCallback, pEndCallback)
- Transition **`pStartColor`** to **`pEndColor`** in **`pDuration`** time with callbacks to track the animation. Where **`pIterativeCallback`** is called each frame and **`pEndCallback`** is called at the end of the animation. This API returns the **`ID`** of the transition. So that if you want to cancel it, you can use **`cancelTransitionColor(ID)`**.

cancelTransitionColor(pID)
- Cancels an ongoing transition with the **`ID`** of **`pID`**.

getPointRotated(pRect, pTheta, pPoint)v
- Calculates the position of a point after rotating it around a center point by a given angle.
- @param {object} pRect - The rectangle object to rotate the point around. pRect.anchor.x and pRecent.anchor.y is used to control the "center" of the rectangle.
- @param {number} pTheta - The angle (in radians) to rotate the point by.
- @param {object} pPoint - The point object to rotate around the center of the rectangle.
- @param {number} pPoint.x - The x-coordinate of the point to rotate.
- @param {number} pPoint.y - The y-coordinate of the point to rotate.
- @returns {object} An object with the rotated point's new x and y coordinates.

getPointsOfRotatedRect(pRect, pTheta)
- @param {object} pRect - The rectangle object to rotate the point around. **`pRect.anchor.x`** and **`pRecent.anchor.y`** is used to control the "center" of the rectangle.
- @param {number} pTheta - The angle (in radians) to rotate the point by.
- @returns {object} An object with the rotated rectangle's new corner points and center points.