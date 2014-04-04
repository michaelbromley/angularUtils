# startsWith Filter

Dead simple - whereas the standard AngularJS `filter` filter will return a match if the search string appears anywhere within the test string, this filter only returns a match if the test string *starts with* the search string.

For example:

```JavaScript
// in your controller
$scope.things = ['cathode', 'house', 'chomp'];
$scope.search = "ho";
```
```html
// in your template
<li ng-repeat="thing in things | filter: search">{{thing}}</li> // cathode, house, chomp

<li ng-repeat="thing in things | startsWith: search">{{thing}}</li> // house
```