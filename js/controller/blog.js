mpw.controller("blog", ["$scope", "$user", "$request", function($scope, $user, $request) {
	$scope.someText = "blog";
	$scope.widget = {};
	$scope.widget.blog = {
		emptyText: "NO",
		data: []
	}
	$request.query({
		url: "./data/blog.json",
		data: {
			uid: $user.getId(),
			action: "getBlog"
		}
	}, function(data) {
		$scope.widget.blog.data = data;
	}, function() {
		$scope.widget.blog.data.length = 0;
	})
}])