/**
 * Created by Michael on 02/04/14.
 */

describe('uiBreadcrumbs directive', function() {

    var $compile;
    var $scope;
    var element;
    var $state;

    beforeEach(module('angularUtils.directives.uiBreadcrumbs'));
    beforeEach(module('templates-main'));

    describe('synchronous behaviour', function() {

        beforeEach(function() {
            var mockModule = angular.module('mockModule', function() {})
                .config(function($stateProvider) {
                    $stateProvider
                        .state('root', {
                            url: '/',
                            data: {
                                displayName: 'Home'
                            },
                            custom: {
                                alternateDisplayName: 'Other Home'
                            }
                        })
                        .state('root.section', {
                            url: 'section/',
                            data: {
                                displayName: 'Section 1'
                            }
                        })
                        .state('root.section.subsection', {
                            url: 'subsection/',
                            data: {
                                displayName: 'Subsection'
                            }
                        })
                        .state('root.section.subsection.nobreadcrumb', {
                            url: 'subsection/bit',
                            data: {
                                displayName: false
                            }
                        })
                        .state('async1', {
                            url: 'aync1/',
                            data: {
                                displayName: 'Async Route 1'
                            },
                            resolve:{
                                simpleProperty: function() {
                                    return 'hello';
                                }
                            }
                        })
                        .state('async2', {
                            url: 'async2/',
                            data: {
                                displayName: '{{ resolvedName | uppercase }}'
                            },
                            resolve:{
                                resolvedName: function(){
                                    return "A Good Route";
                                }
                            }
                        });
                });
            module('mockModule');
            // Kickstart the injectors previously registered with calls to angular.mock.module
            inject(function () {});
        });

        beforeEach(inject(function($rootScope, _$compile_, _$state_) {
            $compile = _$compile_;
            $scope = $rootScope.$new();
            $state = _$state_;

            element = $compile('<ui-breadcrumbs displayname-property="data.displayName"></ui-breadcrumbs>')($scope);
            $scope.$apply();

            $state.go('root.section.subsection');
            $scope.$apply();
        }));

        it('should display the breadcrumbs <ol> element', function() {
            expect(element.children()[0].tagName).toBe('OL');
        });

        it('should display the correct number of list items', function() {
            expect(element[0].querySelectorAll('li').length).toBe(3);
        });

        it('should display the displayName if it exists', function() {
            expect(element[0].querySelectorAll('li')[0].innerHTML).toContain('Home');
            expect(element[0].querySelectorAll('li')[1].innerHTML).toContain('Section 1');
            expect(element[0].querySelectorAll('li')[2].innerHTML).toContain('Subsection');
        });

        it('should insert the correct route in a ui-sref attribute', function() {
            expect(element[0].querySelectorAll('li')[1].innerHTML).toContain('ui-sref="root.section"');
        });

        it('should apply the "active" class to the current state breadcrumb', function() {
            expect(angular.element(element[0].querySelectorAll('li')[2]).hasClass("active")).toBe(true);
        });

        it('should not add a link to current state breadcrumb', function() {
            var activeLi = angular.element(element[0].querySelectorAll('li')[2]);
            expect(activeLi.html()).not.toContain('href');
        });

        it('should update on route change', function() {
            $state.go('root');
            $scope.$apply();
            expect(element[0].querySelectorAll('li').length).toBe(1);
        });

        it('should not make a breadcrumb if displayName is set to false', function() {
            $state.go('root.section.subsection.nobreadcrumb');
            $scope.$apply();

            expect(element[0].querySelectorAll('li').length).toBe(3);
            expect(angular.element(element[0].querySelectorAll('li')[2]).hasClass("active")).toBe(true);
        });

        it('should show correct displayName for alternative directive attribute', function() {
            var element2 = $compile('<ui-breadcrumbs displayname-property="custom.alternateDisplayName"></ui-breadcrumbs>')($scope);
            $scope.$apply();

            $state.go('root');
            $scope.$apply();

            expect(element2[0].querySelectorAll('li')[0].innerHTML).toContain('Other Home');
        });

        it('should work when the route has a async resolve defined on it', function() {
            var element2 = $compile('<ui-breadcrumbs displayname-property="data.displayName"></ui-breadcrumbs>')($scope);
            $scope.$apply();

            $state.go('async1');
            $scope.$apply();

            expect(element2[0].querySelectorAll('li')[0].innerHTML).toContain('Async Route 1');
        });

        it('should interpolate the string against the resolved properties on the config object', function() {
            var element2 = $compile('<ui-breadcrumbs displayname-property="data.displayName"></ui-breadcrumbs>')($scope);
            $scope.$apply();

            $state.go('async2');
            $scope.$apply();

            expect(element2[0].querySelectorAll('li')[0].innerHTML).toContain('A GOOD ROUTE');
        });

    });

});