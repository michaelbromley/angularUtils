/**
 * dirPagination - AngularJS module for paginating (almost) anything.
 *
 *
 * Credits
 * =======
 *
 * Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ
 * for the idea on how to dynamically invoke the ng-repeat directive.
 *
 * I borrowed a couple of lines and a few attribute names from the AngularUI Bootstrap project:
 * https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js
 *
 * Created by Michael on 04/05/14.
 */

angular.module('angularUtils.directives.dirPagination', [])
    .directive('dirPaginate', function($compile, $parse, $timeout, paginationService) {
        return  {
            priority: 5000, //High priority means it will execute first
            terminal: true,
            compile: function(element, attrs){
                attrs.$set('ngRepeat', attrs.dirPaginate); //Add ng-repeat to the dom

                var expression = attrs.dirPaginate;
                // regex taken directly from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
                var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

                var filterPattern = /\|\s*itemsPerPage:\s*\S+\s*/;
                if (match[2].match(filterPattern) === null) {
                    throw "pagination directive: the 'itemsPerPage' filter must be set.";
                }
                var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
                var collectionGetter = $parse(itemsPerPageFilterRemoved);

                //Now that we added ng-repeat to the element, proceed with compilation
                //but skip directives with priority 5000 or above to avoid infinite
                //recursion (we don't want to compile ourselves again)
                var compiled =  $compile(element, null, 5000);

                paginationService.paginationDirectiveInitialized = true;

                return function(scope, element, attrs){
                    var currentPageGetter;
                    if (attrs.currentPage) {
                        currentPageGetter = $parse(attrs.currentPage);
                    } else {
                        // if the current-page attribute was not set, we'll make our own
                        scope.__currentPage = 1;
                        currentPageGetter = $parse('__currentPage');
                    }
                    paginationService.setCurrentPageParser(currentPageGetter, scope);

                    if (typeof attrs.totalItems !== 'undefined') {
                        paginationService.asyncMode = true;
                        scope.$watch(function() {
                            return $parse(attrs.totalItems)(scope);
                        }, function (result) {
                            if (0 < result) {
                                paginationService.setCollectionLength(result);
                            }
                        });
                    } else {
                        scope.$watchCollection(function() {
                            return collectionGetter(scope);
                        }, function(collection) {
                            if (collection) {
                                paginationService.setCollectionLength(collection.length);
                            }
                        });
                    }
                    //When linking just delegate to the link function returned by the new compile
                    compiled(scope);
                };
            }
        };
    })

    .directive('dirPaginationControls', function(paginationService) {
        /**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param rowsPerPage
         * @param paginationRange
         * @param collectionLength
         * @returns {Array}
         */
        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;

            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);

                var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i ++;
            }
            return pages;
        }

        /**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *
         * @param i
         * @param currentPage
         * @param paginationRange
         * @param totalPages
         * @returns {*}
         */
        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange/2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }

        return {
            restrict: 'AE',
            templateUrl:  'directives/pagination/dirPagination.tpl.html',
            scope: {
                maxSize: '=?',
                onPageChange: '&?'
            },
            link: function(scope, element, attrs) {
                if (!scope.maxSize) { scope.maxSize = 9; }
                scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
                scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

                if (paginationService.paginationDirectiveInitialized === false) {
                    throw "pagination directive: the pagination controls cannot be used without the corresponding pagination directive.";
                }

                var paginationRange = Math.max(scope.maxSize, 5);
                scope.pages = [];
                scope.pagination = {
                    last: 1,
                    current: 1
                };

                scope.$watch(function() {
                    return paginationService.getCollectionLength() * paginationService.getItemsPerPage();
                }, function(length) {
                    if (0 < length) {
                        generatePagination();
                    }
                });

                scope.$watch(function() {
                    return paginationService.getCurrentPage();
                }, function(currentPage) {
                    scope.pages = generatePagesArray(currentPage, paginationService.getCollectionLength(), paginationService.getItemsPerPage(), paginationRange);
                });

                scope.setCurrent = function(num) {
                    if (/^\d+$/.test(num)) {
                        if (0 < num && num <= scope.pagination.last) {
                            paginationService.setCurrentPage(num);
                            scope.pages = generatePagesArray(num, paginationService.getCollectionLength(), paginationService.getItemsPerPage(), paginationRange);
                            scope.pagination.current = num;

                            // if a callback has been set, then call it with the page number as an argument
                            if (scope.onPageChange) {
                                scope.onPageChange({ newPageNumber : num });
                            }
                        }
                    }
                };

                function generatePagination() {
                    scope.pages = generatePagesArray(1, paginationService.getCollectionLength(), paginationService.getItemsPerPage(), paginationRange);
                    scope.pagination.last = scope.pages[scope.pages.length - 1];
                    if (scope.pagination.last < scope.pagination.current) {
                        scope.setCurrent(scope.pagination.last);
                    }
                }
            }
        };
    })

    .filter('itemsPerPage', function(paginationService) {
        return function(collection, itemsPerPage) {
            var end;
            var start;
            if (collection instanceof Array) {
                itemsPerPage = itemsPerPage || 9999999999;
                if (paginationService.asyncMode) {
                    start = 0;
                } else {
                    start = (paginationService.getCurrentPage() - 1) * itemsPerPage;
                }
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(itemsPerPage);

                return collection.slice(start, end);
            } else {
                return collection;
            }
        };
    })

    .service('paginationService', function() {
        var itemsPerPage;
        var collectionLength;
        var currentPageParser;
        var context;
        this.paginationDirectiveInitialized = false;

        this.setCurrentPageParser = function(val, scope) {
            currentPageParser = val;
            context = scope;
        };
        this.setCurrentPage = function(val) {
            currentPageParser.assign(context, val);
        };
        this.getCurrentPage = function() {
            return currentPageParser(context);
        };

        this.setItemsPerPage = function(val) {
            itemsPerPage = val;
        };
        this.getItemsPerPage = function() {
            return itemsPerPage;
        };

        this.setCollectionLength = function(val) {
            collectionLength = val;
        };
        this.getCollectionLength = function() {
            return collectionLength;
        };
        this.asyncMode = false;
    })
;