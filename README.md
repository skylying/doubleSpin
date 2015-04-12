# doubleSpin
This is simple loading icon built by pure javascript without any external library dependencies.

# Features
 - jQuery free
 - Update style anytime
 - 4 configurable properties
  - topColor
  - bottomColor
  - speed ('slow', 'medium', 'fast')
  - size (0.1 ~ 1)
  
Demo  http://skylying.github.io/doubleSpin/

# Browser support
 - IE 9+ (include IE9)
 - Chrome 31+
 - FF 31+
 - Safari 7+
 
# How to use

- HTML

```HTML
<div id="spinner"></div>
```

- javascript

```javascript
// Set config
var spinner = new DoubleSpin(document.getElementById('spinner'), {
  size: 1,
  topColor: '#FF0000',
  bottomColor: '#008000',
  speed: 'fast'
});

// Start!
spinner.spin();
```
