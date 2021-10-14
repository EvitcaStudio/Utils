#ENABLE LOCALCLIENTCODE
#BEGIN CLIENTCODE
#BEGIN SERVERCODE
#BEGIN JAVASCRIPT
(function() {
	let engineWaitId = setInterval(function() {
		if (VS.Client) {
			VS.Client.___EVITCA_aUtils = true;
			clearInterval(engineWaitId);
			VS.global.aUtils = buildUtils();
			VS.Client.aUtils = VS.global.aUtils;
		}
	});

	let buildUtils = function() {
		let aUtils = {};

		aUtils.decimalRand = function(pNum1, pNum2, pPlaces = 1) {
			let result = Number((Math.random() * (pNum1 - pNum2) + pNum2).toFixed(pPlaces))
			return (result >= 1 ? Math.floor(result) : result)		
		}

		aUtils.grabColor = function(pSwitch = this.getRandomColor(), g, b) {
			let hex, cr, cg, cb;
			if (typeof(pSwitch) === 'number' && typeof(g) === 'number' && typeof(b) === 'number') {
				cr = Math.clamp(pSwitch, 0, 255);
				cg = Math.clamp(g, 0, 255);
				cb = Math.clamp(b, 0, 255);
				let craftString = function(pColor) {
					return pColor.toString(16).padStart(2, '0');
				}
				hex = '#' + [cr, cg, cb].map(craftString).join('');
			} else {
				hex = pSwitch;
				pSwitch = pSwitch.replace('#', '');
				if (pSwitch.length === 3) {
					pSwitch = pSwitch.replace(new RegExp('(.)', 'g'), '$1$1');
				}
				pSwitch = pSwitch.match(new RegExp('..', 'g'));
				cr = Math.clamp(parseInt(pSwitch[0], 16), 0, 255);
				cg = Math.clamp(parseInt(pSwitch[1], 16), 0, 255);
				cb = Math.clamp(parseInt(pSwitch[2], 16), 0, 255);
			}
			return { 'hex': hex.toLowerCase(), 'hexTagless': hex.replace('#', '').toLowerCase(), 'rgb': 'rgb('+cr+','+cg+','+cb+')', 'rgbArray': [cr, cg, cb], 'rgbNormal': [Math.round(cr/255 * 100) / 100, Math.round(cg/255 * 100) / 100, Math.round(cb/255 * 100) / 100], 'decimal': (cr << 16 | cg << 8 | cb) };
		}

		aUtils.getRandomColor = function() {
			let chars = '0123456789ABCDEF';
			let color = '#';
			for (let i = 0; i < 6; i++) {
				color += chars[Math.floor(Math.random() * 16)];
			}
			return color;
		}

		return aUtils;
	}
}
)();

#END JAVASCRIPT
#END CLIENTCODE
#END SERVERCODE