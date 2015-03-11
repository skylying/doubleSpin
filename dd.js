//TODO: Merge default config - done
//TODO: 避免全局污染, 改用 self-execute function 寫 - done
//TODO: Cross browser css support
//TODO: Insert @keyframe
//TODO: add node to constructor
//TODO: Add user agent to define browser
//TODO: setInterval() alternative

(function()
{

	var prefix = ['webkit', 'moz', 'o', 'ms'];

	var defaultConfig = {
		dimension: 100,
		topColor: '#FF0000',
		bottomColor: '#008000',
		speed: 'fast'
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

	function insert(parent /* Node1, node2, ...*/)
	{
		var l = arguments.length;
		for (var i=1; i<l; i++)	{
			parent.appendChild(arguments[i]);
		}
		return parent;
	}

	var sheet = (function() {
		var el = createElement('style', {type : 'text/css'});
		insert(document.getElementsByTagName('head')[0], el);
		return el.sheet || el.styleSheet;
	}());

	function extendObj(extraObj, defaultObj)
	{
		var p;
		for (p in defaultObj) {
			if (extraObj[p] === undefined) {
				extraObj[p] = defaultObj[p];
			}
		}
		return extraObj;
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

		// speed setter
		this.config = {
			set speed(speed) {
				switch (speed) {
					case 'fast':
						return this.animationSpeed = '2s';
					case 'medium':
						return this.animationSpeed = '4s';
					case 'slow':
						return this.animationSpeed = '6s';
				}
			}
		};

		// Merge config
		extendObj(this.config, defaultConfig);
	}

	DoubleSpin.prototype = {
		spin: function()
		{
			var leftSpinner = createElement('div', {className: 'spinner-inner top'}),
				rightSpinner = createElement('div', {className: 'spinner-inner bottom'});

			insert(this.node, leftSpinner, rightSpinner);
			this.addStyle()
		},
		addStyle: function()
		{
			var classList = ['#spinner', '.spinner-inner', '.top', '.bottom'],
				l = classList.length,
				c = this.config;

			for (var i = 0; i < l; i++)
			{
				var className = classList[i];

				sheet.insertRule(
					className + this.getClass(className, c), sheet.cssRules.length
				)
			}
		},
		getClass: function(className, c)
		{
			switch(className){
				case '#spinner':
					return '{' +
						'width: 200px;' +
						'height: 200px;' +
						'background: #ddd;' +
						'position: relative;' +
						'left: 40%;' +
						'}';

				case '.spinner-inner':
					return '{' +
						'width:' + c.dimension + 'px;' +
						'height:' + c.dimension + 'px;' +
						'position : absolute;' +
						'border-radius: 50%;' +
						'}';

				case '.top':
					return '{' +
						'background:' + c.topColor +';' +
						'margin-left:' + (c.dimension / 2) + 'px;' +
						'-webkit-animation: leftspin ' + c.animationSpeed + ' linear infinite;' +
						'z-index: 100;' +
						'}';

				case '.bottom':
					return '{' +
						'background:' + c.bottomColor + ';' +
						'margin-left:' + (c.dimension / 2) + 'px;' +
						'-webkit-transform: scale(0.4);' +
						'-webkit-animation: rightspin ' + c.animationSpeed + ' linear infinite;z-index: 1;' +
						'}';
			}
		}
	};

	// Export class
	window.DoubleSpin = DoubleSpin;
})();
