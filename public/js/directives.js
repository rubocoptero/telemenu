window.angular.module('telemenu.maps').directive('gmap', function () {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/gmaps.html',
        link: function(scope, element, attrs, controller) {
            var geocoder;
            var map;

            function initialize() {
                geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(
                    40.46366700000001,
                    -3.7492200000000366
                    );
                var mapOptions = {
                    zoom: 4,
                    center: latlng
                };
                map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
            }

            scope.codeAddress = function() {
                var address = document.getElementById(attrs.geocodeInput).value;
                if (scope.marker) {
                    scope.marker.setMap(null);
                }
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        scope.marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            draggable: true
                        });
                        map.setZoom(16);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            };

            initialize();
        }
    };
});
