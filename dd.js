// done TODO: Merge default config
// done TODO: 避免全局污染, 改用 self-execute function 寫
// done TODO: Cross browser css support
// done TODO: add node to constructor
// done TODO: Insert config to style list
//TODO: Insert @keyframe
//TODO: Add user agent to define browser
//TODO: Insert IE css support
//TODO: setInterval() alternative

(function()
{
	var prefixList = ['webkit', 'Moz', 'O', 'ms'];

	var defaultConfig = {
		dimension: 100,
		topColor: '#FF0000',
		bottomColor: '#008000',
		speed: 'fast'
	};

	// Initial style
	var styleList = {
		spinner: {
			"position": 'absolute',
			"left": '50%',
			"top": '50%'
		},
		spinnerInner : {
			"width": '100px',
			"height": '100px',
			"position": 'absolute',
			"borderRadius": '50%',
			"marginLeft": '-50px',
			"marginTop": '-50px'
		},
		top: {
			"background": 'red',
			"animation": 'leftspin linear infinite',
			"animationDuration": '2s',
			"zIndex": '100'
		},
		bottom: {
			"background": 'green',
			"animation": 'rightspin linear infinite',
			"animationDuration": '2s',
			"transform": 'scale(0.4)',
			"zIndex": '1'
		}
	};

	/**
	 * create HTML element, if tag is not assigned, <div> will be created
	 *
	 * @param tag
	 * @param props
	 * @returns {HTMLElement}
	 */
	function createElement(tag, props)
	{
		var e = document.createElement(tag || 'div');
		if (props) {
			for (var n in props) {
				e[n] = props[n];
			}
		}
		return e;
	}

	/**
	 * Append html element to parent
	 *
	 * @param parent
	 * @returns {object}
	 */
	function insert(parent /* Node1, node2, ...*/)
	{
		var l = arguments.length;
		for (var i=1; i<l; i++)	{
			parent.appendChild(arguments[i]);
		}
		return parent;
	}

	// Create stylesheet object
	var sheet = (function() {
		var el = createElement('style', {type : 'text/css'});
		insert(document.getElementsByTagName('head')[0], el);
		return el.sheet || el.styleSheet;
	}());

	// Get current vendor prefix
	var prefix = (function () {
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('')
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
			)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	})();

	function extendObj(base /* ext1, ext2, ....*/)
	{
		var l = arguments.length,
			p;
		for (var i=1; i<l; i++) {
			for (p in arguments[i]) {
				if (base[p] === undefined) {
					base[p] = arguments[i][p];
				}
			}
		}

		return base;
	}

	function addStyle(node /* style1, style2, ....*/)
	{
		var l = arguments.length,
			p;
		for (var i=1; i<l; i++) {
			for (p in arguments[i]) {
				node.style[vendor(node, p)] = arguments[i][p];
			}
		}
	}

	/**
	 * Detect browser supported css3 style prefix
	 *
	 * @param node
	 * @param prop
	 */
	function vendor(node, prop)
	{
		var l = prefixList.length,
			p = prop.charAt(0).toUpperCase() + prop.slice(1);

		for (var i=0; i<l; i++) {
			var pp = prefixList[i] + p;
			if (node.style[pp] !== undefined) {
				return pp;
			}
			if (node.style[prop] !== undefined) {
				return prop;
			}
		}
	}

	/**
	 * Constructor
	 *
	 * @param node
	 * @param config
	 * @constructor
	 */
	function DoubleSpin(node, config)
	{
		this.node = node;
		this.config = {};

		// Check css3 animation support
		this.supportAnimation = vendor(createElement(), 'animation');

		//speed setter
		this.config = {
			set speed(speed) {

				if (this.animationSpeed !== undefined) return;

				switch (speed) {
					case 'fast':
						return this.animationSpeed = '2s';
						break;
					case 'medium':
						return this.animationSpeed = '4s';
						break;
					case 'slow':
						return this.animationSpeed = '6s';
						break;
					default :
						return this.animationSpeed = '2s';
						break;
				}
			}
		};

		// Merge config
		extendObj(this.config, config, defaultConfig);

		// Create 2 spinner
		this.topSpinner = createElement('div', {className: 'spinner-inner top'});
		this.bottomSpinner = createElement('div', {className: 'spinner-inner bottom'});

		insert(this.node, this.topSpinner, this.bottomSpinner);
		addStyle(node, styleList.spinner);

		// Set initial style
		var c = this.config;

		styleList.spinnerInner.width = styleList.spinnerInner.height = c.dimension + 'px';
		styleList.spinnerInner.marginLeft = styleList.spinnerInner.marginTop = '-' + (parseInt(c.dimension) / 2) + 'px';
		styleList.top.animationDuration = styleList.bottom.animationDuration = c.animationSpeed;
		styleList.top.background = c.topColor;
		styleList.bottom.background = c.bottomColor;

		var s = styleList;

		addStyle(this.topSpinner, s.spinnerInner, s.top);
		addStyle(this.bottomSpinner, s.spinnerInner, s.bottom);
	}

	DoubleSpin.prototype = {
		spin: function()
		{
			var self = this;

			// this.supportAnimation === undefined
			if ( 1 == 1) {

				var tl = 0,             // topSpinner left
					tt = 0,
					td = -1,            // topSpinner direction
					tw = 100,           // topSpinner width
					th = 100,           // topSpinner height
					dS = 100 * 0.006;   // delta size


				var interval = setInterval(function() {

					// move left
					if (td == -1) {
						if (tl > -50) {
							tl -= 2;
						} else {
							// revert direction to right
							td = 1;
							tl = -50;
						}
					} else if (td == 1) {
						if (tl < 50) {
							tl += 2;
						} else {
							// revert direction to left
							td = -1;
							tl = 50;
						}
					}

					self.moveTo(self.topSpinner, tl, tt, tw, th)

				}, 20);

			} else {

				// Add keyframes
				//this.addKeyframes();

			}
		},
		moveTo: function(node, l, t, w, h) {

			node.style.left = l + 'px';
		},
		addKeyframes: function() {

			var p = prefix.css,
				offset = (this.config.dimension / 2);

			// Add leftspin
			sheet.insertRule(
				'@' + p + 'keyframes leftspin {' +
					'0% {' + p + 'transform: scale(1) translateX(0px);}' +
					'25%{' + p + 'transform: scale(0.7) translateX(-' + offset + 'px);z-index : 10;}' +
					'26% {z-index : 1;}' +
					'50% {' + p + 'transform: scale(0.4) translateX(0px);}' +
					'75% {' + p + 'transform: scale(0.7) translateX(' + offset + 'px);}' +
					'76% {z-index: 10;}' +
					'100%{' + p + 'transform: scale(1) translateX(0px);' +
				'}'
			, sheet.cssRules.length);

			// Add rightspin
			sheet.insertRule(
				'@' + p + 'keyframes rightspin {' +
					'0% {' + p + 'transform: scale(0.4) translateX(0px);}' +
					'25%{' + p + 'transform: scale(0.7) translateX(' + offset + 'px);z-index: 1;}' +
					'26% {z-index: 10;}' +
					'50% {' + p + 'transform: scale(1) translateX(0px);}' +
					'75% {' + p + 'transform: scale(0.7) translateX(-' + offset + 'px);z-index: 10;}' +
					'76% {z-index: 1;}' +
					'100% {' + p + 'transform: scale(0.4) translateX(0px);}' +
				'}'
			, sheet.cssRules.length);
		}
	};

	// Export class
	window.DoubleSpin = DoubleSpin;
})();
