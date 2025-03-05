import { Logger } from './vendor/logger.min.mjs';

/**
* A utilities class
* @class UtilsSingleton
* @license Utils is free software, available under the terms of a MIT style License.
* @author https://github.com/doubleactii
*/
class UtilsSingleton {
	/**
	 * Object storing all color objects being transitioned at the moment
	 * @private
	 * @type {Object}
	 */
	transitions = {};
	/**
	 * An array storing all the reserved unique IDS
	 * @private
	 * @type {Array}
	 */
	storedIDs = [];
	/**
	 * The version of the module.
	 */
	version = "VERSION_REPLACE_ME";
	constructor() {
        // Create a logger
        /** The logger module this module uses to log errors / logs
         * @private
         * @type {Object}
         */
        this.logger = new Logger();
        this.logger.registerType('Utils-Module', '#ff6600');
	}
	/**
	 * Generates a random decimal number between two numbers with a specified number of decimal places.
	 * 
	 * @param {number} pNum1 - The first number to use for generating the random decimal number.
	 * @param {number} pNum2 - The second number to use for generating the random decimal number.
	 * @param {number} [pPlaces=1] - The number of decimal places to include in the generated random decimal number. Defaults to 1 if not provided.
	 * @returns {number} A random decimal number between the two numbers with the specified number of decimal places.
	 */
	decimalRand(pNum1, pNum2, pPlaces = 1) {
		const result = Number((Math.random() * (pNum1 - pNum2) + pNum2).toFixed(pPlaces));
		return result;
	}
	/**
	 * Generates a random decimal number between two numbers with a specified number of decimal places.
	 * 
	 * @param {number} pNum1 - The first number to use for generating the random decimal number.
	 * @param {number} pNum2 - The second number to use for generating the random decimal number.
	 * @returns {number} A random decimal number between the two numbers with the specified number of decimal places.
	 */
	rand(pNum1, pNum2) {
		const result = Number((Math.random() * (pNum1 - pNum2) + pNum2));
		return Math.round(result);
	}
	/**
	 * Calculates the percentage of a value relative to a total value.
	 * 
	 * @param {number} pValue - The value to calculate the percentage of.
	 * @param {number} pTotalValue - The total value to calculate the percentage relative to.
	 * @returns {number} The percentage of the value relative to the total value.
	 */
	getPercentage(pValue, pTotalValue) {
		return (100 * pValue) / pTotalValue;
	}
	/**
	 * Clamps a number between a minimum and maximum value.
	 * 
	 * @param {number} pNumber - The number to clamp.
	 * @param {number} [pMin=0] - The minimum value to clamp the number to. Defaults to 0 if not provided.
	 * @param {number} [pMax=1] - The maximum value to clamp the number to. Defaults to 1 if not provided.
	 * @returns {number} The clamped number between the minimum and maximum values.
	 */
	clamp(pNumber, pMin = 0, pMax = 1) {
		return Math.max(pMin, Math.min(pNumber, pMax));
	}
	/**
	 * Linearly interpolates between two values by a specified amount.
	 * 
	 * @param {number} pStart - The start value to interpolate from.
	 * @param {number} pEnd - The end value to interpolate to.
	 * @param {number} pAmount - The amount to interpolate between the start and end values.
	 * @returns {number} The interpolated value between the start and end values based on the specified amount.
	 */
	lerp(pStart, pEnd, pAmount) {
		return (1-pAmount)*pStart+pAmount*pEnd;
	}
	/**
	 * Linearly interpolates between two values by a specified amount and returns the result as a floored integer.
	 * 
	 * @param {number} pStart - The start value to interpolate from.
	 * @param {number} pEnd - The end value to interpolate to.
	 * @param {number} pAmount - The amount to interpolate between the start and end values.
	 * @returns {number} The interpolated value between the start and end values based on the specified amount, rounded down to the nearest integer.
	 */
	flooredLerp(pStart, pEnd, pAmount) {
		return Math.floor(this.lerp(pStart, pEnd, pAmount));
	}
	/**
	 * Rounds a number to a specified number of decimal places.
	 * 
	 * @param {number} pNumber - The number to round.
	 * @param {number} [pPlace=1] - The number of decimal places to round to. Defaults to 1 if not provided.
	 * @returns {number} The rounded number to the specified number of decimal places.
	 */
	round(pNumber, pPlace=1) {
		return Math.round(pPlace * pNumber) / pPlace;
	}
	/**
	 * Normalizes a value between a minimum and maximum value.
	 * 
	 * @param {number} pVal - The value to normalize.
	 * @param {number} pMin - The minimum value for normalization.
	 * @param {number} pMax - The maximum value for normalization.
	 * @returns {number} The normalized value between 0 and 1 based on the input value's position between the minimum and maximum values.
	 * If the difference between pMax and pMin is 0, returns 1 to avoid dividing by zero.
	 */
	normalize(pVal, pMin, pMax) {
		if (pMax - pMin === 0) return 1;
		return (pVal - pMin) / (pMax - pMin);
	}
	/**
	 * Normalizes a value between a minimum and maximum value, clamped to the range of -1 to 1.
	 *
	 * @param {number} pVal - The value to normalize.
	 * @param {number} pMin - The minimum value for normalization.
	 * @param {number} pMax - The maximum value for normalization.
	 * @returns {number} The normalized and clamped value between -1 and 1 based on the input value's
	 * position between the minimum and maximum values. If the difference between pMax and pMin is 0,
	 * returns 1 to avoid dividing by zero.
	 */
	normalizeRanged(pVal, pMin, pMax) {
		if (pMax - pMin === 0) return 1;
		const normalizedValue = -((2 * this.normalize(pVal, pMin, pMax)) - 1);
		// Clamp the normalized value to the range of -1 to 1
		return this.clamp(normalizedValue, -1, 1);
	};
	/**
	 * Checks if a value is within a range of minimum and maximum values (inclusive).
	 * 
	 * @param {number} pVal - The value to check.
	 * @param {number} pMin - The minimum value of the range to check against.
	 * @param {number} pMax - The maximum value of the range to check against.
	 * @returns {boolean} True if the value is within the range (inclusive), false otherwise.
	 */
	within(pVal, pMin, pMax) {
		return pVal >= pMin && pVal <= pMax;
	}
	/**
	 * Formats a number by rounding it to the nearest integer and adding commas to separate thousands places.
	 * 
	 * @param {number} pNum - The number to format.
	 * @returns {string} A string representation of the formatted number.
	 */
	formatIntegerWithCommas(pNum) {
		return pNum.toFixed().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}
	/**
	 * Converts degrees to radians.
	 * 
	 * @param {number} pDegrees - The angle in degrees.
	 * @returns {number} The angle in radians.
	 */
	toRadians(pDegrees) {
		return pDegrees * (Math.PI / 180);
	}
	/**
	 * Converts radians to degrees.
	 * 
	 * @param {number} pRadians - The angle in radians.
	 * @returns {number} The angle in degrees.
	 */
	toDegrees(pRadians) {
		return pRadians * (180 / Math.PI);
	}
	/**
	 * Returns a random element from the given array.
	 * 
	 * @param {Array} pArray - The input array.
	 * @returns {*} A random element from the array.
	 */
	pick(pArray) {
		const randomIndex = Math.floor(Math.random() * pArray.length);
		return pArray[randomIndex];
	}
	/**
	 * Removes properties from an object except those listed in the exclude array.
	 * 
	 * @param {object} pObject - The object to remove properties from.
	 * @param {Array} pExclude - The array of property names to exclude from removal.
	*/
	removeProperties(pObject, pExclude) {
		if (typeof(pObject) === 'object') {
			for (const prop in pObject) {
				// Do not reset these properties.
				if (Array.isArray(pExclude) && pExclude.includes(prop)) continue;
				if (pObject.hasOwnProperty(prop)) {
					delete pObject[prop];
				}
			}
		}	
	}
	/**
	 * Returns true with probability proportional to the given number.
	 * The higher the number, the higher the chance of returning true.
	 * 
	 * @param {number} pChance - The probability value, between 0 and 100 (inclusive).
	 * @returns {boolean} - Returns true or false, based on the probability value.
	 */
	prob(pChance) {
		if (pChance <= 0) {
			return false;
		}
		if (pChance >= 100) {
			return true;
		}
		const randomNumber = Math.floor(Math.random() * 100) + 1;
		return randomNumber <= pChance;
	}
	/**
	 * Gets the inverse direction of the direction passed
	 * 
	 * @param {string} pDirection - The direction to get the inverse of.
	 * @returns {string} The inverse direction
	 */
	getInverseDirection(pDirection) {
		switch (pDirection) {
			case 'north':
				return 'south';
			case 'south':
				return 'north';
			case 'east':
				return 'west';
			case 'west':
				return 'east';
			case 'northeast':
				return 'southwest';
			case 'northwest':
				return 'southeast';
			case 'southeast':
				return 'northwest';
			case 'southwest':
				return 'northeast';
			default:
				this.logger.prefix('Utils-Module').error(`The direction ${pDirection} is not supported.`);
		}
	}
	/**
	 * Calculates the angle (in radians) from a given direction.
	 * 
	 * @param {string} pDirection - The direction to calculate the angle from.
	 * @returns {number} The angle (in radians) associated with the given direction.
	 * @throws {Error} Throws an error if the direction is not recognized.
	 */
	getAngleFromDirection(pDirection) {
		switch (pDirection) {
			case 'north':
				return Math.PI / 2;
			case 'south':
				return (Math.PI * 3) / 2; // Corrected to 270 degrees in radians
			case 'east':
				return 0;
			case 'west':
				return Math.PI;
			case 'northwest':
				return (Math.PI * 3) / 4;
			case 'northeast':
				return Math.PI / 4;
			case 'southwest':
				return (Math.PI * 5) / 4;
			case 'southeast':
				return (Math.PI * 7) / 4;
			default:
				this.logger.prefix('Utils-Module').error(`The direction ${pDirection} is not supported.`);
		}
	}
	/**
	 * Centers a rectangle (defined by its dimensions) within a parent rectangle.
	 *
	 * @param {number} pChildWidth - The width of the child rectangle.
	 * @param {number} pChildHeight - The height of the child rectangle.
	 * @param {number} pParentWidth - The width of the parent rectangle.
	 * @param {number} pParentHeight - The height of the parent rectangle.
	 * @param {number} pParentX - The x-coordinate of the parent rectangle.
	 * @param {number} pParentY - The y-coordinate of the parent rectangle.
	 * @returns {Object} An object representing the new coordinates of the centered rectangle: { x: centerX, y: centerY }.
	 *
	 * @example
	 * const childWidth = 50;
	 * const childHeight = 30;
	 * const parentWidth = 100;
	 * const parentHeight = 80;
	 * const parentX = 20;
	 * const parentY = 10;
	 * const centeredCoordinates = centerRectangleOnParent(childWidth, childHeight, parentWidth, parentHeight, parentX, parentY);
	 * // Returns {x: 45, y: 35}
	 */
	centerRectangleOnParent(pChildWidth, pChildHeight, pParentWidth, pParentHeight, pParentX, pParentY) {
		const centerX = pParentX + ((pParentWidth - pChildWidth) / 2);
		const centerY = pParentY + ((pParentHeight - pChildHeight) / 2);
		return { x: centerX, y: centerY };
	}
	/**
	 * Generates a random angle in radians.
	 * @returns {number} A random angle in radians.
	 */
	getRandomAngle() {
		return Math.random() * (Math.PI * 2); // Random value between 0 and 2*pi (360 degrees)
	}
	/**
	 * Gets the angle between two points
	 * 
	 * @param {Object} pStartPoint - The starting point
	 * @param {Object} pEndPoint - The ending point
	 * @returns {number} The angle between the starting point and the ending point
	 */
	getAngle(pStartPoint, pEndPoint) {
		const y = pStartPoint.y - pEndPoint.y;
		const x = pStartPoint.x - pEndPoint.x;
		return Math.atan2(y, x);
	}
	/**
	 * Gets the angle between two points but in VYLO / PIXI coordinate space. Removes 180 degrees from a raw angle
	 * 
	 * @param {Object} pStartPoint - The starting point
	 * @param {Object} pEndPoint - The ending point
	 * @returns {number} The angle between the starting point and the ending point
	 */
	getAngle2(pStartPoint, pEndPoint) {
		const y = pStartPoint.y - pEndPoint.y;
		const x = pStartPoint.x - pEndPoint.x;
		return (Math.atan2(y, x) - Math.PI) * -1;
	}
	/**
	 * Converts a raw angle to be the proper angle in Vylocity. By removing 180 degrees
	 * @param {number} pAngle - The angle to convert.
	 * @returns The converted angle
	 */
	convertRaWAngleToVyloCoords(pAngle) {
		return (pAngle - Math.PI) * -1;
	}
	/**
	 * Gets the minimal value between the value to add and the maximum allowed value.
	 * 
	 * @param {number} pCurrent - The current value.
	 * @param {number} pAdd - The value to add to the current value.
	 * @param {number} pMax - The maximum value that can be reached.
	 * @returns {number} The minimal value between the value to add and the remaining value to reach the maximum.
	 */
	getMinimal(pCurrent, pAdd, pMax) {
		const max = pMax - pCurrent;
		return Math.min(pAdd, max);
	}
	/**
	 * Calculates the Euclidean distance between two points in a two-dimensional space.
	 *
	 * @param {Object} pStartPoint - The starting point with x and y coordinates.
	 * @param {number} pStartPoint.x - The x-coordinate of the starting point.
	 * @param {number} pStartPoint.y - The y-coordinate of the starting point.
	 * @param {Object} pEndPoint - The ending point with x and y coordinates.
	 * @param {number} pEndPoint.x - The x-coordinate of the ending point.
	 * @param {number} pEndPoint.y - The y-coordinate of the ending point.
	 * @returns {number} The Euclidean distance between the two points.
	 *
	 * @example
	 * const startPoint = { x: 1, y: 2 };
	 * const endPoint = { x: 4, y: 6 };
	 * const distance = getDistance(startPoint, endPoint); // 5
	 * // Returns the Euclidean distance between the points (1, 2) and (4, 6).
	 */
	getDistance(pStartPoint, pEndPoint) {
		const y = (pStartPoint.y - pEndPoint.y);
		const x = (pStartPoint.x - pEndPoint.x);
		return Math.sqrt((x * x) + (y * y));
	}
	/**
	 * Calculates the new position of a point based on distance and angle.
	 *
	 * @param {Object} pPoint - The initial position of the point with x and y coordinates.
	 * @param {number} pPoint.x - The initial x-coordinate of the point.
	 * @param {number} pPoint.y - The initial y-coordinate of the point.
	 * @param {number} pDistance - The distance by which to move the point.
	 * @param {number} pAngle - The angle (in radians) at which to move the point.
	 * @returns {Object} The new position of the point after moving by the specified distance and angle.
	 *
	 * @example
	 * const initialPosition = { x: 10, y: 20 };
	 * const distance = 5;
	 * const angleInRadians = 0.785398; // 45 degrees
	 * const newPosition = calculateNewPositionFromDistanceAndAngle(initialPosition, distance, angleInDegrees);
	 * // Returns the new position of the point after moving by 5 units at a 45-degree angle.
	 */
	calculateNewPositionFromDistanceAndAngle(pPoint, pDistance, pAngle) {
		const newPosition = { x: 0, y: 0 };
		newPosition.x = pPoint.x - pDistance * Math.cos(pAngle);
		newPosition.y = pPoint.y - pDistance * Math.sin(pAngle);
		return newPosition;
	};
	/**
	 * Calculates the proportional length based on a current value, a maximum value, and a specified total length.
	 *
	 * @param {number} pCurrent - The current value to be scaled.
	 * @param {number} pMax - The maximum value for scaling.
	 * @param {number} pTotalLength - The specified total length.
	 * @returns {number} The proportional length based on the current value, maximum value, and total length.
	 *
	 * @example
	 * const current = 25;
	 * const max = 50;
	 * const totalLength = 100;
	 * const proportionalLength = calculateProportionalLength(current, max, totalLength); // 50
	 * // Returns the proportional length based on the current value, maximum value, and total length.
	 */
	calculateProportionalLength(pCurrent, pMax, pTotalLength) {
		return (pCurrent / pMax) * pTotalLength;
	}
	/**
	 * Calculates the compass direction based on the given angle.
	 *
	 * @param {number} pAngle - The angle in radians.
	 * @returns {string} The compass direction (e.g., 'east', 'southeast', 'south', etc.).
	 *
	 * @example
	 * const angle = Math.PI / 4; // 45 degrees in radians
	 * const direction = getDirection(angle); // Returns 'northeast'
	 */
	getDirection(pAngle) {
		const degree = Math.abs(Math.floor(((pAngle * (180 / Math.PI)) / 45) + 0.5));
		// 0 or 360 degrees: 'east'
		// 45 degrees: 'northeast'
		// 90 degrees: 'north'
		// 135 degrees: 'northwest'
		// 180 degrees: 'west'
		// 225 degrees: 'southwest'
		// 270 degrees: 'south'
		// 315 degrees: 'southeast'
		const compassDirections = ['east', 'northeast', 'north', 'northwest', 'west', 'southwest', 'south', 'southeast'];
		return compassDirections[(degree % 8)];
	}
	/**
	 * Calculates the linear decay of a variable over time.
	 *
	 * @param {number} pInitialValue - The initial value of the variable.
	 * @param {number} pCurrentTime - The current time at which to calculate the variable value.
	 * @param {number} pMaxTime - The maximum time for the decay process.
	 * @param {number} [pDecayRate=0.5] - The decay rate (default is 0.5).
	 * @returns {number} The remaining value of the variable after linear decay.
	 *
	 * @example
	 * const initialValue = 100;
	 * const currentTime = 50;
	 * const maxTime = 1000;
	 * const decayRate = 0.3;
	 * const remainingValue = linearDecay(initialValue, currentTime, maxTime, decayRate);
	 * // Returns the remaining value after linear decay.
	 */
	linearDecay(pInitialValue, pCurrentTime, pMaxTime, pDecayRate = 0.5) {
		// Calculate the variable value at the current time
		const proportionOfTimePassed = pCurrentTime / pMaxTime;
		const remainingValue = Math.max(pInitialValue * (1 - (proportionOfTimePassed * pDecayRate)), 1);
		return remainingValue;
	}
	/**
	 * Generates a unique id
	 * 
	 * @param {string} pIDLength - The length of the ID to create 
	 * @returns A unique ID
	 */
	generateID(pIDLength = 7) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const makeID = function() {
			let ID = '';
			for (let i = 0; i < pIDLength; i++) {
				ID += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return ID;
		}
		let ID = makeID();
		while(this.storedIDs.includes(ID)) {
			ID = makeID();
		}
		this.storedIDs.push(ID);
		return ID;
	}
	/**
	 * Converts a color in decimal format into hex format
	 * 
	 * @param {number} pDecimal - The color in decimal format
	 * @param {number} pChars - The length to make the hex string
	 * @returns The decimal color converted into hex format
	 */
	decimalToHex(pDecimal, pChars = 6) {
		return '#' + (pDecimal + Math.pow(16, pChars)).toString(16).slice(-pChars).toUpperCase();
	}
	/**
	 * Add intensity to this color to get a brighter or dimmer effect
	 * 
	 * @param {string|number} pColor - Color in hex format or decimal format
	 * @param {number} pPercent - The percent of brightness to add to this color
	 * @returns 
	 */
	addIntensity(pColor, pPercent) {
		const rgb = this.grabColor(pColor).rgbArray;
		const r = rgb[0];
		const g = rgb[1];
		const b = rgb[2];
		let rr = 0;
		let rg = 0;
		let rb = 0;
		const black = (r === 0 && g === 0 && b === 0) ? true : false;
		if (r || black) rr = r + Math.floor((255 * pPercent) / 100);
		if (g || black) rg = g + Math.floor((255 * pPercent) / 100);
		if (b || black) rb = b + Math.floor((255 * pPercent) / 100);
		return this.grabColor(this.clamp(rr, 0, 255), this.clamp(rg, 0, 255), this.clamp(rb, 0, 255)).hex
	}
	/**
	 * Converts an RGB color value to a hexadecimal color value.
	 * 
	 * @param {number} pR - The red component of the RGB color value (0-255).
	 * @param {number} pG - The green component of the RGB color value (0-255).
	 * @param {number} pB - The blue component of the RGB color value (0-255).
	*/
	rgbToHex(pR, pG, pB) {
		const r = this.clamp(pR, 0, 255);
		const g = this.clamp(pG, 0, 255);
		const b = this.clamp(pB, 0, 255);
		const craftString = function(pColor) {
			return pColor.toString(16).padStart(2, '0');
		}
		const hex = '#' + [r, g, b].map(craftString).join('');
		return hex;		
	}
	/**
	 * Converts a hexadecimal color value to an RGB color value.
	 * 
	 * @param {string} pHex - The hexadecimal color value to convert (e.g. "#FF0000" for red).
	 * @returns {Array} - An array containing the red, green, and blue components of the RGB color value.
	*/
	hexToRgb(pHex) {
		pHex = pHex.replace('#', '');
		if (pHex.length === 3) {
			pHex = pHex.replace(new RegExp('(.)', 'g'), '$1$1');
		}
		pHex = pHex.match(new RegExp('..', 'g'));
		const r = this.clamp(parseInt(pHex[0], 16), 0, 255);
		const g = this.clamp(parseInt(pHex[1], 16), 0, 255);
		const b = this.clamp(parseInt(pHex[2], 16), 0, 255);
		return [r, g, b];
	}
	/**
	 * Converts RGB color values to a decimal value.
	 * 
	 * @param {number} pR - The red component of the RGB color value (0-255).
	 * @param {number} pG - The green component of the RGB color value (0-255).
	 * @param {number} pB - The blue component of the RGB color value (0-255).
	*/
	rgbToDecimal(pR, pG, pB) {
		return (pR << 16 | pG << 8 | pB);
	}
	/**
	 * Converts a hexadecimal color value to a decimal value.
	 * 
	 * @param {string} pHex - The hexadecimal color value to convert (e.g. "#FF0000" for red).
	 * @returns {number} - The decimal representation of the hexadecimal color value.
	*/
	hexToDecimal(pHex) {
		pHex = pHex.replace('#', '');
		return parseInt(pHex, 16);
	}
	/**
	 * Convert a color to different formats or get a random color
	 * 
	 * @param {string|number} pSwitch - A hex string representing a color (with or without the tag)
	 * A color formatted in the decimal format. Or the r value of a rgb color.
	 * @param {number} [g] g value of a rgb color
	 * @param {number} [b] b value of a rgb color
	 * @returns {ColorObject} A color object with various different export options.
	 * hex, hexTagless, rgb, rgbArray, rgbObject, rgbNormal, decimal formats.
	 */
	grabColor(pSwitch = this.getRandomColor(), pG, pB) {
		let hex, rgb;
		// Convert rgb to hex
		if (typeof(pSwitch) === 'number' && typeof(pG) === 'number' && typeof(pB) === 'number') {
			hex = this.rgbToHex(pSwitch, pG, pB);
			rgb = this.hexToRgb(hex);
		} else {
			// Convert decimal to hex
			if (typeof(pSwitch) === 'number') {
				pSwitch = this.decimalToHex(pSwitch);
			}
			hex = pSwitch;
			// Convert hex to rgb
			rgb = this.hexToRgb(hex);
		}
		return { 
			'hex': hex.toLowerCase(), 
			'hexTagless': hex.replace('#', '').toLowerCase(), 
			'rgb': 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')', 
			'rgbArray': rgb, 
			'rgbObject': { 'r': rgb[0], 'g': rgb[1], 'b': rgb[2] }, 
			'rgbNormal': [Math.round(rgb[0]/255 * 100) / 100, Math.round(rgb[1]/255 * 100) / 100, Math.round(rgb[2]/255 * 100) / 100], 
			'decimal': this.hexToDecimal(hex) 
		};
	}
	/**
	 * Gets a random color
	 * 
	 * @returns {string} A random color in the hex format
	 */
	getRandomColor() {
		const chars = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += chars[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	/**
	 * Gets a random color between two colors
	 * 
	 * @param {number|string} pColor1 - The first color to get a color between
	 * @param {number|string} pColor2 - The second color to get a color between
	 * @param {number} [pAmount=0.5] - The closer the random color will be to either input colors on a range of 0-1
	 * 0 to 0.5 (closer to pColor1)
	 * 0.5 to 1 (closer to pColor2)
	 * @returns {string} A random color in the decimal format
	 */
	getRandomColorBetween(pColor1, pColor2, pAmount = 0.5) {
		// u is the amount of the lerp 0-1
		return this.flooredLerp(this.grabColor(pColor1).decimal, this.grabColor(pColor2).decimal, pAmount);
	}
	/**
	 * Transition a color to another color in pDuration time.
	 * 
	 * @param {Object} pInstance - The instance to transition it's color property.
	 * pInstance's color will be transitioned either via pInstance.color = newColor
	 * or
	 * pInstance.color.tint = newColor (if the color is defined as an object)
	 * @param {string|number} pStartColor - The start color
	 * @param {string|number} pEndColor - The end color
	 * @param {number} pDuration - The duration of the transition
	 * @param {Function} pIterativeCallback - Callback to call every tick of the transition
	 * @param {Function} pEndCallback - Callback to call at the end of the transition
	 * @returns An ID that references this transition to be passed to cancelTransition to stop an ongoing transition.
	 */
	transitionColor(pInstance, pStartColor='#000', pEndColor='#fff', pDuration=1000, pIterativeCallback, pEndCallback) {
		// Cannot use this API on the server
		if (!globalThis.window) return;
		const iterativeCallback = typeof(pIterativeCallback) === 'function' ? pIterativeCallback : null;
		const endCallback = typeof(pEndCallback) === 'function' ? pEndCallback : null;
		let id;
		let isParticle;
		let isTintObject;

		if (pInstance) {
			id = pInstance.id ? pInstance.id : this.generateID();
			isParticle = (pInstance.type === 'GeneratedParticle');
			isTintObject = (typeof(pInstance.color) === 'object' && pInstance.color.constructor === Object ? true : false);
			if (this.transitions[id]) this.cancelTransitionColor(id);
		} else {
			id = this.generateID();
		}
			
		this.transitions[id] = {
			'duration': pDuration,
			'timeTracker': isParticle ? pInstance.info.lifetime : 0
		};

		const rgbStartColor = this.grabColor(pStartColor).rgbArray;
		const rgbEndColor = this.grabColor(pEndColor).rgbArray;

		const self = this;
		this.transitions[id].step = (pTimeStamp) => {
			if (self.transitions[id]) {
				if (isParticle) {
					if (pInstance.info) {
						if (pInstance.info.owner) {
							if (pInstance.info.owner.settings.paused) {
								return;
							}
						}
					} else {
						if (self.transitions[id]) this.cancelTransitionColor(id);
						return;				
					}
				}

				const now = pTimeStamp;
				if (!self.transitions[id].lastTime) self.transitions[id].lastTime = now;
				const elapsed = now - self.transitions[id].lastTime;
				// Time tracker is used rather than lastStamp - startStamp because this currently takes into account particles passed in (this will be removed in the future and use the former method)
				self.transitions[id].timeTracker += elapsed;
				// The max value of percentage is 1, so we clamp it at 1
				const percentage = Math.min(self.transitions[id].timeTracker / self.transitions[id].duration, 1);
				
				const r = parseInt(self.lerp(rgbStartColor[0], rgbEndColor[0], percentage), 10);
				const g = parseInt(self.lerp(rgbStartColor[1], rgbEndColor[1], percentage), 10);
				const b = parseInt(self.lerp(rgbStartColor[2], rgbEndColor[2], percentage), 10);
				const color = self.grabColor(r, g, b);

				if (iterativeCallback) iterativeCallback(color);

				if (pInstance) {
					if (isTintObject) {
						pInstance.color.tint = color.decimal;
						pInstance.color = pInstance.color;
					} else {
						pInstance.color = color.hex;
					}
				}

				if (percentage >= 1 || self.transitions[id].timeTracker >= pDuration) {
					if (self.transitions[id]) this.cancelTransitionColor(id);
					if (endCallback) endCallback(color);
					return;
				}
				self.transitions[id].req = globalThis.requestAnimationFrame(self.transitions[id].step);
				self.transitions[id].lastTime = now;
			}
		}

		this.transitions[id].req = globalThis.requestAnimationFrame(this.transitions[id].step);
		return id;
	}
	/**
	 * Cancels an ongoing transition
	 * 
	 * @param {string} pID - The ID of the ongoing transition to cancel
	 */
	cancelTransitionColor(pID) {
		if (this.transitions[pID]) {
			globalThis.cancelAnimationFrame(this.transitions[pID].req);
			delete this.transitions[pID];
		}
	}
	/**
	 * Calculates the position of a point after rotating it around a center point by a given angle.
	 * 
	 * @param {object} pRect - The rectangle object to rotate the point around.
	 * pRect.anchor.x and pRecent.anchor.y is used to control the "center" of the rectangle.
	 * @param {number} pTheta - The angle (in radians) to rotate the point by.
	 * @param {object} pPoint - The point object to rotate around the center of the rectangle.
	 * @param {number} pPoint.x - The x-coordinate of the point to rotate.
	 * @param {number} pPoint.y - The y-coordinate of the point to rotate.
	 * @returns {object} An object with the rotated point's new x and y coordinates.
	 */
	getPointRotated(pRect, pTheta, pPoint) {
		// cx, cy - center of square coordinates
		// x, y - coordinates of a corner point of the square
		// theta is the angle of rotation
		const cx = pRect.x + pRect.width * (typeof(pRect.anchor) === 'object' && pRect.anchor.x ? pRect.anchor.x : 0.5);
		const cy = pRect.y + pRect.height * (typeof(pRect.anchor) === 'object' && pRect.anchor.y ? pRect.anchor.y : 0.5);

		// translate point to origin
		const tempX = pPoint.x - cx;
		const tempY = pPoint.y - cy;

		// now apply rotation
		const rotatedX = tempX*Math.cos(pTheta) - tempY*(-Math.sin(pTheta));
		const rotatedY = tempX*(-Math.sin(pTheta)) + tempY*Math.cos(pTheta);

		// translate back
		const x = rotatedX + cx;
		const y = rotatedY + cy;
		return { 'x': x, 'y': y };
	}
	/**
	 * Calculates the position of a rectangle's corner points and center point after rotating it around a center point by a given angle.
	 * 
	 * @param {object} pRect - The rectangle object to rotate the point around.
	 * pRect.anchor.x and pRecent.anchor.y is used to control the "center" of the rectangle.
	 * @param {number} pTheta - The angle (in radians) to rotate the point by.
	 * @returns {object} An object with the rotated rectangle's new corner points and center points.
	 */
	getPointsOfRotatedRect(pRect, pTheta) {
		const tl = this.getPointRotated(pRect, pTheta, { 'x': pRect.x, 'y': pRect.y });
		const tr = this.getPointRotated(pRect, pTheta, { 'x': pRect.x + pRect.width, 'y': pRect.y });
		const bl = this.getPointRotated(pRect, pTheta, { 'x': pRect.x, 'y': pRect.y + pRect.height });
		const br = this.getPointRotated(pRect, pTheta, { 'x': pRect.x + pRect.width, 'y': pRect.y + pRect.height });
		const center = this.getPointRotated(pRect, pTheta, { 'x': pRect.x + pRect.width / 2, 'y': pRect.y + pRect.height / 2 });
		return { 'tl': tl, 'tr': tr, 'bl': bl, 'br': br, 'center': center };
	}
	/**
	 * Calculate the icon offset to compensate for a non-zero anchor.
	 *
	 * @param {Object} [pIconSize] - The size of the icon with properties `.x` and `.y`.
	 * @param {number} [pIconSize.width=32] - The size of the icon's width.
	 * @param {number} [pIconSize.height=32] - The size of the icon's height'.
	 * @param {Object} [pAnchor] - The anchor point with properties `.x` and `.y`.
	 * @param {number} [pAnchor.x=0.5] - The anchor's x value.
	 * @param {number} [pAnchor.y=0.5] - The anchor's y value.
	 * @param {Object} [pScale] - The scale factor applied to the object with properties `.x` and `.y`.
	 * @param {number} [pScale.x=1] - The scale's y value.
	 * @param {number} [pScale.y=1] - The scale's y value.
	 * @returns {Object} - The calculated icon offset with properties `.x` and `.y`.
	 */
	calculateIconOffset(pIconSize = { width: 32, height: 32 }, pAnchor = { x: 0.5, y: 0.5 }, pScale= { x: 1, y: 1}) {
		const scaledSize = {
			x: pIconSize.width * pScale.x,
			y: pIconSize.height * pScale.y,
		};

		const offset = {
			x: pAnchor.x * (scaledSize.x - pIconSize.width),
			y: pAnchor.y * (scaledSize.y - pIconSize.height),
		};

		return {
			x: offset.x,
			y: offset.y,
		};
	}
}
export const Utils = new UtilsSingleton();
