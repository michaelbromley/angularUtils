/**
 * Created by Michael on 02/04/14.
 */

angular.module('angularUtils.directives.uiBreadcrumbs', ['ui.router', 'templates-main'])

    .directive('uiBreadcrumbs', function($state) {
        return {
            restrict: 'E',
            templateUrl: 'directives/uiBreadcrumbs/uiBreadcrumbs.tpl.html',
            scope: {
                displaynameProperty: '@'
            },
            link: function(scope) {
                scope.breadcrumbs = [];
                if ($state.$current.name !== '') {
                    updateBreadcrumbsArray();
                }
                scope.$on('$stateChangeSuccess', function() {
                    updateBreadcrumbsArray();
                });

                /**
                 * Start with the current state and traverse up the path to build the
                 * array of breadcrumbs that can be used in an ng-repeat in the template.
                 */
                function updateBreadcrumbsArray() {
                    var breadcrumbs = [];
                    var currentState = $state.$current;

                    while(currentState && currentState.name !== '') {
                        var displayName = getDisplayName(currentState);
                        if (displayName !== false) {
                            breadcrumbs.push({
                                displayName: displayName,
                                route: currentState.name
                            });
                        }
                        currentState = currentState.parent;
                    }

                    breadcrumbs.reverse();
                    scope.breadcrumbs = breadcrumbs;
                }

                /**
                 * Resolve the displayName of the specified state. Take the property specified by the `displayname-property`
                 * attribute and look up the corresponding property on the state's config object. If the string found begins with
                 * a colon eg `:username`, that signifies that the displayName should be provided by the result of the named `resolve` property.
                 * @param currentState
                 * @returns {*}
                 */
                function getDisplayName(currentState) {
                    var resolveProperty;
                    var i;
                    var propertyReference;
                    var propertyArray;
                    var displayName;

                    if (!scope.displaynameProperty) {
                        // if the displayname-property attribute was not specified, default to the state's name
                        return currentState.name;
                    }
                    propertyArray = scope.displaynameProperty.split('.');
                    propertyReference = currentState;

                    for (i = 0; i < propertyArray.length; i ++) {
                        if (angular.isDefined(propertyReference[propertyArray[i]])) {
                            if (propertyReference[propertyArray[i]] === false) {
                                return false;
                            } else {
                                propertyReference = propertyReference[propertyArray[i]];
                            }
                        } else {
                            // if the specified property was not foundm default to the state's name
                            return currentState.name;
                        }
                    }
                    if (propertyReference.indexOf(':') === 0) {
                        // the : syntax indicates a reference to a resolved property, so use that instead
                        resolveProperty = propertyReference.substr(1);
                        displayName = currentState.locals.globals[resolveProperty];
                    } else {
                        displayName = propertyReference;
                    }
                    return displayName;
                }
            }
        };
    })
;