window.angular.module('telemenu.places')
    .factory('Places', ['$http', '$upload', function ($http, $upload) {
        var baseUrl = '/places';

        var appendToBaseUrl = function (id) {
            return baseUrl + '/' + id;
        };

        var upload = function (method, url, place, image) {
            return $upload.upload({
                    url: url,
                    method: method,
                    data: serializePlace(place),
                    file: image,
                    fileFormDataName: 'image'
                });
        };

        var serializePlace = function (place) {
            return { place: JSON.stringify(place) };
        };

        return {
            create: function (place, image) {
                return upload('POST', baseUrl, place, image);
            },
            mine: function() {
                return $http.get(baseUrl);
            },
            update: function (id, place, image) {
                var updateUrl = appendToBaseUrl(id);

                if (image) {
                    return upload('PUT', updateUrl, place, image);
                }

                return $http.put(
                    updateUrl,
                    serializePlace(place)
                );
            },
            findOne: function (id) {
                var findOneUrl = appendToBaseUrl(id);

                return $http.get(findOneUrl);
            },
            remove: function (id) {
                return $http['delete'](appendToBaseUrl(id));
            }
        };
    }]);
