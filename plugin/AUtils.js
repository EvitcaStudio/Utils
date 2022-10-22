(() => {
	class AUtilsManager {
		constructor() {
			// Object storing all color objects being transitioned at the moment
			this.transitions = {};
			// An array storing all the taken unique IDS
			this.storedIDs = [];
			// Whether or not the text to mouse system has been initated
			this.textToMouseIsReady = false;
			// Array full of textToMouse elements that are to be updated
			this.activeTextToMouseElements = [];
			// Array full of textToMouse elements that can be used when requesting to use textToMouse
			this.idleTextToMouseElements = [];
			const self = this;
			// An interval running at 60fps to update the textToMouse elements that are active.
			this.textToMouseAnimatorInterval = setInterval(() => {
				for (let i = self.activeTextToMouseElements.length - 1; i >= 0; i--) {
					const textToMouseElement = self.activeTextToMouseElements[i];
					textToMouseElement.yPos--;
					textToMouseElement.alpha += (0 - textToMouseElement.alpha) * 0.075;
					if (textToMouseElement.alpha <= 0.015 || textToMouseElement.yPos <= textToMouseElement.spawnPosY - 75) self.removeTextToMouse(textToMouseElement);
				}
			}, 16);
			VYLO.Type.setVariables('Client', {___EVITCA_AUtils: true });

			// The version of this library
			this.version = '1.0.0';
		}

		textToMouse(pText) {
			if (!VYLO.Client) {
				console.error('AUtils: %cClient not found! This cannot be used until the client exists', 'font-weight: bold');
				return;
			}
			if (!this.textToMouseIsReady) {
				// Create a interface where you can display the text to mouse elements
				VYLO.Client.createInterface('AUtils_textToMouse_interface');
				// show this interface
				VYLO.Client.showInterface('AUtils_textToMouse_interface');
				VYLO.Client.addWebStyle('AUtils_textToMouse_style', `
					.AUtilsTextToMouse {
						text-align: center;
						font-weight: bold;
						font-size: 20px;
						color: #ffffff;
						-ms-overflow-style: none;  /* IE and Edge */
						scrollbar-width: none;  /* Firefox */
						-webkit-touch-callout: none;
						-webkit-text-size-adjust: none;
						-webkit-user-select: none;
						-khtml-user-select: none;
						-moz-user-select: none;
						-ms-user-select: none;
						user-select: none;
						text-shadow: rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.75517px 0.958851px 0px, rgb(0, 0, 0) 1.0806px 1.68294px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.81859px 0px, rgb(0, 0, 0) -1.60229px 1.19694px 0px, rgb(0, 0, 0) -1.97998px 0.28224px 0px, rgb(0, 0, 0) -1.87291px -0.701566px 0px, rgb(0, 0, 0) -1.30729px -1.5136px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.91785px 0px, rgb(0, 0, 0) 1.41734px -1.41108px 0px, rgb(0, 0, 0) 1.92034px -0.558831px 0px;
					}
					.AUtilsTextToMouse::-webkit-scrollbar {
						display: none;
					}
					`
				);
				this.textToMouseIsReady = true;
			}
			if (pText) {
				const mousePos = VYLO.Client.getMousePos();
				const spawnPos = { 'x': mousePos.x - 100, 'y':  mousePos.y };
				const text = typeof(pText) === 'object' ? JSON.stringify(pText) : pText;
				let textElem;

				if (VYLO.Client.___EVITCA_aRecycle) {
					textElem = aRecycle.isInCollection('Interface', 1, this.idleTextToMouseElements);
				} else {
					if (this.idleTextToMouseElements.length) {
						textElem = this.idleTextToMouseElements.pop();
					} else {
						textElem = VYLO.newDiob('Interface');
					}
				}

				textElem.alpha = 1;
				textElem.xPos = spawnPos.x;
				textElem.yPos = spawnPos.y;
				textElem.spawnPosY = textElem.yPos;
				if (textElem.interfaceType !== 'WebBox') textElem.interfaceType = 'WebBox';
				textElem.mouseOpacity = 0;
				textElem.touchOpacity = 0;
				textElem.width = 200;
				textElem.height = 200;
				// Other libraries use the plane of: 1999998. Adding this layer should allow this element to layer above
				textElem.plane = 1999998;
				textElem.layer = 1999998;
				textElem.text = '<div class="AUtilsTextToMouse">' + text + '</div>';
				if (textElem.getInterfaceName() !== 'AUtils_textToMouse_interface') VYLO.Client.addInterfaceElement(textElem, 'AUtils_textToMouse_interface');
				textElem.show();
				if (!this.activeTextToMouseElements.includes(textElem)) this.activeTextToMouseElements.push(textElem);
			}
		}

		removeTextToMouse(pTextElem) {
			if (pTextElem) {
				if (this.activeTextToMouseElements.includes(pTextElem)) this.activeTextToMouseElements.splice(this.activeTextToMouseElements.indexOf(pTextElem), 1);
				if (VYLO.Client.___EVITCA_aRecycle) {
					// pTextElem can possibly be deleted in this function if the collection is too full
					aRecycle.collect(pTextElem, this.idleTextToMouseElements);
				} else {
					if (!this.idleTextToMouseElements.includes(pTextElem)) this.idleTextToMouseElements.push(pTextElem);
				}
				// This is a check to see if the element was deleted
				if (pTextElem && Object.keys(pTextElem).length) {
					pTextElem.hide();
					pTextElem.alpha = 1;
					pTextElem.text = '';
					pTextElem.xPos = pTextElem.yPos = 0;
					pTextElem.spawnPosY = 0;
				}
			}
		}

		decimalRand(pNum1, pNum2, pPlaces = 1) {
			const result = Number((Math.random() * (pNum1 - pNum2) + pNum2).toFixed(pPlaces));
			return (result >= 1 ? Math.floor(result) : result);
		}
	
		getPercentage(pValue, pTotalValue) {
			return (100 * pValue) / pTotalValue;
		}
		
		round(pNumber, pPlace=1) {
			return Math.round(pPlace * pNumber) / pPlace;
		}
	
		normalize(pVal, pMin, pMax) {
			if (pMax - pMin === 0) return 1;
			return (pVal - pMin) / (pMax - pMin);
		}
	
		within(pVal, pMin, pMax) {
			return pVal >= pMin && pVal <= pMax;
		}
		// Splits the number by their correct separators // 235235236523 = 235,235,236,523
		formatNumber(pNum) {
			return pNum.toFixed().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}
		// Generate a unique id
		generateID(pID = 7) {
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const makeID = function() {
				let ID = '';
				for (let i = 0; i < pID; i++) {
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
	
		decimalToHex(pDecimal, pChars = 6) {
			return '#' + (pDecimal + Math.pow(16, pChars)).toString(16).slice(-pChars).toUpperCase();
		}
		// Add intensity to this color to get a brighter or dimmer effect
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
	
			return this.grabColor(VYLO.Math.clamp(rr, 0, 255), VYLO.Math.clamp(rg, 0, 255), VYLO.Math.clamp(rb, 0, 255)).hex
		}
		// Convert a color to different formats or get a random color
		grabColor(pSwitch = this.getRandomColor(), g, b) {
			let hex, cr, cg, cb;
			if (typeof(pSwitch) === 'number' && typeof(g) === 'number' && typeof(b) === 'number') {
				cr = VYLO.Math.clamp(pSwitch, 0, 255);
				cg = VYLO.Math.clamp(g, 0, 255);
				cb = VYLO.Math.clamp(b, 0, 255);
				const craftString = function(pColor) {
					return pColor.toString(16).padStart(2, '0');
				}
				hex = '#' + [cr, cg, cb].map(craftString).join('');
			} else {
				if (typeof(pSwitch) === 'number') {
					pSwitch = this.decimalToHex(pSwitch);
				}
				hex = pSwitch;
				pSwitch = pSwitch.replace('#', '');
				if (pSwitch.length === 3) {
					pSwitch = pSwitch.replace(new RegExp('(.)', 'g'), '$1$1');
				}
				pSwitch = pSwitch.match(new RegExp('..', 'g'));
				cr = VYLO.Math.clamp(parseInt(pSwitch[0], 16), 0, 255);
				cg = VYLO.Math.clamp(parseInt(pSwitch[1], 16), 0, 255);
				cb = VYLO.Math.clamp(parseInt(pSwitch[2], 16), 0, 255);
			}
			return { 'hex': hex.toLowerCase(), 'hexTagless': hex.replace('#', '').toLowerCase(), 'rgb': 'rgb('+cr+','+cg+','+cb+')', 'rgbArray': [cr, cg, cb], 'rgbObject': { 'r': cr, 'g': cg, 'b': cb }, 'rgbNormal': [Math.round(cr/255 * 100) / 100, Math.round(cg/255 * 100) / 100, Math.round(cb/255 * 100) / 100], 'decimal': (cr << 16 | cg << 8 | cb) };
		}
	
		getRandomColor() {
			const chars = '0123456789ABCDEF';
			let color = '#';
			for (let i = 0; i < 6; i++) {
				color += chars[Math.floor(Math.random() * 16)];
			}
			return color;
		}
		// Transition a color to another color in pDuration time.
		transitionColor(pInstance, pStartColor='#000', pEndColor='#fff', pDuration=1000, pIterativeCallback, pEndCallback) {
			const INTERVAL_RATE = 1000/60;
			let ID;
			let isParticle;
			let isTintObject;
	
			let rgbStartColor;
			let rgbEndColor;
	
			if (pInstance) {
				ID = pInstance.id;
				isParticle = (pInstance.type === 'GeneratedParticle');
				isTintObject = (typeof(pInstance.color) === 'object' && pInstance.color.constructor === Object ? true : false);
				if (this.transitions[ID]) clearInterval(this.transitions[ID].intervalID);
			} else {
				ID = this.generateID();			
			}
				
			this.transitions[ID] = { 'lastTime': 0, 'counter': 0, 'timeTracker': 0, 'rate': 0 };
			const iterations = pDuration / INTERVAL_RATE;
	
			this.transitions[ID].rate = 1 / iterations;
			this.transitions[ID].counter = 0;
			this.transitions[ID].timeTracker = isParticle ? pInstance.info.lifetime : 0;
	
			rgbStartColor = this.grabColor(pStartColor).rgbArray;
			rgbEndColor = this.grabColor(pEndColor).rgbArray;

			const self = this;
	
			this.transitions[ID].intervalID = setInterval(function() {
				if (VYLO.Client.___EVITCA_aPause) {
					if (aPause && aPause.paused) return;
				}
				if (isParticle) {
					if (pInstance.info) {
						if (pInstance.info.owner) {
							if (pInstance.info.owner.settings.paused) {
								return;
							}
						}
					} else {
						clearInterval(self.transitions[ID].intervalID);
						delete self.transitions[ID];
						return;				
					}
				}
				const now = Date.now();
				if (!self.transitions[ID].lastTime) self.transitions[ID].lastTime = now;
				const elapsedMS = now - self.transitions[ID].lastTime;
				let dt = (now - self.transitions[ID].lastTime) / 1000;
				if (dt > 0.033) dt = 0.033;
				self.transitions[ID].lastTime = now;
				self.transitions[ID].counter += self.transitions[ID].rate;
				self.transitions[ID].timeTracker += elapsedMS;
				
				const r = parseInt(VYLO.Math.lerp(rgbStartColor[0], rgbEndColor[0], self.transitions[ID].counter), 10);
				const g = parseInt(VYLO.Math.lerp(rgbStartColor[1], rgbEndColor[1], self.transitions[ID].counter), 10);
				const b = parseInt(VYLO.Math.lerp(rgbStartColor[2], rgbEndColor[2], self.transitions[ID].counter), 10);
				const color = self.grabColor(r, g, b);
	
				if (typeof(pIterativeCallback) === 'function') pIterativeCallback(color);

				if (pInstance) {
					if (isTintObject) {
						pInstance.color.tint = color.decimal;
						pInstance.color = pInstance.color;
					} else {
						pInstance.color = color.hex;
					}
				}
	
				if (self.transitions[ID].counter >= 1 || self.transitions[ID].timeTracker >= pDuration) {
					clearInterval(self.transitions[ID].intervalID);
					delete self.transitions[ID];
					if (typeof(pEndCallback) === 'function') pEndCallback(color);
					return;
				}
			}, INTERVAL_RATE);
		}
	}

	const AUtils = new AUtilsManager();
	VYLO.global.AUtils = AUtils;
	window.AUtils = AUtils;
	console.log("%cAUtils.js: ✅ AUtils.js@" + AUtils.version, "font-family:arial;");
}
)();
