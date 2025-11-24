// @ts-ignore - vendor file without types
import { Logger } from './vendor/logger.min.mjs';

export type ColorObject = {
	hex: string;
	hexTagless: string;
	rgb: string;
	rgbArray: number[];
	rgbObject: {
		r: number;
		g: number;
		b: number;
	};
	rgbNormal: number[];
	decimal: number;
}

/**
 * A utilities class providing mathematical, color, and geometric utility functions.
 * 
 * This class contains static-like methods for common utility operations including:
 * - Mathematical operations (random numbers, interpolation, normalization)
 * - Color manipulation and conversion
 * - Geometric calculations (angles, distances, rotations)
 * - Array and object utilities
 * - Animation and transition helpers
 * 
 * @class UtilsSingleton
 * @license Utils is free software, available under the terms of a MIT style License.
 * @author https://github.com/doubleactii
 * @example
 * ```typescript
 * import { Utils } from './utils';
 * 
 * // Generate a random number between 1 and 10
 * const randomNum = Utils.rand(1, 10);
 * 
 * // Convert RGB to hex
 * const hexColor = Utils.rgbToHex(255, 0, 0); // Returns "#ff0000"
 * 
 * // Calculate distance between two points
 * const distance = Utils.getDistance({x: 0, y: 0}, {x: 3, y: 4}); // Returns 5
 * ```
 */
class UtilsSingleton {
	/**
	 * Object storing all color objects being transitioned at the moment
	 * @type {Object}
	 */
	transitions: Record<string, any> = {};
	/**
	 * An array storing all the reserved unique IDS
	 * @type {Array}
	 */
	storedIDs: string[] = [];
	/**
	 * The version of the module.
	 */
	version: string = "VERSION_REPLACE_ME";

	/**
	 * The logger module this module uses to log errors / logs
	 * @type {Object}
	 */
	logger: Logger;

	constructor() {
		// Create a logger
		this.logger = new Logger();
		this.logger.registerType('Utils-Module', '#ff6600');
	}

	/**
	 * Generates a random decimal number between two numbers with a specified number of decimal places.
	 * 
	 * @param pNum1 - The first number to use for generating the random decimal number.
	 * @param pNum2 - The second number to use for generating the random decimal number.
	 * @param pPlaces - The number of decimal places to include in the generated random decimal number. Defaults to 1 if not provided.
	 * @returns A random decimal number between the two numbers with the specified number of decimal places.
	 */
	decimalRand(pNum1: number, pNum2: number, pPlaces: number = 1): number {
		const result = Number((Math.random() * (pNum1 - pNum2) + pNum2).toFixed(pPlaces));
		return result;
	}

	/**
	 * Generates a random decimal number between two numbers with a specified number of decimal places.
	 * 
	 * @param pNum1 - The first number to use for generating the random decimal number.
	 * @param pNum2 - The second number to use for generating the random decimal number.
	 * @returns A random decimal number between the two numbers with the specified number of decimal places.
	 */
	rand(pNum1: number, pNum2: number): number {
		const result = Number((Math.random() * (pNum1 - pNum2) + pNum2));
		return Math.round(result);
	}

	/**
	 * Calculates the percentage of a value relative to a total value.
	 * 
	 * @param pValue - The value to calculate the percentage of.
	 * @param pTotalValue - The total value to calculate the percentage relative to.
	 * @returns The percentage of the value relative to the total value.
	 */
	getPercentage(pValue: number, pTotalValue: number): number {
		return (100 * pValue) / pTotalValue;
	}

	/**
	 * Clamps a number between a minimum and maximum value.
	 * 
	 * @param pNumber - The number to clamp.
	 * @param pMin - The minimum value to clamp the number to. Defaults to 0 if not provided.
	 * @param pMax - The maximum value to clamp the number to. Defaults to 1 if not provided.
	 * @returns The clamped number between the minimum and maximum values.
	 */
	clamp(pNumber: number, pMin: number = 0, pMax: number = 1): number {
		return Math.max(pMin, Math.min(pNumber, pMax));
	}

	/**
	 * Linearly interpolates between two values by a specified amount.
	 * 
	 * @param pStart - The start value to interpolate from.
	 * @param pEnd - The end value to interpolate to.
	 * @param pAmount - The amount to interpolate between the start and end values.
	 * @returns The interpolated value between the start and end values based on the specified amount.
	 */
	lerp(pStart: number, pEnd: number, pAmount: number): number {
		return (1 - pAmount) * pStart + pAmount * pEnd;
	}

	/**
	 * Linearly interpolates between two values by a specified amount and returns the result as a floored integer.
	 * 
	 * @param pStart - The start value to interpolate from.
	 * @param pEnd - The end value to interpolate to.
	 * @param pAmount - The amount to interpolate between the start and end values.
	 * @returns The interpolated value between the start and end values based on the specified amount, rounded down to the nearest integer.
	 */
	flooredLerp(pStart: number, pEnd: number, pAmount: number): number {
		return Math.floor(this.lerp(pStart, pEnd, pAmount));
	}

	/**
	 * Rounds a number to a specified number of decimal places.
	 * 
	 * @param pNumber - The number to round.
	 * @param pPlace - The number of decimal places to round to. Defaults to 1 if not provided.
	 * @returns The rounded number to the specified number of decimal places.
	 */
	round(pNumber: number, pPlace: number = 1): number {
		return Math.round(pPlace * pNumber) / pPlace;
	}

	/**
	 * Normalizes a value between a minimum and maximum value.
	 * 
	 * @param pVal - The value to normalize.
	 * @param pMin - The minimum value for normalization.
	 * @param pMax - The maximum value for normalization.
	 * @returns The normalized value between 0 and 1 based on the input value's position between the minimum and maximum values.
	 * If the difference between pMax and pMin is 0, returns 1 to avoid dividing by zero.
	 */
	normalize(pVal: number, pMin: number, pMax: number): number {
		if (pMax - pMin === 0) return 1;
		return (pVal - pMin) / (pMax - pMin);
	}

	/**
	 * Normalizes a value between a minimum and maximum value, clamped to the range of -1 to 1.
	 *
	 * @param pVal - The value to normalize.
	 * @param pMin - The minimum value for normalization.
	 * @param pMax - The maximum value for normalization.
	 * @returns The normalized and clamped value between -1 and 1 based on the input value's
	 * position between the minimum and maximum values. If the difference between pMax and pMin is 0,
	 * returns 1 to avoid dividing by zero.
	 */
	normalizeRanged(pVal: number, pMin: number, pMax: number): number {
		if (pMax - pMin === 0) return 1;
		const normalizedValue = -((2 * this.normalize(pVal, pMin, pMax)) - 1);
		// Clamp the normalized value to the range of -1 to 1
		return this.clamp(normalizedValue, -1, 1);
	};

	/**
	 * Checks if a value is within a range of minimum and maximum values (inclusive).
	 * 
	 * @param pVal - The value to check.
	 * @param pMin - The minimum value of the range to check against.
	 * @param pMax - The maximum value of the range to check against.
	 * @returns True if the value is within the range (inclusive), false otherwise.
	 */
	within(pVal: number, pMin: number, pMax: number): boolean {
		return pVal >= pMin && pVal <= pMax;
	}

	/**
	 * Formats a number by rounding it to the nearest integer and adding commas to separate thousands places.
	 * 
	 * @param pNum - The number to format.
	 * @returns A string representation of the formatted number.
	 */
	formatIntegerWithCommas(pNum: number): string {
		return pNum.toFixed().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}

	/**
	 * Converts degrees to radians.
	 * 
	 * @param pDegrees - The angle in degrees.
	 * @returns The angle in radians.
	 */
	toRadians(pDegrees: number): number {
		return pDegrees * (Math.PI / 180);
	}

	/**
	 * Converts radians to degrees.
	 * 
	 * @param pRadians - The angle in radians.
	 * @returns The angle in degrees.
	 */
	toDegrees(pRadians: number): number {
		return pRadians * (180 / Math.PI);
	}

	/**
	 * Returns a random element from the given array.
	 * 
	 * @param pArray - The input array.
	 * @returns A random element from the array.
	 */
	pick<T>(pArray: T[]): T {
		const randomIndex = Math.floor(Math.random() * pArray.length);
		return pArray[randomIndex];
	}

	/**
	 * Removes properties from an object except those listed in the exclude array.
	 * 
	 * @param pObject - The object to remove properties from.
	 * @param pExclude - The array of property names to exclude from removal.
	*/
	removeProperties(pObject: Record<string, any>, pExclude: string[]): void {
		if (typeof (pObject) === 'object') {
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
	 * @param pChance - The probability value, between 0 and 100 (inclusive).
	 * @returns Returns true or false, based on the probability value.
	 */
	prob(pChance: number): boolean {
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
	 * @param pDirection - The direction to get the inverse of.
	 * @returns The inverse direction
	 */
	getInverseDirection(pDirection: string): string {
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
				return '';
		}
	}

	/**
	 * Calculates the angle (in radians) from a given direction.
	 * 
	 * @param pDirection - The direction to calculate the angle from.
	 * @returns The angle (in radians) associated with the given direction.
	 * @throws Throws an error if the direction is not recognized.
	 */
	getAngleFromDirection(pDirection: string): number {
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
				return 0;
		}
	}

	/**
	 * Centers a rectangle (defined by its dimensions) within a parent rectangle.
	 *
	 * @param pChildWidth - The width of the child rectangle.
	 * @param pChildHeight - The height of the child rectangle.
	 * @param pParentWidth - The width of the parent rectangle.
	 * @param pParentHeight - The height of the parent rectangle.
	 * @param pParentX - The x-coordinate of the parent rectangle.
	 * @param pParentY - The y-coordinate of the parent rectangle.
	 * @returns An object representing the new coordinates of the centered rectangle: { x: centerX, y: centerY }.
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
	centerRectangleOnParent(pChildWidth: number, pChildHeight: number, pParentWidth: number, pParentHeight: number, pParentX: number, pParentY: number): { x: number; y: number } {
		const centerX = pParentX + ((pParentWidth - pChildWidth) / 2);
		const centerY = pParentY + ((pParentHeight - pChildHeight) / 2);
		return { x: centerX, y: centerY };
	}

	/**
	 * Generates a random angle in radians.
	 * @returns A random angle in radians.
	 */
	getRandomAngle(): number {
		return Math.random() * (Math.PI * 2); // Random value between 0 and 2*pi (360 degrees)
	}

	/**
	 * Gets the angle between two points
	 * 
	 * @param pStartPoint - The starting point
	 * @param pEndPoint - The ending point
	 * @returns The angle between the starting point and the ending point
	 */
	getAngle(pStartPoint: { x: number; y: number }, pEndPoint: { x: number; y: number }): number {
		const y = pStartPoint.y - pEndPoint.y;
		const x = pStartPoint.x - pEndPoint.x;
		return Math.atan2(y, x);
	}

	/**
	 * Gets the angle between two points but in VYLO / PIXI coordinate space. Removes 180 degrees from a raw angle
	 * 
	 * @param pStartPoint - The starting point
	 * @param pEndPoint - The ending point
	 * @returns The angle between the starting point and the ending point
	 */
	getAngle2(pStartPoint: { x: number; y: number }, pEndPoint: { x: number; y: number }): number {
		const y = pStartPoint.y - pEndPoint.y;
		const x = pStartPoint.x - pEndPoint.x;
		return (Math.atan2(y, x) - Math.PI) * -1;
	}

	/**
	 * Converts a raw angle to be the proper angle in Vylocity. By removing 180 degrees
	 * @param pAngle - The angle to convert.
	 * @returns The converted angle
	 */
	convertRaWAngleToVyloCoords(pAngle: number): number {
		return (pAngle - Math.PI) * -1;
	}

	/**
	 * Gets the minimal value between the value to add and the maximum allowed value.
	 * 
	 * @param pCurrent - The current value.
	 * @param pAdd - The value to add to the current value.
	 * @param pMax - The maximum value that can be reached.
	 * @returns The minimal value between the value to add and the remaining value to reach the maximum.
	 */
	getMinimal(pCurrent: number, pAdd: number, pMax: number): number {
		const max = pMax - pCurrent;
		return Math.min(pAdd, max);
	}

	/**
	 * Calculates the Euclidean distance between two points in a two-dimensional space.
	 *
	 * @param pStartPoint - The starting point with x and y coordinates.
	 * @param pStartPoint.x - The x-coordinate of the starting point.
	 * @param pStartPoint.y - The y-coordinate of the starting point.
	 * @param pEndPoint - The ending point with x and y coordinates.
	 * @param pEndPoint.x - The x-coordinate of the ending point.
	 * @param pEndPoint.y - The y-coordinate of the ending point.
	 * @returns The Euclidean distance between the two points.
	 *
	 * @example
	 * const startPoint = { x: 1, y: 2 };
	 * const endPoint = { x: 4, y: 6 };
	 * const distance = getDistance(startPoint, endPoint); // 5
	 * // Returns the Euclidean distance between the points (1, 2) and (4, 6).
	 */
	getDistance(pStartPoint: { x: number; y: number }, pEndPoint: { x: number; y: number }): number {
		const y = (pStartPoint.y - pEndPoint.y);
		const x = (pStartPoint.x - pEndPoint.x);
		return Math.sqrt((x * x) + (y * y));
	}

	/**
	 * Calculates the new position of a point based on distance and angle.
	 *
	 * @param pPoint - The initial position of the point with x and y coordinates.
	 * @param pPoint.x - The initial x-coordinate of the point.
	 * @param pPoint.y - The initial y-coordinate of the point.
	 * @param pDistance - The distance by which to move the point.
	 * @param pAngle - The angle (in radians) at which to move the point.
	 * @returns The new position of the point after moving by the specified distance and angle.
	 *
	 * @example
	 * const initialPosition = { x: 10, y: 20 };
	 * const distance = 5;
	 * const angleInRadians = 0.785398; // 45 degrees
	 * const newPosition = calculateNewPositionFromDistanceAndAngle(initialPosition, distance, angleInDegrees);
	 * // Returns the new position of the point after moving by 5 units at a 45-degree angle.
	 */
	calculateNewPositionFromDistanceAndAngle(pPoint: { x: number; y: number }, pDistance: number, pAngle: number): { x: number; y: number } {
		const newPosition = { x: 0, y: 0 };
		newPosition.x = pPoint.x - pDistance * Math.cos(pAngle);
		newPosition.y = pPoint.y - pDistance * Math.sin(pAngle);
		return newPosition;
	};

	/**
	 * Calculates the proportional length based on a current value, a maximum value, and a specified total length.
	 *
	 * @param pCurrent - The current value to be scaled.
	 * @param pMax - The maximum value for scaling.
	 * @param pTotalLength - The specified total length.
	 * @returns The proportional length based on the current value, maximum value, and total length.
	 *
	 * @example
	 * const current = 25;
	 * const max = 50;
	 * const totalLength = 100;
	 * const proportionalLength = calculateProportionalLength(current, max, totalLength); // 50
	 * // Returns the proportional length based on the current value, maximum value, and total length.
	 */
	calculateProportionalLength(pCurrent: number, pMax: number, pTotalLength: number): number {
		return (pCurrent / pMax) * pTotalLength;
	}

	/**
	 * Calculates the compass direction based on the given angle.
	 *
	 * @param pAngle - The angle in radians.
	 * @returns The compass direction (e.g., 'east', 'southeast', 'south', etc.).
	 *
	 * @example
	 * const angle = Math.PI / 4; // 45 degrees in radians
	 * const direction = getDirection(angle); // Returns 'northeast'
	 */
	getDirection(pAngle: number): string {
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
	 * @param pInitialValue - The initial value of the variable.
	 * @param pCurrentTime - The current time at which to calculate the variable value.
	 * @param pMaxTime - The maximum time for the decay process.
	 * @param pDecayRate - The decay rate (default is 0.5).
	 * @returns The remaining value of the variable after linear decay.
	 *
	 * @example
	 * const initialValue = 100;
	 * const currentTime = 50;
	 * const maxTime = 1000;
	 * const decayRate = 0.3;
	 * const remainingValue = linearDecay(initialValue, currentTime, maxTime, decayRate);
	 * // Returns the remaining value after linear decay.
	 */
	linearDecay(pInitialValue: number, pCurrentTime: number, pMaxTime: number, pDecayRate: number = 0.5): number {
		// Calculate the variable value at the current time
		const proportionOfTimePassed = pCurrentTime / pMaxTime;
		const remainingValue = Math.max(pInitialValue * (1 - (proportionOfTimePassed * pDecayRate)), 1);
		return remainingValue;
	}

	/**
	 * Generates a unique id
	 * 
	 * @param pIDLength - The length of the ID to create 
	 * @returns A unique ID
	 */
	generateID(pIDLength: number = 7): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const makeID = function () {
			let ID = '';
			for (let i = 0; i < pIDLength; i++) {
				ID += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return ID;
		}
		let ID = makeID();
		while (this.storedIDs.includes(ID)) {
			ID = makeID();
		}
		this.storedIDs.push(ID);
		return ID;
	}

	/**
	 * Converts a color in decimal format into hex format
	 * 
	 * @param pDecimal - The color in decimal format
	 * @param pChars - The length to make the hex string
	 * @returns The decimal color converted into hex format
	 */
	decimalToHex(pDecimal: number, pChars: number = 6): string {
		return '#' + (pDecimal + Math.pow(16, pChars)).toString(16).slice(-pChars).toUpperCase();
	}

	/**
	 * Add intensity to this color to get a brighter or dimmer effect
	 * 
	 * @param pColor - Color in hex format or decimal format
	 * @param pPercent - The percent of brightness to add to this color
	 * @returns 
	 */
	addIntensity(pColor: string | number, pPercent: number): string {
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
	 * @param pR - The red component of the RGB color value (0-255).
	 * @param pG - The green component of the RGB color value (0-255).
	 * @param pB - The blue component of the RGB color value (0-255).
	*/
	rgbToHex(pR: number, pG: number, pB: number): string {
		const r = this.clamp(pR, 0, 255);
		const g = this.clamp(pG, 0, 255);
		const b = this.clamp(pB, 0, 255);
		const craftString = function (pColor: number) {
			return pColor.toString(16).padStart(2, '0');
		}
		const hex = '#' + [r, g, b].map(craftString).join('');
		return hex;
	}

	/**
	 * Converts a hexadecimal color value to an RGB color value.
	 * 
	 * @param pHex - The hexadecimal color value to convert (e.g. "#FF0000" for red).
	 * @returns An array containing the red, green, and blue components of the RGB color value.
	*/
	hexToRgb(pHex: string): number[] {
		pHex = pHex.replace('#', '');
		if (pHex.length === 3) {
			pHex = pHex.replace(new RegExp('(.)', 'g'), '$1$1');
		}
		const hexArray = pHex.match(new RegExp('..', 'g'));
		if (!hexArray) return [0, 0, 0];
		const r = this.clamp(parseInt(hexArray[0], 16), 0, 255);
		const g = this.clamp(parseInt(hexArray[1], 16), 0, 255);
		const b = this.clamp(parseInt(hexArray[2], 16), 0, 255);
		return [r, g, b];
	}

	/**
	 * Converts RGB color values to a decimal value.
	 * 
	 * @param pR - The red component of the RGB color value (0-255).
	 * @param pG - The green component of the RGB color value (0-255).
	 * @param pB - The blue component of the RGB color value (0-255).
	*/
	rgbToDecimal(pR: number, pG: number, pB: number): number {
		return (pR << 16 | pG << 8 | pB);
	}

	/**
	 * Converts a hexadecimal color value to a decimal value.
	 * 
	 * @param pHex - The hexadecimal color value to convert (e.g. "#FF0000" for red).
	 * @returns The decimal representation of the hexadecimal color value.
	*/
	hexToDecimal(pHex: string): number {
		pHex = pHex.replace('#', '');
		return parseInt(pHex, 16);
	}

	/**
	 * Convert a color to different formats or get a random color
	 * 
	 * @param pSwitch - A hex string representing a color (with or without the tag)
	 * A color formatted in the decimal format. Or the r value of a rgb color.
	 * @param pG - g value of a rgb color
	 * @param pB - b value of a rgb color
	 * @returns A color object with various different export options.
	 * hex, hexTagless, rgb, rgbArray, rgbObject, rgbNormal, decimal formats.
	 */
	grabColor(pSwitch: string | number = this.getRandomColor(), pG?: number, pB?: number): ColorObject {
		let hex: string, rgb: number[];
		// Convert rgb to hex
		if (typeof (pSwitch) === 'number' && typeof (pG) === 'number' && typeof (pB) === 'number') {
			hex = this.rgbToHex(pSwitch, pG, pB);
			rgb = this.hexToRgb(hex);
		} else {
			// Convert decimal to hex
			if (typeof (pSwitch) === 'number') {
				pSwitch = this.decimalToHex(pSwitch);
			}
			hex = pSwitch as string;
			// Convert hex to rgb
			rgb = this.hexToRgb(hex);
		}
		return {
			'hex': hex.toLowerCase(),
			'hexTagless': hex.replace('#', '').toLowerCase(),
			'rgb': 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')',
			'rgbArray': rgb,
			'rgbObject': { 'r': rgb[0], 'g': rgb[1], 'b': rgb[2] },
			'rgbNormal': [Math.round(rgb[0] / 255 * 100) / 100, Math.round(rgb[1] / 255 * 100) / 100, Math.round(rgb[2] / 255 * 100) / 100],
			'decimal': this.hexToDecimal(hex)
		};
	}

	/**
	 * Gets a random color
	 * 
	 * @returns A random color in the hex format
	 */
	getRandomColor(): string {
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
	 * @param pColor1 - The first color to get a color between
	 * @param pColor2 - The second color to get a color between
	 * @param pAmount - The closer the random color will be to either input colors on a range of 0-1
	 * 0 to 0.5 (closer to pColor1)
	 * 0.5 to 1 (closer to pColor2)
	 * @returns A random color in the decimal format
	 */
	getRandomColorBetween(pColor1: number | string, pColor2: number | string, pAmount: number = 0.5): number {
		// u is the amount of the lerp 0-1
		return this.flooredLerp(this.grabColor(pColor1).decimal, this.grabColor(pColor2).decimal, pAmount);
	}

	/**
	 * Transition a color to another color in pDuration time.
	 * 
	 * @param pInstance - The instance to transition it's color property.
	 * pInstance's color will be transitioned either via pInstance.color = newColor
	 * or
	 * pInstance.color.tint = newColor (if the color is defined as an object)
	 * @param pStartColor - The start color
	 * @param pEndColor - The end color
	 * @param pDuration - The duration of the transition
	 * @param pIterativeCallback - Callback to call every tick of the transition
	 * @param pEndCallback - Callback to call at the end of the transition
	 * @returns An ID that references this transition to be passed to cancelTransition to stop an ongoing transition.
	 */
	transitionColor(pInstance: any, pStartColor: string | number = '#000', pEndColor: string | number = '#fff', pDuration: number = 1000, pIterativeCallback?: (color: any) => void, pEndCallback?: (color: any) => void): string {
		// Cannot use this API on the server
		if (!globalThis.window) return '';
		const iterativeCallback = typeof (pIterativeCallback) === 'function' ? pIterativeCallback : null;
		const endCallback = typeof (pEndCallback) === 'function' ? pEndCallback : null;
		let id: string;
		let isParticle: boolean = false;
		let isTintObject: boolean = false;

		if (pInstance) {
			id = pInstance.id ? pInstance.id : this.generateID();
			isParticle = (pInstance.type === 'GeneratedParticle');
			isTintObject = (typeof (pInstance.color) === 'object' && pInstance.color.constructor === Object ? true : false);
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
		this.transitions[id].step = (pTimeStamp: number) => {
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

				const r = parseInt(self.lerp(rgbStartColor[0], rgbEndColor[0], percentage).toString(), 10);
				const g = parseInt(self.lerp(rgbStartColor[1], rgbEndColor[1], percentage).toString(), 10);
				const b = parseInt(self.lerp(rgbStartColor[2], rgbEndColor[2], percentage).toString(), 10);
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
	 * @param pID - The ID of the ongoing transition to cancel
	 */
	cancelTransitionColor(pID: string): void {
		if (this.transitions[pID]) {
			globalThis.cancelAnimationFrame(this.transitions[pID].req);
			delete this.transitions[pID];
		}
	}

	/**
	 * Calculates the position of a point after rotating it around a center point by a given angle.
	 * 
	 * @param pRect - The rectangle object to rotate the point around.
	 * pRect.anchor.x and pRecent.anchor.y is used to control the "center" of the rectangle.
	 * @param pTheta - The angle (in radians) to rotate the point by.
	 * @param pPoint - The point object to rotate around the center of the rectangle.
	 * @param pPoint.x - The x-coordinate of the point to rotate.
	 * @param pPoint.y - The y-coordinate of the point to rotate.
	 * @returns An object with the rotated point's new x and y coordinates.
	 */
	getPointRotated(pRect: { x: number; y: number; width: number; height: number; anchor?: { x?: number; y?: number } }, pTheta: number, pPoint: { x: number; y: number }): { x: number; y: number } {
		// cx, cy - center of square coordinates
		// x, y - coordinates of a corner point of the square
		// theta is the angle of rotation
		const cx = pRect.x + pRect.width * (typeof (pRect.anchor) === 'object' && pRect.anchor.x ? pRect.anchor.x : 0.5);
		const cy = pRect.y + pRect.height * (typeof (pRect.anchor) === 'object' && pRect.anchor.y ? pRect.anchor.y : 0.5);

		// translate point to origin
		const tempX = pPoint.x - cx;
		const tempY = pPoint.y - cy;

		// now apply rotation
		const rotatedX = tempX * Math.cos(pTheta) - tempY * (-Math.sin(pTheta));
		const rotatedY = tempX * (-Math.sin(pTheta)) + tempY * Math.cos(pTheta);

		// translate back
		const x = rotatedX + cx;
		const y = rotatedY + cy;
		return { 'x': x, 'y': y };
	}

	/**
	 * Calculates the position of a rectangle's corner points and center point after rotating it around a center point by a given angle.
	 * 
	 * @param pRect - The rectangle object to rotate the point around.
	 * pRect.anchor.x and pRecent.anchor.y is used to control the "center" of the rectangle.
	 * @param pTheta - The angle (in radians) to rotate the point by.
	 * @returns An object with the rotated rectangle's new corner points and center points.
	 */
	getPointsOfRotatedRect(pRect: { x: number; y: number; width: number; height: number; anchor?: { x?: number; y?: number } }, pTheta: number): { tl: { x: number; y: number }; tr: { x: number; y: number }; bl: { x: number; y: number }; br: { x: number; y: number }; center: { x: number; y: number } } {
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
	 * @param pIconSize - The size of the icon with properties `.x` and `.y`.
	 * @param pIconSize.width - The size of the icon's width.
	 * @param pIconSize.height - The size of the icon's height'.
	 * @param pAnchor - The anchor point with properties `.x` and `.y`.
	 * @param pAnchor.x - The anchor's x value.
	 * @param pAnchor.y - The anchor's y value.
	 * @param pScale - The scale factor applied to the object with properties `.x` and `.y`.
	 * @param pScale.x - The scale's y value.
	 * @param pScale.y - The scale's y value.
	 * @returns The calculated icon offset with properties `.x` and `.y`.
	 */
	calculateIconOffset(pIconSize: { width: number; height: number } = { width: 32, height: 32 }, pAnchor: { x: number; y: number } = { x: 0.5, y: 0.5 }, pScale: { x: number; y: number } = { x: 1, y: 1 }): { x: number; y: number } {
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

/**
 * The UtilsSingleton class provides mathematical, color, and geometric utility functions.
 * 
 * This class contains methods for common utility operations including:
 * - Mathematical operations (random numbers, interpolation, normalization)
 * - Color manipulation and conversion
 * - Geometric calculations (angles, distances, rotations)
 * - Array and object utilities
 * - Animation and transition helpers
 * 
 * @example
 * ```typescript
 * import { UtilsSingleton } from './utils';
 * 
 * const utils = new UtilsSingleton();
 * const randomNum = utils.rand(1, 10);
 * const hexColor = utils.rgbToHex(255, 0, 0);
 * ```
 */
export { UtilsSingleton };

/**
 * The main Utils singleton instance.
 * 
 * This is the primary way to access all utility functions.
 * 
 * @example
 * ```typescript
 * import { Utils } from './utils';
 * 
 * const randomNum = Utils.rand(1, 10);
 * const hexColor = Utils.rgbToHex(255, 0, 0);
 * ```
 */
export const Utils = new UtilsSingleton();

/**
 * Alias for the Utils singleton instance.
 * 
 * This provides an alternative way to access the utility functions
 * with a lowercase name for convenience.
 * 
 * @example
 * ```typescript
 * import { utils } from './utils';
 * 
 * const randomNum = utils.rand(1, 10);
 * const hexColor = utils.rgbToHex(255, 0, 0);
 * ```
 */
export const utils = Utils;
