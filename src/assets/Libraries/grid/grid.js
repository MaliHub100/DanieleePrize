danieleePrizeApp.directive('grid', function($timeout, $filter, $rootScope, $window, $compile, screenHeight, excelFactory,
        $sce, $location) { //SysTables
        return {
            restrict: 'E',
            templateUrl: 'scripts/libraries/grid/grid.html',
            replace: true,
            scope: {
                scope: '=',
                columns: '=',
                data: '=',
                currentData: '=',
                isDataLoaded: '=',
                filterFields: '=',

                saveOriginalFilters: '=?',
                countRows: '=',
                startRow: '=',
                endRow: '=',
                clickRow: '&',
                dbClickRow: '&',
                currentSort: '=?',
                footerText: '@',
                heightLess: '@',
                height: '@',
                informationFooter: '@',
                gridIdentity: '=',
            },
            link: function(scope, elem, attr) {

                if (!$rootScope.gridData)
                    $rootScope.gridData = {};

                scope.currentPathIdentity = scope.gridIdentity;

                if (!$rootScope.gridData[scope.currentPathIdentity])
                    $rootScope.gridData[scope.currentPathIdentity] = {};

                if (!angular.equals($rootScope.gridData[scope.currentPathIdentity], {})) {
                    scope.filterFields = $rootScope.gridData[scope.currentPathIdentity].filters;
                    scope.currentsort = $rootScope.gridData[scope.currentPathIdentity].sort;
                } else {
                    scope.filterFields = angular.isDefined(scope.filterFields) ? scope.filterFields : {};
                    scope.currentsort = angular.isDefined(scope.currentsort) ? scope.currentsort : {};
                }

                scope.$on("$destroy", function() {
                    if ($rootScope.gridData[scope.currentPathIdentity])
                        $rootScope.gridData[scope.currentPathIdentity] = { filters: scope.filterFields, sort: scope.currentsort };
                });

                $rootScope.$watch(function() {
                    return $location.path();
                }, function(value, oldValue) {
                    if (value != oldValue)
                        $rootScope.gridData[scope.currentPathIdentity] = undefined;
                });

                scope.saveOriginalFilters = angular.isDefined(scope.saveOriginalFilters) ? scope.saveOriginalFilters : false;

                scope.currentData;
                scope.data;
                scope.sortFields = [];
                scope.informationFooter = angular.isDefined(scope.informationFooter) ? scope.informationFooter + "" : "";

                $timeout(function() {
                    angular.forEach(scope.columns, function(value, key) {
                        if (undefined != value.fieldName)
                            scope.sortFields.push({ name: value.fieldName, value: true });
                    });
                });

                scope.click = function(item, index, col) {
                    scope.clickRow({ item: item, position: scope.startRow + index });
                };

                scope.doubleClick = function(item, index, col) {

                    scope.dbClickRow({ item: item, position: scope.startRow + index });
                };

                scope.sort = function(col) {
                    if (col.sort == false) return;
                    scope.currentSort = $filter('filter')(scope.sortFields, { name: col.fieldName }, true)[0];
                    angular.forEach(scope.sortFields, function(value, key) {
                        if (value != scope.currentSort)
                            value.value = true;
                    });
                    scope.currentSort.value = !scope.currentSort.value;
                    scope.goToFirstPage();
                };

                scope.goToFirstPage = function() {
                    scope.startRow = 0;
                    scope.endRow = scope.countRows;
                };

                scope.scrollToTop = function() {
                    $timeout(function() {
                        try {
                            angular.element(".gridBody")[0].scrollTop = 0;
                        } catch (err) {
                            console.log(err);
                        }
                    });
                };

                scope.$watch('[startRow, endRow]', function() {
                    scope.scrollToTop();
                }, true);

                scope.$on('exportToExcel', function(scopeDetails, data) {
                    var columns = $filter('filter')(scope.columns, function(col) {
                        return col.export != false;
                        // return col.fieldName == null ? false : true;
                    }, true);
                    excelFactory.excelExport(data.fileName, columns, scope.getDataFilter(), scope.scope);
                });
                scope.$on('pdfExport', function(scopeDetails, data) {
                    var columns = $filter('filter')(scope.columns, function(col) {
                        return col.fieldName == null ? false : true;
                    }, true);
                    excelFactory.pdfExport(data.fileName, columns, scope.getDataFilter());
                });

                scope.changeSelected = function(fieldName) {
                    scope.selectAll = !scope.selectAll;

                    angular.forEach(scope.currentData, function(item) {
                        // if ($filter('filter')(scope.currentData, item, true).length > 0)
                        // if(scope. containsObject(item,scope.currentData))
                        item[fieldName] = scope.selectAll;
                    });
                    //scope.refreshFilteredDate();

                };

                window.onResize = function() {
                    if (angular.isDefined(scope.height))
                        scope.screenHeight = scope.height;
                    else
                        $timeout(function() {
                            var less = angular.isDefined(scope.heightLess) ? parseInt(scope.heightLess) : 90;
                            screenHeight.getScreenHeight('.gridBody', less, function(result) {
                                scope.screenHeight = result;
                            });
                        });
                };
                window.onResize();

                var dataWatch = scope.$watch('isDataLoaded', function(newValue) {

                    if (scope.data != undefined && scope.data.length > 0) {
                        scope.sortFields = [];
                        angular.forEach(scope.columns, function(value, key) {
                            if (undefined != value.fieldName)
                                scope.sortFields.push({ name: value.fieldName, value: true });
                        });
                        scope.isDataLoaded = false;


                        scope.currentData = scope.getDataFilter();


                        scope.scrollToTop();

                        //if (scope.saveOriginalFilters)
                        //    scope.filterFields = angular.copy(scope.originalfilters);
                    }
                }, true);

                scope.$on('getCurrentSort', function(scopeDetails, data) {
                    return scope.currentSort;
                });

                scope.getDataField = function(item, fieldName) {
                    if (undefined != fieldName && fieldName.indexOf('template:') != -1) {
                        return eval(fieldName.split('template:')[1]);
                    } else {
                        var lName = undefined != fieldName ? fieldName.split('.') : [];
                        var name = item;
                        angular.forEach(lName, function(val) {
                            name = name[val];
                        });
                        return name;
                    }
                };

                scope.getDataFilter = function() {

                    var filterData = [];
                    angular.forEach(scope.data, function(item) {
                        var isCorrect = true;

                        angular.forEach(scope.filterFields, function(val, key) {
                            var dataFieldVal = scope.getDataField(item, key);

                            if (undefined == dataFieldVal ||
                                (!(dataFieldVal instanceof Date) && (dataFieldVal + '').indexOf(val) == -1) ||
                                (dataFieldVal instanceof Date && $filter('date')(dataFieldVal, 'dd.MM.yy').indexOf(val) == -1))
                                isCorrect = false;
                        });
                        if (Object.keys(scope.filterFields).length == 0)
                            filterData = scope.data;
                        else if (Object.keys(scope.filterFields).length > 0 && isCorrect)
                            filterData.push(item);
                    });

                    return filterData;
                };

                var dataWatch = scope.$watch('filterFields', function(newValue) {
                    if (scope.data != undefined && scope.data.length > 0) {
                        scope.currentData = scope.getDataFilter();
                    }
                }, true);

                scope.getSort = function(funcText) {
                    if (undefined != funcText && funcText.indexOf('template:') != -1) {
                        angular.forEach(scope.currentData, function(item) {
                            var text = scope.getDataField(item, funcText);
                            item['currentSort'] = text;
                        });
                        return 'currentSort';
                    } else {
                        return funcText;
                    }
                };

                scope.getData = function() {


                    if (scope.currentSort)

                    // (currentData | orderBy : getSort(currentSort.name) : currentSort.value).slice(startRow, endRow)
                        return ($filter('orderBy')(scope.currentData, scope.getSort(scope.currentSort.name), scope.currentSort.value)).slice(scope.startRow, scope.endRow);

                    else if (scope.currentData != undefined)
                        return scope.currentData.slice(scope.startRow, scope.endRow);
                };
            }
        }
    })
    .directive('compileData', function($compile) {
        return {
            scope: true,
            link: function(scope, element, attrs) {
                var elmnt;
                attrs.$observe('template', function(myTemplate) {
                    if (angular.isDefined(myTemplate) && myTemplate != '') {
                        elmnt = $compile(myTemplate)(scope);
                        element.html(""); // dummy "clear"
                        element.append(elmnt);
                    }
                });
            }
        };
    });


//TODO: column example
//var column = {
//    template: ''
//    title: '',
//    fieldName: '',
//    width: '',
//    filter: true,
//    type: '',
//    sort: true
//};


//if (scope.saveOriginalFilters)
//    scope.filterFields = angular.copy(scope.OriginalFilters);

//if (scope.saveOriginalFilters)
//    scope.OriginalFilters = angular.copy(scope.filterFields);