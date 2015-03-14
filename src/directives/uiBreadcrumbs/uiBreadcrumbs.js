/**
 * uiBreadcrumbs automatic breadcrumbs directive for AngularJS & Angular ui-router.
 *
 * https://github.com/michaelbromley/angularUtils/tree/master/src/directives/uiBreadcrumbs
 *
 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>
 */


; (function() {

    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.uiBreadcrumbs',
        templateUrl = 'directives/uiBreadcrumbs/uiBreadcrumbs.tpl.html';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch(err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, ['ui.router']);
    }

    module.directive('uiBreadcrumbs', uiBreadCrumbsDirective);

    uiBreadCrumbsDirective.$inject = ['$interpolate', '$state' ];
    function uiBreadCrumbsDirective($interpolate, $state)
    {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/common/directives/breadcrumbs.html',
            scope: {
                displaynameProperty: '@',
                abstractproxyProperty: '@?'
            },
            link: function(scope) {
                scope.breadcrumbs = [];

                scope.$on('$stateChangeSuccess', function() { update(); });

                if ($state.$current.name !== '')
                    update();


                /**
                 * Start with the current state and traverse up the path to
                 * build the array of breadcrumbs that can be used in an
                 * ng-repeat in the template.
                 */
                function update() {
                    var breadcrumbs = [],
                        state = $state.$current;

                    while(state && state.name !== '') {
                        var cur = resolveState(state);
                        if (cur) {
                            var displayName = getDisplayName(cur);
                            if (displayName !== false && !isin(cur, breadcrumbs))
                                breadcrumbs.push({ displayName: displayName,
                                                   route: cur.name });
                        }

                        state = state.parent;
                    }

                    breadcrumbs.reverse();
                    scope.breadcrumbs = breadcrumbs;
                }

                /**
                 * Get the state to put in the breadcrumbs array, taking into
                 * account that if the current state is abstract, we need to
                 * either substitute it with the state named in the
                 * `scope.abstractProxyProperty` property, or set it to `false`
                 * which means this breadcrumb level will be skipped entirely.
                 * @param state
                 * @returns {*}
                 */
                function resolveState(state) {
                    if (state.abstract === true) {
                        if (scope.abstractproxyProperty !== undefined) {
                            var proxy = evalObject(scope.abstractproxyProperty,
                                                   state);
                            if (proxy)
                                return $state.get(proxy);
                        }

                        return false;
                    }

                    return state;
                }

                /**
                 * Resolve the displayName of the specified state. Take the
                 * property specified by the `displayname-property` attribute
                 * and look up the corresponding property on the state's config
                 * object. The specified string can be interpolated against any
                 * resolved properties on the state config object, by using the
                 * usual {{ }} syntax.
                 * @param state
                 * @returns {*}
                 */
                function getDisplayName(state) {
                    if (!scope.displaynameProperty)
                        return state.name;

                    var prop = evalObject(scope.displaynameProperty, state);
                    if (prop === false)
                        return false;
                    else if (prop === undefined)
                        return state.name;

                    var ctx = state.locals !== undefined
                            ? state.locals.globals
                            : state;

                    return $interpolate(prop)(ctx);
                }

                /**
                 * Given a string of the type 'object.property.property',
                 * traverse the given context (eg the current $state object)
                 * and return the value found at that path.
                 *
                 * @param path
                 * @param context
                 * @returns {*}
                 */
                function evalObject(path, context) {
                    /* This would probably be best done a different way. */
                    var arr = path.split('.');
                    for (var i = 0, l = arr.length; i < l && context; ++i)
                        context = context[arr[i]];

                    return context || undefined;
                }

                /**
                 * Check whether the current `state` has already appeared in
                 * the current breadcrumbs array. This check is necessary when
                 * using abstract states that might specify a proxy that is
                 * already there in the breadcrumbs.
                 * @param state
                 * @param breadcrumbs
                 * @returns {boolean}
                 */
                function isin(state, breadcrumbs) {
                    var name = state.name;
                    return breadcrumbs.some(function (i) {
                        return i.route === name;
                    } );
                }
            }
        };
    }

} )();