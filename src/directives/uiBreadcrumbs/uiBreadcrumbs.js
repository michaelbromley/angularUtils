/**
 * Created by Michael on 02/04/14.
 */

angular.module('angularUtils.directives.uiBreadcrumbs', ['ui.router'])

    .directive('uiBreadcrumbs', function($interpolate, $state) {
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
                 * attribute and look up the corresponding property on the state's config object. The specified string can be interpolated against any resolved
                 * properties on the state config object, by using the usual {{ }} syntax.
                 * @param currentState
                 * @returns {*}
                 */
                function getDisplayName(currentState) {
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
                    // use the $interpolate service to handle any bindings in the propertyReference string.
                    displayName = $interpolate(propertyReference)(currentState.locals.globals);

                    return displayName;
                }
            }
        };
    })
;