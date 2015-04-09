/**
 * Author : Tim Lin
 * mail : linsuitm@gmail.com
 * Date : 2015/4/6
 */

(function()
{
	var sizeConst = 100;

	var prefixList = ['webkit', 'Moz', 'O', 'ms'];

	var defaultConfig = {
		size: 1,
		topColor: '#FF0000',
		bottomColor: '#008000',
		speed: 'fast'
	};

	// Initial style
	var styleList = {
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
	 * Sanitize negative, or over 1 value
	 *
	 * @param size
	 * @returns {*}
	 */
	function sanitizeSize(size)
	{
		var abs = Math.abs(size);

		if (abs === 0 || abs > 1) {
			return 1;
		} else {
			return size;
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
		if (this.node !== undefined) {
			this.node.parentNode.removeChild(this.node);
		}

		this.node = node;
		this.config = {};

		// Check css3 animation support
		this.supportAnimation = vendor(createElement(), 'animation');

		//speed setter
		this.config = {
			set speed(speed) {

				if (this.animationDuration !== undefined) return;

				switch (speed) {
					case 'fast':
						return this.animationDuration = '2s';
						break;
					case 'medium':
						return this.animationDuration = '4s';
						break;
					case 'slow':
						return this.animationDuration = '6s';
						break;
					default :
						return this.animationDuration = '2s';
						break;
				}
			}
		};

		// Merge config
		extendObj(this.config, config, defaultConfig);

		// Create 2 spinner
		this.topDiv = createElement('div', {className: 'spinner-inner top'});
		this.bottomDiv = createElement('div', {className: 'spinner-inner bottom'});

		this.mergeStyle();
	}

	DoubleSpin.prototype = {
		spin: function()
		{
			var self = this;

			// Animation not supported, use setTimeout instead
			if ( this.supportAnimation === undefined ) {

				var offset = 0,
					dir = true,
					neg = true,
					fps = 50 / 1000,
					dL = 2,
					minScale = 0.4,
					midScale = 0.7,
					maxScale = 1,
					z = true,
					bound = self.config.dimension / 2;

				var dS = (maxScale - midScale) * dL / bound;

				(function move() {

					if (dir == true) {
						offset+=dL;
					} else {
						offset-=dL;
					}

					if (offset >= bound && dir == true) {
						dir = !dir;
						z = !z;
					} else if (offset <= 0 && dir == false) {
						dir = !dir;
						neg = !neg
					};

					if (!neg) {
						maxScale+=dS;
						minScale-=dS;
					} else {
						maxScale-=dS;
						minScale+=dS;
					}

					self.moveTopDiv(offset, maxScale, neg, z);
					self.moveBottomDiv(offset, minScale, neg, z);

					self.timeout = setTimeout(move, 1/fps);

				}());

			} else {

				this.addKeyframes();
			}
		},
		moveTopDiv: function(left, scale, neg, z) {
			
			var o = neg ? '-' : '';
			var p = z ? '' : '-';

			this.topDiv.style[prefix.css + 'transform'] = 'translateX(' + o + left + 'px) scale(' + scale +')';
			this.topDiv.style.zIndex = p + 10;
		},
		moveBottomDiv: function(left, scale, neg, z) {

			var o = neg ? '' : '-';
			var p = z ? '-' : '';

			this.bottomDiv.style[prefix.css + 'transform'] = 'translateX(' + o + left + 'px) scale(' + scale +')';
			this.bottomDiv.style.zIndex = p + 10;
		},
		mergeStyle: function(config) {

			var c = config || this.config,
				s = styleList;

			var dimension = sizeConst * sanitizeSize(c.size);

			if (!c.animationDuration) {
				this.config.speed = c.speed;
			}

			s.spinnerInner.width = s.spinnerInner.height = dimension + 'px';
			s.spinnerInner.marginLeft = s.spinnerInner.marginTop = '-' + (parseInt(dimension) / 2) + 'px';
			s.top.animationDuration = s.bottom.animationDuration = this.config.animationDuration;
			s.top.background = c.topColor;
			s.bottom.background = c.bottomColor;

			addStyle(this.topDiv, s.spinnerInner, s.top);
			addStyle(this.bottomDiv, s.spinnerInner, s.bottom);

			insert(this.node, this.topDiv, this.bottomDiv);

			// Export to this object
			this.config.dimension = dimension;

			return this;
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
			console.log(sheet);
		},
		removeKeyframes: function() {

			var length = sheet.rules.length;

			for (var i = 0; i < length; i++) {
				sheet.deleteRule(0);
			}

			return this;
		},
		updateStyle: function(config) {

			this.mergeStyle(config).removeKeyframes().spin();

		}
	};

	// Export class
	window.DoubleSpin = DoubleSpin;
})();
