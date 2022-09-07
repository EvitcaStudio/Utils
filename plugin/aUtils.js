(() => {
	const aUtils = {};

	if (VS.World.getCodeType() !== 'server') VS.Type.setVariables('Client', {___EVITCA_aUtils: true, aUtils: aUtils});
	VYLO.global.aUtils = aUtils;
	window.aUtils = aUtils;

	aUtils.version = 'v1.0.0';
	// object storing all color objects being transitioned at the moment
	aUtils.transitions = {};
	aUtils.storedIDs = [];
	aUtils.clientFound = false;

	// This will not be available on the server this API functionality is only available on the CLIENT SIDE
	if (VYLO.World.getCodeType() !== 'server') {
		// array full of textToMouse elements that are to be updated
		aUtils.activeTextToMouseElements = [];
		// array full of textToMouse elements that can be used when requesting to use textToMouse
		aUtils.idleTextToMouseElements = [];
		// an interval running at 60fps to update the textToMouse elements that are active.
		aUtils.textToMouseAnimatorInterval = setInterval(() => {
			for (let i = aUtils.activeTextToMouseElements.length - 1; i >= 0; i--) {
				const textToMouseElement = aUtils.activeTextToMouseElements[i];
				textToMouseElement.yPos--;
				textToMouseElement.alpha += (0 - textToMouseElement.alpha) * 0.075;
				if (textToMouseElement.alpha <= 0.015 || textToMouseElement.yPos <= textToMouseElement.spawnPosY - 75) aUtils.removeTextToMouse(textToMouseElement);
			}
		}, 16);

		// Text To Mouse
		aUtils.textToMouse = function(pText) {
			if (!VYLO.Client) {
				console.error('aUtils: %cClient not found! This cannot be used until the client exists', 'font-weight: bold');
				return;
			}
			if (!this.clientFound) {
				// Create a interface where you can display the text to mouse elements
				VYLO.Client.createInterface('aUtils_textToMouse_interface');
				// show this interface
				VYLO.Client.showInterface('aUtils_textToMouse_interface');
				VYLO.Client.addWebStyle('aUtils_textToMouse_style', `
					.aUtilsTextToMouse {
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
					.aUtilsTextToMouse::-webkit-scrollbar {
						display: none;
					}
					`
				);
				this.clientFound = true;
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
				textElem.text = '<div class="aUtilsTextToMouse">' + text + '</div>';
				if (textElem.getInterfaceName() !== 'aUtils_textToMouse_interface') VYLO.Client.addInterfaceElement(textElem, 'aUtils_textToMouse_interface');
				textElem.show();
				if (!this.activeTextToMouseElements.includes(textElem)) this.activeTextToMouseElements.push(textElem);
			}
		}

		aUtils.removeTextToMouse = function(pTextElem) {
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
	}

	aUtils.decimalRand = function(pNum1, pNum2, pPlaces = 1) {
		const result = Number((Math.random() * (pNum1 - pNum2) + pNum2).toFixed(pPlaces))
		return (result >= 1 ? Math.floor(result) : result)		
	}

	aUtils.getPercentage = function(pPercent, pNum) {
		return (pPercent / 100) * pNum;
	}
	
	aUtils.round = function (pNumber, pPlace=1) {
		return Math.round(pPlace * pNumber) / pPlace;
	}

	aUtils.normalize = function(pVal, pMin, pMax) {
		if (pMax - pMin === 0) return 1;
		return (pVal - pMin) / (pMax - pMin);
	}

	aUtils.within = function (pVal, pMin, pMax) {
		return pVal >= pMin && pVal <= pMax;
	}

	aUtils.formatNumber = function(pNum) {
		return pNum.toFixed().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}

	aUtils.generateID = function(pID = 7) {
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

	aUtils.decimalToHex = function(pDecimal, pChars = 6) {
		return '#' + (pDecimal + Math.pow(16, pChars)).toString(16).slice(-pChars).toUpperCase();
	}

	aUtils.addIntensity = function(pColor, pPercent) {
		const rgb = this.grabColor(pColor).rgbArray;
		const r = rgb[0];
		const g = rgb[1];
		const b = rgb[2];
		let rr = 0;
		let rg = 0;
		let rb = 0;
		const black = (r === 0 && g === 0 && b === 0) ? true : false;

		if (r || black) {
			rr = r + Math.floor((255 * pPercent) / 100);
		}

		if (g || black) {
			rg = g + Math.floor((255 * pPercent) / 100);
		}

		if (b || black) {
			rb = b + Math.floor((255 * pPercent) / 100);
		}

		return this.grabColor(VYLO.Math.clamp(rr, 0, 255), VYLO.Math.clamp(rg, 0, 255), VYLO.Math.clamp(rb, 0, 255)).hex
	}

	aUtils.grabColor = function(pSwitch = this.getRandomColor(), g, b) {
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

	aUtils.getRandomColor = function() {
		const chars = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += chars[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	aUtils.transitionColor = function(pDiob, pStartColor='#000', pEndColor='#fff', pDuration=1000, pIterativeCallback, pEndCallback) {
		const INTERVAL_RATE = 1000/60;
		let ID;
		let isParticle;
		let isObject;

		let rgbStartColor;
		let rgbEndColor;

		if (pDiob) {
			ID = pDiob.id;
			isParticle = (pDiob.type === 'GeneratedParticle');
			isObject = (pDiob.type ? false : true);
			if (this.transitions[ID]) {
				clearInterval(this.transitions[ID].intervalID);
			}
		} else {
			ID = this.generateID();			
		}
			
		this.transitions[ID] = { 'lastTime': 0, 'counter': 0, 'timeTracker': 0, 'rate': 0 };
		const iterations = pDuration / INTERVAL_RATE;

		this.transitions[ID].rate = 1 / iterations;
		this.transitions[ID].counter = 0;
		this.transitions[ID].timeTracker = isParticle ? pDiob.info.lifetime : 0;

		if (Number.isInteger(pStartColor)) {
			rgbStartColor = this.grabColor(this.decimalToHex(pStartColor)).rgbArray;
		} else if (pStartColor.includes('#')) {
			rgbStartColor = this.grabColor(pStartColor).rgbArray;
		} else {
			console.error('aUtils: Invalid variable type for %cpStartColor', 'font-weight: bold', 'hex or decimal colors only.');
		}

		if (Number.isInteger(pEndColor)) {
			rgbEndColor = this.grabColor(this.decimalToHex(pEndColor)).rgbArray;
		} else if (pEndColor.includes('#')) {
			rgbEndColor = this.grabColor(pEndColor).rgbArray;
		} else {
			console.error('aUtils: Invalid variable type for %cpEndColor', 'font-weight: bold', 'hex or decimal colors only.');
		}

		this.transitions[ID].intervalID = setInterval(function() {
			if (VYLO.Client.___EVITCA_aPause) {
				if (VYLO.Client.aPause.paused) {
					return;
				}
			}
			if (isParticle) {
				if (pDiob.info) {
					if (pDiob.info.owner) {
						if (pDiob.info.owner.settings.paused) {
							return;
						}
					}
				} else {
					clearInterval(aUtils.transitions[ID].intervalID);
					delete aUtils.transitions[ID];
					return;				
				}
			}
			const now = Date.now();
			if (!aUtils.transitions[ID].lastTime) aUtils.transitions[ID].lastTime = now;
			const elapsedMS = now - aUtils.transitions[ID].lastTime;
			let dt = (now - aUtils.transitions[ID].lastTime) / 1000;
			if (dt > 0.033) dt = 0.033;
			aUtils.transitions[ID].lastTime = now;
			aUtils.transitions[ID].counter += aUtils.transitions[ID].rate;
			console.log(aUtils.transitions[ID].counter)
			aUtils.transitions[ID].timeTracker += elapsedMS;
			
			const r = parseInt(VYLO.Math.lerp(rgbStartColor[0], rgbEndColor[0], aUtils.transitions[ID].counter), 10);
			const g = parseInt(VYLO.Math.lerp(rgbStartColor[1], rgbEndColor[1], aUtils.transitions[ID].counter), 10);
			const b = parseInt(VYLO.Math.lerp(rgbStartColor[2], rgbEndColor[2], aUtils.transitions[ID].counter), 10);
			const color = aUtils.grabColor(r, g, b);

			if (pIterativeCallback) {
				pIterativeCallback(color);
			}

			if (pDiob) {
				if (isObject) {
					pDiob.color.tint = color.decimal;
				} else {
					if (typeof(pDiob.color) === 'object') {
						pDiob.color.tint = color.decimal;
					} else {
						pDiob.color = color.hex;
					}
					pDiob.color = pDiob.color;
				}
			}

			if (aUtils.transitions[ID].counter >= 1 || aUtils.transitions[ID].timeTracker >= pDuration) {
				clearInterval(aUtils.transitions[ID].intervalID);
				delete aUtils.transitions[ID];
				if (pEndCallback) {
					pEndCallback(color);
				}
				return;
			}
		}, INTERVAL_RATE);
	}
}
)();
