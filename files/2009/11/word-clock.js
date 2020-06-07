document.addEventListener('DOMContentLoaded', function () {
    setInterval(function () {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes() - (date.getMinutes() % 5) + ((date.getMinutes() % 5 > 2) ? 5 : 0);
        if (minutes > 30) { hours++; minutes = minutes % 60; }

        var classes = ['n' + (hours % 12 || 12)];

        switch (minutes) {
            case 0:  classes.push('oclock'); break;
            case 30: classes.push('half'); break;
            case 15: case 45: classes.push('quarter', (minutes == 15 ? 'past' : 'to')); break;
            default: classes.push('minutes', 'n' + (30 - Math.abs(30 - minutes) + 'from'), (minutes < 30 ? 'past' : 'to'));
        }

        document.getElementById('sec').classList.toggle('lit');
        document.querySelectorAll('#clock span.lit:not([id="sec"])').forEach(function (el) {
            el.classList.remove('lit');
        });

        classes.forEach(function(className) {
            document.querySelectorAll('#clock span.' + className).forEach(function (el) {
                el.classList.add('lit');
            });
        });
    }, 1000);
});
