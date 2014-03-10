window.angular.module('telemenu.system')
    .factory('DateMinutesConversor', function() {
        return {
            toMinutes: function (date) {
                var minutes = 0;
                if ( date instanceof Date ) {
                    minutes += date.getHours() * 60;
                    minutes += date.getMinutes();
                }

                return minutes;
            },
            toDate: function (minutes) {
                var date = new Date();

                if (typeof minutes === 'number') {
                    date.setHours(Math.floor(minutes / 60));
                    date.setMinutes(minutes % 60);
                }

                return date;
            }
        };
    });
