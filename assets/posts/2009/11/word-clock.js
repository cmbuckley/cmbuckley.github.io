google.load('mootools', '1.4.1');
google.setOnLoadCallback(function() {
	(function() {
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes() - (date.getMinutes() % 5) + ((date.getMinutes() % 5 > 2) ? 5 : 0);
		if (minutes > 30) { hours++; minutes = minutes % 60; }

		var classes = [hours % 12 || 12];

		switch (minutes) {
			case 0:  classes.push('oclock'); break;
			case 30: classes.push('half'); break;
			case 15: case 45: classes.push('quarter', (minutes == 15 ? 'past' : 'to')); break;
			default: classes.push('minutes', (30 - Math.abs(30 - minutes) + 'from'), (minutes < 30 ? 'past' : 'to'));
		}

		$('#sec').toggleClass('lit'); // sec needs to be id to avoid multiclass fail in IE6-
		$$('#clock span.lit:not([id=sec])').removeClass('lit'); // #sec fails in IE5.5
		classes.each(function(className) { $$('#clock span.' + className).addClass('lit'); });
	}).periodical(1000);
});
