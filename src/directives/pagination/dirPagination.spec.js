/**
 * Created by Michael on 04/05/14.
 */

describe('dirPagination directive', function() {

    var $compile;
    var $scope;
    var containingElement;
    var myCollection;

    beforeEach(module('angularUtils.directives.dirPagination'));
    beforeEach(module('templates-main'));

    beforeEach(inject(function($rootScope, _$compile_) {

        $compile = _$compile_;
        $scope = $rootScope.$new();
        containingElement = angular.element('<div></div>');

        myCollection = [];
        for(var i = 1; i <= 100; i++) {
            myCollection.push('item ' + i);
        }
    }));

    function compileElement(collection, itemsPerPage, currentPage, customExpression) {
        var html;
        $scope.collection = collection;
        $scope.itemsPerPage = itemsPerPage;
        $scope.currentPage = currentPage || 1;
        var expression = customExpression || "item in collection | itemsPerPage: itemsPerPage";
        html = '<ul class="list"><li dir-paginate="'+ expression + '" current-page="currentPage">{{ item }}</li></ul> ' +
            '<dir-pagination-controls></dir-pagination-controls>';
        containingElement.append($compile(html)($scope));
        $scope.$apply();
    }

    function getListItems() {
        return containingElement.find('ul.list li').map(function() {
            return $(this).text().trim();
        }).get();
    }

    function getPageLinksArray() {
        return containingElement.find('ul.pagination li').map(function() {
            return $(this).text().trim();
        }).get();
    }

    describe('paginated list', function() {

        it('should throw an exception if itemsPerPage filter not set', function() {
            function compile() {
                var customExpression = "item in collection";
                compileElement(myCollection, 5, 1, customExpression);
            }
            expect(compile).toThrow("pagination directive: the 'itemsPerPage' filter must be set.");
        });

        it('should repeat the items like ng-repeat', function() {
            compileElement(myCollection);
            var listItems = getListItems();

            expect(listItems.length).toBe(100);
        });

        it('should limit the items to match itemsPerPage = 10', function() {
            var listItems;

            compileElement(myCollection, 10);
            listItems = getListItems();
            expect(listItems.length).toBe(10);
        });

        it('should limit the items to match itemsPerPage = 50', function() {
            var listItems;

            compileElement(myCollection, 50);
            listItems = getListItems();
            expect(listItems.length).toBe(50);
        });

        it('should not mutate the collection itself ', function() {
            compileElement(myCollection);
            expect($scope.collection.length).toBe(100);
            compileElement(myCollection, 50);
            expect($scope.collection.length).toBe(100);
            compileElement(myCollection, 5);
            expect($scope.collection.length).toBe(100);
        });

        it('should work correctly with other filters (filter)', function() {
            $scope.filterBy = '2';
            var customExpression = "item in collection | filter: filterBy | itemsPerPage: itemsPerPage";
            compileElement(myCollection, 5, 1, customExpression);

            var listItems = getListItems();
            expect(listItems).toEqual(['item 2', 'item 12', 'item 20', 'item 21', 'item 22']);
        });

        it('should work correctly with other filters (orderBy)', function() {
            var customExpression = "item in collection | orderBy:'toString()':true | itemsPerPage: itemsPerPage";
            compileElement(myCollection, 5, 1, customExpression);

            var listItems = getListItems();
            expect(listItems).toEqual(['item 99', 'item 98', 'item 97', 'item 96', 'item 95']);
        });

        it('should display the second page when compiled with currentPage = 2', function() {
            var listItems;
            compileElement(myCollection, 3, 2);
            listItems = getListItems();
            expect(listItems).toEqual(['item 4', 'item 5', 'item 6']);
        });

        it('should display the next page when the currentPage changes', function() {
            var listItems;
            compileElement(myCollection, 3);
            listItems = getListItems();
            expect(listItems).toEqual(['item 1', 'item 2', 'item 3']);

            $scope.$apply(function() {
                $scope.currentPage = 2;
            });
            listItems = getListItems();
            expect(listItems).toEqual(['item 4', 'item 5', 'item 6']);

            $scope.$apply(function() {
                $scope.currentPage = 3;
            });
            listItems = getListItems();
            expect(listItems).toEqual(['item 7', 'item 8', 'item 9']);
        });


        it('should work if itemsPerPage is a literal value', function() {
            var customExpression = "item in collection | itemsPerPage: 2";
            compileElement(myCollection, null, 1, customExpression);

            var listItems = getListItems();
            expect(listItems.length).toEqual(2);
            expect(listItems).toEqual(['item 1', 'item 2']);
        });

    });


    describe('if currentPage attribute is not set', function() {

        beforeEach(function() {
            $scope.collection = myCollection;
            html = '<ul class="list"><li dir-paginate="item in collection | itemsPerPage: 3">{{ item }}</li></ul> ' +
                '<dir-pagination-controls></dir-pagination-controls>';
            containingElement.append($compile(html)($scope));
            $scope.$apply();
        });

        it('should compile', function() {
            var listItems = getListItems();
            expect(listItems).toEqual(['item 1', 'item 2', 'item 3']);
        });

        it('should page correctly', function() {
            var pagination = containingElement.find('ul.pagination');

            pagination.children().eq(3).find('a').triggerHandler('click');
            $scope.$apply();
            expect($scope.__currentPage).toBe(3);
            var listItems = getListItems();
            expect(listItems).toEqual(['item 7', 'item 8', 'item 9']);
        });
    });

    describe('pagination controls', function() {

        it('should throw an exception if the dir-paginate directive has not been set up', function() {
            function compile() {
                var html = '<dir-pagination-controls></dir-pagination-controls>';
                containingElement.append($compile(html)($scope));
                $scope.$apply();
            }

            expect(compile).toThrow("pagination directive: the pagination controls cannot be used without the corresponding pagination directive.");
        });

        it('should not display pagination if all rows fit on one page', function() {
            compileElement(myCollection, 9999);
            var paginationLinks = getPageLinksArray();

            expect(paginationLinks.length).toBe(0);
        });

        it('should paginate by default if all items do not fit on page', function() {
            compileElement(myCollection, 40);
            var paginationLinks = getPageLinksArray();

            expect(paginationLinks).toEqual(['‹','1', '2', '3', '›']);
        });

        it('should update the currentPage property of $scope', function() {
            compileElement(myCollection, 40);
            var pagination = containingElement.find('ul.pagination');

            pagination.children().eq(3).find('a').triggerHandler('click');
            $scope.$apply();
            expect($scope.currentPage).toBe(3);

            pagination.children().eq(2).find('a').triggerHandler('click');
            $scope.$apply();
            expect($scope.currentPage).toBe(2);

            pagination.children().eq(1).find('a').triggerHandler('click');
            $scope.$apply();
            expect($scope.currentPage).toBe(1);
        });

        it('should show the correct pagination links at start of sequence', function() {
            compileElement(myCollection, 1);
            var pageLinks = getPageLinksArray();

            expect(pageLinks).toEqual(['‹','1', '2', '3', '4', '5', '6', '7', '...', '100', '›']);
        });

        it('should show the correct pagination links in middle sequence', function() {
            compileElement(myCollection, 1);
            $scope.$apply(function() {
                $scope.currentPage = 50;
            });
            var pageLinks = getPageLinksArray();

            expect(pageLinks).toEqual(['‹','1', '...', '48', '49', '50', '51', '52', '...', '100', '›']);
        });

        it('should show the correct pagination links at end of sequence', function() {
            compileElement(myCollection, 1);
            $scope.$apply(function() {
                $scope.currentPage = 99;
            });
            var pageLinks = getPageLinksArray();

            expect(pageLinks).toEqual(['‹','1', '...', '94', '95', '96', '97', '98', '99', '100', '›']);
        });

        it('should calculate pages based off collection after all filters are applied', function() {
            $scope.filterBy = '2';
            var customExpression = "item in collection | filter: filterBy | itemsPerPage: itemsPerPage";
            compileElement(myCollection, 5, 1, customExpression);

            var pageLinks = getPageLinksArray();
            expect(pageLinks.length).toEqual(6);
        });

        describe('optional attributes', function() {

            function compileWithAttributes(attributes) {
                $scope.collection = myCollection;
                $scope.currentPage = 1;
                html = '<ul class="list"><li dir-paginate="item in collection | itemsPerPage: 10" current-page="currentPage">{{ item }}</li></ul> ' +
                    '<dir-pagination-controls ' + attributes + ' ></dir-pagination-controls>';
                containingElement.append($compile(html)($scope));
                $scope.$apply();
            }


            it('should accept a max-size attribute to limit the length of the control', function() {
                compileWithAttributes(' max-size="5" ');

                var pageLinks = getPageLinksArray();

                expect(pageLinks).toEqual(['‹','1', '2', '3', '...', '10', '›']);
            });

            it('should impose a minimum max-size of 5', function() {
                compileWithAttributes(' max-size="2" ');

                var pageLinks = getPageLinksArray();

                expect(pageLinks).toEqual(['‹','1', '2', '3', '...', '10', '›']);
            });

            it('should go to the last page when clicking the end arrow', function() {
                compileWithAttributes(' boundary-links="true" ');
                var pagination = containingElement.find('ul.pagination');

                pagination.children().eq(10).find('a').triggerHandler('click');
                $scope.$apply();
                expect($scope.currentPage).toBe(10);
            });

            it('should go to the first page when clicking the end arrow', function() {
                compileWithAttributes(' boundary-links="true" ');
                var pagination = containingElement.find('ul.pagination');

                $scope.$apply(function() {
                    $scope.currentPage = 5;
                });
                expect($scope.currentPage).toBe(5);

                pagination.children().eq(0).find('a').triggerHandler('click');
                $scope.$apply();
                expect($scope.currentPage).toBe(1);
            });

            it('should page forward', function() {
                compileWithAttributes('  ');
                var pagination = containingElement.find('ul.pagination');

                pagination.children().eq(10).find('a').triggerHandler('click');
                $scope.$apply();
                expect($scope.currentPage).toBe(2);
            });
        });
    });
});
