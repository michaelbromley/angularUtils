angular.module( 'angularUtils.filters.ordinalDate', [] )

    .filter('ordinalDate', ['$filter', function($filter) {

        var getOrdinalSuffix = function(number) {
            var suffixes = ["'th'", "'st'", "'nd'", "'rd'"];
            var relevantDigits = (number < 30) ? number % 20 : number % 30;
            return "d" + ((relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0]);
        };

        return function(timestamp, format) {
            var regex = /d+((?!\w*(?=')))|d$/g;
            var date = new Date(timestamp);
            var dayOfMonth = date.getDate();
            var suffix = getOrdinalSuffix(dayOfMonth);

            format = format.replace(regex, function (match) {
                return match === "d" ? suffix : match;
            });
            return $filter('date')(date, format);
        };
    }]);