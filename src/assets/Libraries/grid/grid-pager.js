danieleePrizeApp.directive('gridPager', function($timeout, $filter, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/libraries/grid/grid-pager.html',
        replace: true,
        scope: {
            update: '&',
            data: '=',
            isdataloaded: '=',
            paging: '=',
            countRows: '=',
            startRow: '=',
            endRow: '=',
            class: '@'
        },
        link: function(scope, elem, attr) {
            $timeout(function() {
                scope.countRows = angular.isDefined(scope.countRows) ? scope.countRows : 50;
                if (scope.paging == undefined)
                    scope.paging = [25, 50, 75];
                scope.countRows = scope.endRow;
            });

            scope.updateCount = function(count) {
                scope.countRows = count;
            };

            scope.showLoading = function() {
                $rootScope.isWait = true;

                try {
                    $rootScope.$digest();
                } catch (e) {

                }

                $timeout(function() {
                    $rootScope.isWait = false;
                });

            };

            scope.updateData = function(from, to) {

                scope.showLoading();

                $timeout(function() {
                    var length = scope.data.length;
                    if (from < 0)
                        scope.startRow = 0;
                    else
                        scope.startRow = from;
                    if (to > length)
                        scope.endRow = length;
                    else
                        scope.endRow = to;
                });

            };

            scope.goToPage = function(pageNumber) {
                scope.showLoading();

                $timeout(function() {
                    scope.startRow = pageNumber * scope.countRows;
                    scope.endRow = scope.startRow + scope.countRows;
                });
            };

            scope.getCountPage = function() {
                var countPages = (scope.data.length <= scope.countRows) ? 1 : Math.floor(scope.data.length / scope.countRows);
                var currentPage = Math.floor(scope.data.length / scope.countRows) - Math.abs(scope.startRow / scope.countRows - Math.floor(scope.data.length / scope.countRows)) + 1;
                return countPages + ' / ' + currentPage;
            };

            scope.getCountPages = function() {
                return (scope.data.length <= scope.countRows) ? 1 : Math.floor(scope.data.length / scope.countRows);
            };

            //return array pages count length for "while" repeat
            scope.getPagesCountArray = function(num) {
                return new Array(num);
            };

            var dataWatch = scope.$watch('isdataloaded', function(newValue) {
                //&& scope.data.length > 0 ---> if i do this if, the data not refreshed when the data is [] because the out filters
                if (scope.data != undefined) {
                    //if i cancel watch the mitsvot and result not working good because the data change by outers filters
                    //dataWatch();
                }
            }, true);
        }
    }
});