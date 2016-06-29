mpw.controller("passage", [
	"$scope",
	"$routeParams",
	"$request",
	"$location",
	"$message",
	"$users",
	function($scope, $routeParams, $request, $location, $message, $users) {
		var deleteBlog = function() {
			var me = this;
			me.disabled = true;
			$message.show({
				title: "Delete",
				text: "Are your sure you want to delete this blog? Please notice that the action can not be withdrawed.",
				button: [{
					text: "Yes",
					fn: function() {

						$request.query({
							// url: "./blog/passage.json",
							url: "./php/passage",
							data: {
								action: "delete",
								data: {
									blogId: $routeParams.blogId
								}
							}
						}, function(data) {
							$location.path("/" + $routeParams.nickname + "/blog");
						})
						$message.hide();
						me.disabled = false;
					}
				}, {
					text: "No",
					fn: function() {
						$message.hide();
						me.disabled = false;
					}
				}]
			})
		}
		$scope.isUser = $routeParams.nickname === $users.getName();
		$scope.widget = {
			dynamic: {
				data: ""
			},
			edit: {
				text: "Edit",
				fn: function() {
					$location.path("/edit/" + $routeParams.blogId);
				}
			},
			delete: {
				text: "Delete",
				fn: deleteBlog
			},
			back: {
				text: "Back",
				fn: function() {
					$location.path("/" + $routeParams.nickname + "/blog");
				}
			},
			author: {
				type: "text",
				text: ""
			},
			bio: {
				type: "text",
				text: ""
			},
			portrait: {
				type: "img",
				text: "portrait",
				imgSrc: "",
				imgCls: "portrait"
			}
		}
		$request.query({
			// url: "./data/passage.json",
			url: "./php/passage",
			data: {
				action: "get",
				data: {
					blogId: $routeParams.blogId
				}
			}
		}, function(data) {
			$scope.widget.dynamic.data = data.content;
			$scope.title = data.title;
			$scope.time = data.createtime;
			if (!$scope.isUser) {
				$scope.widget.author.text = data.nickname;
				$scope.widget.bio.text = data.bio;
				$scope.widget.portrait.imgSrc = data.portrait;
			}

		})
	}
])