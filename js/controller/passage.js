mpw.controller("passage", ["$scope", "$routeParams", "$request", "$location", function($scope, $routeParams, $request, $location) {
	$scope.passageId = $routeParams.passageId;
	$scope.widget = {
		dynamic: {
			data: ""
		},
		edit: {
			text: "Edit",
			fn: function() {
				$location.path("/edit/" + $scope.passageId);
			}
		},
		delete: {
			text: "Delete",
			fn: function() {
				$request.query({
					url: "./data/passage.json",
					data: {
						action: "deletePassage",
						data: {
							passageId: $scope.passageId
						}
					}
				}, function(data) {
					$scope.widget.dynamic.data = data.content
					$scope.title = data.title;
					$scope.time = data.createtime;
				}, function() {

				})
			}
		}
	}
	$request.query({
		url: "./data/passage.json",
		data: {
			action: "getPassage",
			data: {
				passageId: $scope.passageId
			}
		}
	}, function(data) {
		$scope.widget.dynamic.data = data.content
		$scope.title = data.title;
		$scope.time = data.createtime;
	}, function() {

	})
}])