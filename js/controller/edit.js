mpw.controller("edit", ["$scope", "$routeParams", "$request", "$formatData", "$location", function($scope, $routeParams, $request, $formatData, $location) {
	$scope.passageId = $routeParams.passageId;
	$scope.widget = {
		blogForm: {
			editor: {
				name: "content",
				text: {
					data: "",
					toolbar: [
						['h1', 'h2', 'h3', 'p', 'pre', 'quote'],
						['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
						['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
						['html', 'insertImage', 'insertLink'],
						['insertCode']
					]
				},
				code: {
					data: ""
				},
				data: ""
			},
			title: {
				label: "Title",
				name: "title",
				data: ""
			},
			submit: {
				text: "Submit",
				fn: function() {
					var me = this;
					me.disabled = true;
					$request.query({
						url: "./data/editBlog.json",
						method: "POST",
						data: $formatData($scope.widget.blogForm, $scope.passageId === "new" ? "createblog" : "editblog", {
							passageId: $scope.passageId
						})
					}, function() {
						me.disabled = false;
						// success msg
					}, function() {
						me.disabled = false;
						// failure msg
					}, function() {
						me.disabled = false;
					})
				}
			},
			cancel: {
				text: "Cancel",
				fn: function() {
					if ($scope.passageId === "new") {
						$location.path("/blog");
					} else {
						$location.path("/passage/" + $scope.passageId);
					}
				}
			}
		}
	}
	if ($scope.passageId !== "new") {
		$request.query({
			url: "./data/passage.json",
			method: "GET",
			data: {
				passageId: $scope.passageId
			}
		}, function(data) {
			$scope.widget.blogForm.editor.data = data.content;
			$scope.widget.blogForm.title.data = data.title;
		}, function() {

		})
	}
}])