

function createElement(tag, props)
{
	var e = document.createElement(tag || 'div');
	for (var n in props) {
		e[n] = props[n];
	}

	return e;
}

