#ENABLE LOCALCLIENTCODE
#BEGIN CLIENTCODE
#BEGIN JAVASCRIPT
(function() {
	let engineWaitId = setInterval(function() {
		if (VS.Client) {
			clearInterval(engineWaitId);
			buildUtils();
		}
	});

	let buildUtils = function() {
		let aUtils = {};

		VS.Client.___EVITCA_aUtils = true;
		VS.Client.aUtils = aUtils;
		VS.World.global.aUtils = aUtils;
		aUtils.version = 'v1.0.0';

		// object storing all things being transitioned at the moment
		aUtils.transitions = {};

		aUtils.decimalRand = function(pNum1, pNum2, pPlaces = 1) {
			let result = Number((Math.random() * (pNum1 - pNum2) + pNum2).toFixed(pPlaces))
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

		aUtils.formatNumber = function(pNum) {
			return pNum.toFixed().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}

		aUtils.generateID = function(pID = 7) {
			var ID = '';
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

			for (var i = 0; i < pID; i++) {
				ID += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return ID;
		}

		aUtils.decimalToHex = function(pDecimal, pChars = 6) {
			return '#' + (pDecimal + Math.pow(16, pChars)).toString(16).slice(-pChars).toUpperCase();
		}

		aUtils.addIntensity = function(pColor, pPercent) {
			let rgb = this.grabColor(pColor).rgbArray;
			let r = rgb[0];
			let g = rgb[1];
			let b = rgb[2];
			let rr = 0;
			let rg = 0;
			let rb = 0;
			let black = (r === 0 && g === 0 && b === 0) ? true : false;

			if (r || black) {
				rr = r + Math.floor((255 * pPercent) / 100);
			}

			if (g || black) {
				rg = g + Math.floor((255 * pPercent) / 100);
			}

			if (b || black) {
				rb = b + Math.floor((255 * pPercent) / 100);
			}

			return this.grabColor(VS.Math.clamp(rr, 0, 255), VS.Math.clamp(rg, 0, 255), VS.Math.clamp(rb, 0, 255)).hex
		}

		aUtils.grabColor = function(pSwitch = this.getRandomColor(), g, b) {
			let hex, cr, cg, cb;
			if (typeof(pSwitch) === 'number' && typeof(g) === 'number' && typeof(b) === 'number') {
				cr = VS.Math.clamp(pSwitch, 0, 255);
				cg = VS.Math.clamp(g, 0, 255);
				cb = VS.Math.clamp(b, 0, 255);
				let craftString = function(pColor) {
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
				cr = VS.Math.clamp(parseInt(pSwitch[0], 16), 0, 255);
				cg = VS.Math.clamp(parseInt(pSwitch[1], 16), 0, 255);
				cb = VS.Math.clamp(parseInt(pSwitch[2], 16), 0, 255);
			}
			return { 'hex': hex.toLowerCase(), 'hexTagless': hex.replace('#', '').toLowerCase(), 'rgb': 'rgb('+cr+','+cg+','+cb+')', 'rgbArray': [cr, cg, cb], 'rgbObject': { 'r': cr, 'g': cg, 'b': cb }, 'rgbNormal': [Math.round(cr/255 * 100) / 100, Math.round(cg/255 * 100) / 100, Math.round(cb/255 * 100) / 100], 'decimal': (cr << 16 | cg << 8 | cb) };
		}

		aUtils.getRandomColor = function() {
			let chars = '0123456789ABCDEF';
			let color = '#';
			for (let i = 0; i < 6; i++) {
				color += chars[Math.floor(Math.random() * 16)];
			}
			return color;
		}

		aUtils.transitionColor = function(pDiob, pStartColor='#000', pEndColor='#fff', pDuration, pIterativeCallback, pEndCallback) {
			const MAX_ELAPSED_MS = 500;
			const INTERVAL_RATE = 1000/60;
			const TIME_SCALE = (VS.Client.timeScale || VS.Client.timeScale === 0 ? VS.Client.timeScale : 1);

			let ID;
			let isParticle;
			let isObject;

			var rgbStartColor;
			var rgbEndColor;

			if (pDiob) {
				ID = pDiob.id;
				isParticle = (pDiob.type === 'GeneratedParticle');
				isObject = (pDiob.type ? false : true);
				if (this.transitions[ID]) {
					clearInterval(this.transitions[ID].intervalID);
				}
			} else {
				ID = this.generateID();
				while (Object.keys(this.transitions).includes(ID)) {
					ID = this.generateID();
				}				
			}
				
			this.transitions[ID] = { 'deltaTime': 0, 'lastTime': Date.now(), 'elapsedMS': 0, 'counter': 0, 'timeTracker': 0, 'rate': 0 };
			var iterations = pDuration / INTERVAL_RATE;

			this.transitions[ID].rate = 1 / iterations;
			this.transitions[ID].counter = 0;
			this.transitions[ID].timeTracker = isParticle ? pDiob.info.lifetime : 0;

			if (Number.isInteger(pStartColor)) {
				rgbStartColor = this.grabColor(this.decimalToHex(pStartColor)).rgbArray;
			} else if (pStartColor.includes('#')) {
				rgbStartColor = this.grabColor(pStartColor).rgbArray;
			} else {
				console.error('aUtils Module [transitionColor]: Invalid variable type for %cpStartColor', 'font-weight: bold', 'hex or decimal colors only.');
			}

			if (Number.isInteger(pEndColor)) {
				rgbEndColor = this.grabColor(this.decimalToHex(pEndColor)).rgbArray;
			} else if (pEndColor.includes('#')) {
				rgbEndColor = this.grabColor(pEndColor).rgbArray;
			} else {
				console.error('aUtils Module [transitionColor]: Invalid variable type for %cpEndColor', 'font-weight: bold', 'hex or decimal colors only.');
			}

			this.transitions[ID].intervalID = setInterval(function() {
				if (VS.Client.___EVITCA_aPause) {
					if (VS.Client.aPause.paused) {
						return;
					}
				}
				if (isParticle) {
					if (pDiob.info?.owner?.settings?.paused) {
						return;
					}
				}
				var currentTime = Date.now();
				if (currentTime > aUtils.transitions[ID].lastTime) {
					aUtils.transitions[ID].elapsedMS = currentTime - aUtils.transitions[ID].lastTime;

					if (aUtils.transitions[ID].elapsedMS > MAX_ELAPSED_MS) {
						aUtils.transitions[ID].elapsedMS = MAX_ELAPSED_MS;
					}
					
					aUtils.transitions[ID].deltaTime = (aUtils.transitions[ID].elapsedMS / INTERVAL_RATE) * TIME_SCALE;
				}
		
				aUtils.transitions[ID].lastTime = currentTime;
				aUtils.transitions[ID].counter += aUtils.transitions[ID].rate * aUtils.transitions[ID].deltaTime;
				aUtils.transitions[ID].timeTracker += aUtils.transitions[ID].elapsedMS;
				
				var r = parseInt(VS.Math.lerp(rgbStartColor[0], rgbEndColor[0], aUtils.transitions[ID].counter), 10);
				var g = parseInt(VS.Math.lerp(rgbStartColor[1], rgbEndColor[1], aUtils.transitions[ID].counter), 10);
				var b = parseInt(VS.Math.lerp(rgbStartColor[2], rgbEndColor[2], aUtils.transitions[ID].counter), 10);
				var color = aUtils.grabColor(r, g, b);

				if (pIterativeCallback) {
					pIterativeCallback(color);
				}

				if (pDiob) {
					if (isObject) {
						pDiob.color = color.decimal;
					} else {
						pDiob.color.tint = color.decimal;
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
}
)();

#END JAVASCRIPT
#END CLIENTCODE
