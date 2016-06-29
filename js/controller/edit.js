mpw.controller("edit", [
	"$scope",
	"$routeParams",
	"$request",
	"$formatData",
	"$location",
	"$users",
	function($scope, $routeParams, $request, $formatData, $location, $users) {
		$scope.blogId = $routeParams.blogId;
		$scope.widget = {
			blogForm: {
				editor: {
					name: "content",
					isnew: $scope.blogId === "new" ? true : false,
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
							url: "./php/passage",
							method: "POST",
							data: $formatData($scope.widget.blogForm, $scope.blogId === "new" ? "create" : "update", {
								blogId: $scope.blogId
							})
						}, function(data) {
							me.disabled = false;
							if ($scope.blogId === "new") {
								$location.path("/" + $users.getName() + "/passage/" + data.blogId);
							} else {
								$location.path("/" + $users.getName() + "/passage/" + $scope.blogId);
							}
						})
					}
				},
				cancel: {
					text: "Cancel",
					fn: function() {
						if ($scope.blogId === "new") {
							$location.path("/" + $users.getName() + "/blog");
						} else {
							$location.path("/" + $users.getName() + "/passage/" + $scope.blogId);
						}
					}
				}
			}
		}
		if ($scope.blogId !== "new") {
			$request.query({
				url: "./php/passage",
				data: {
					action: "get",
					data: {
						blogId: $routeParams.blogId
					}
				}
			}, function(data) {
				$scope.widget.blogForm.editor.data = data.content;
				$scope.widget.blogForm.title.data = data.title;
			})
		}
	}
])