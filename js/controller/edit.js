mpw.controller("edit", ["$scope", "$routeParams", function($scope, $routeParams){
	$scope.someText = "passage";
	$scope.passageId = $routeParams.passageId;
}])