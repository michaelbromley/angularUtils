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

    beforeEach(function() {
        var mockModule = angular.module('mockModule', [])
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
                    })
                    .state( 'root.abstract', {
                        abstract: true,
                        url: 'abstract/',
                        data: {
                            breadcrumbProxy: 'abstract.child'
                        }
                    })
                    .state( 'root.abstract.child', {
                        url: 'list/',
                        data: {
                            displayName: 'Concrete'
                        }
                    })
                    .state( 'root.things', {
                        abstract: true,
                        url: 'things/',
                        data: {
                            breadcrumbProxy: 'root.things.list'
                        }
                    })
                    .state( 'root.things.list', {
                        url: 'all/',
                        data: {
                            displayName: 'Things'
                        }
                    })
                    .state( 'root.things.detail', {
                        url: 'detail/',
                        data: {
                            displayName: 'A Thing'
                        }
                    })
                    .state( 'root.project', {
                        abstract: true,
                        url: 'abstract2/',
                        data: {
                            breadcrumbProxy: 'root.project.dashboard'
                        },
                        resolve: {
                            resolvedName: function(){
                                return "Project";
                            }
                        }
                    })
                    .state( 'root.project.dashboard', {
                        url: 'dashboard/',
                        data: {
                            displayName: '{{ resolvedName }} Dashboard'
                        }
                    })
                    .state( 'root.project.tasks', {
                        url: 'list/',
                        data: {
                            displayName: '{{ resolvedName }} Tasks'
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

    it('should not display an abstract state in the breadcrumbs', function() {
        $state.go('root.abstract.child');
        $scope.$apply();

        expect(element[0].querySelectorAll('li')[0].innerHTML).toContain('Home');
        expect(element[0].querySelectorAll('li')[1].innerHTML).toContain('Concrete');
        expect(element[0].querySelectorAll('li')[2]).not.toBeDefined();
        expect(element[0].querySelectorAll('li').length).toBe(2);
    });

    it('should not display an abstract state in the breadcrumbs even if proxy attribute is set', function() {
        var element2 = $compile('<ui-breadcrumbs displayname-property="data.displayName" abstract-proxy-property="data.breadcrumbProxy"></ui-breadcrumbs>')($scope);
        $state.go('root.abstract.child');
        $scope.$apply();

        expect(element2[0].querySelectorAll('li')[0].innerHTML).toContain('Home');
        expect(element2[0].querySelectorAll('li')[1].innerHTML).toContain('Concrete');
        expect(element2[0].querySelectorAll('li')[2]).not.toBeDefined();
        expect(element2[0].querySelectorAll('li').length).toBe(2);
    });

    it('should not display an abstract state if no proxy has been set', function() {
        $state.go('root.things.detail');
        $scope.$apply();

        expect(element[0].querySelectorAll('li')[0].innerHTML).toContain('Home');
        expect(element[0].querySelectorAll('li')[1].innerHTML).toContain('A Thing');
    });

    it('should substitute an abstract state with a proxy if one has been set', function() {
        var element2 = $compile('<ui-breadcrumbs displayname-property="data.displayName" abstract-proxy-property="data.breadcrumbProxy"></ui-breadcrumbs>')($scope);
        $state.go('root.things.detail');
        $scope.$apply();

        expect(element2[0].querySelectorAll('li')[0].innerHTML).toContain('Home');
        expect(element2[0].querySelectorAll('li')[1].innerHTML).toContain('Things');
        expect(element2[0].querySelectorAll('li')[2].innerHTML).toContain('A Thing');
    });

    it('should not display the abstract proxy if it has already appeared in the breadcrumbs', function() {
        var element2 = $compile('<ui-breadcrumbs displayname-property="data.displayName" abstract-proxy-property="data.breadcrumbProxy"></ui-breadcrumbs>')($scope);
        $state.go('root.things.list');
        $scope.$apply();

        expect(element2[0].querySelectorAll('li')[0].innerHTML).toContain('Home');
        expect(element2[0].querySelectorAll('li')[1].innerHTML).toContain('Things');
        expect(element2[0].querySelectorAll('li')[2]).not.toBeDefined();
        expect(element2[0].querySelectorAll('li').length).toBe(2);
    });

    it('should use resolved variables for abstract state proxy', function() {
        var element2 = $compile('<ui-breadcrumbs displayname-property="data.displayName" abstract-proxy-property="data.breadcrumbProxy"></ui-breadcrumbs>')($scope);
        $state.go('root.project.tasks');
        $scope.$apply();

        expect(element2[0].querySelectorAll('li')[0].innerHTML).toContain('Home');
        expect(element2[0].querySelectorAll('li')[1].innerHTML).toContain('Project Dashboard');
        expect(element2[0].querySelectorAll('li')[2].innerHTML).toContain('Project Tasks');
        expect(element2[0].querySelectorAll('li')[3]).not.toBeDefined();
        expect(element2[0].querySelectorAll('li').length).toBe(3);
    });

});
