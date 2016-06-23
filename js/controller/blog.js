mpw.controller("blog", ["$scope", "$user", "$request", "$location", function($scope, $user, $request, $location) {
	$scope.someText = "blog";
	$scope.widget = {};
	$scope.widget.blog = {
		emptyText: "NO",
		data: []
	}
	$request.query({
		url: "./data/blog.json",
		data: {
			action: "getBlogIndex"
		}
	}, function(data) {
		$scope.widget.blog.data = data;
	}, function() {
		$scope.widget.blog.data.length = 0;
	})
	$scope.widget.createBtn = {
		text: "Write a new blog",
		fn: function() {
			$location.path("/edit/new");
		}
	}
}])