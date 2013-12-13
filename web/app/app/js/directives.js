'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('box', [function () {
        return {
            restrict: "E",
//            replace: true,
            scope: {
                bgC: "="
            },
            templateUrl: "partials/dir-box.html",
            controller: ['$scope', '$http', function ($scope, $http) {
//                $scope.bgClr = bg;
                $scope.isHover = false;
//                $scope.bgClr = "box-green";
            }],
            link: function (scope, iElement, iAttrs, ctrl) {
//                scope.$apply();
                iElement.bind("mouseover", function () {
                    scope.isHover = true;
                });
            }
        }
    }]);
