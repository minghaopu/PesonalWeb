mpw.controller("resume", [
	"$scope",
	"$request",
	"$window",
	"$users",
	"$message",
	"$routeParams",
	function($scope, $request, $window, $users, $message, $routeParams) {
		$scope.hasResume = false;
		$scope.isUser = $routeParams.nickname === $users.getName();

		var deleteFunction = function() {
			var me = this;
			me.disabled = true;
			$message.show({
				title: "Delete",
				text: "Are your sure you want to delete this resume? Please notice that the action can not be withdrawed.",
				button: [{
					text: "Yes",
					fn: function() {

						$request.query({
							// url: "./data/passage.json",
							url: "./php/user",
							data: {
								action: "deleteResume",
								data: {}
							}
						}, function(data) {
							$scope.hasResume = false;
							$scope.widget.upload.isEmpty = true;
							$scope.widget.resume.label = ($scope.isUser ? "You" : $routeParams.nickname) + " haven't upload any resume";
							$scope.widget.openBtn.isVisible = false;
							$scope.widget.resume.isEmpty = true;
							$scope.widget.resume.url = "";
							$scope.widget.upload.chooseBtn.text = "Choose";
							me.isVisible = false;
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
		$scope.widget = {
			resume: {
				url: "",
				label: ($scope.isUser ? "You" : $routeParams.nickname) + " haven't upload any resume"
			},
			upload: {
				isImg: false,
				// url: "./data/uploadResume.json",
				url: "./php/resume",
				successFn: function(data) {
					$scope.hasResume = true;
					$scope.widget.upload.isEmpty = true;
					$scope.widget.resume.isEmpty = false;
					$scope.widget.resume.url = data.resume + "#view=fit";
					$scope.widget.openBtn.isVisible = true;
					$scope.widget.resume.label = "";
					$scope.widget.upload.chooseBtn.text = "Choose a new one";
					$scope.widget.deleteBtn.isVisible = true;
				},
				failureFn: function(data) {
					$scope.hasResume = false;
					$scope.widget.resume.label = ($scope.isUser ? "You" : $routeParams.nickname) + " haven't upload any resume";
					$scope.widget.openBtn.isVisible = false;
					$scope.widget.resume.isEmpty = true;
					$scope.widget.resume.url = "";
					$scope.widget.upload.chooseBtn.text = "Choose";
					$scope.widget.deleteBtn.isVisible = false;
				}
			},
			openBtn: {
				text: "Open in new tab",
				isVisible: false,
				fn: function() {
					$window.open($scope.widget.resume.url, '_blank', 'toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes')
				}
			},
			deleteBtn: {
				text: "Delete",
				isVisible: false,
				fn: deleteFunction
			}
		}
		$scope.$watch(function() {
			return $scope.widget.upload
		})
		$request.query({
			// url: "./data/resume.json"
			url: "./php/user",
			data: {
				action: "getResume",
				data: {
					nickname: $routeParams.nickname
				}
			}
		}, function(data) {
			if (data.resume) {
				$scope.hasResume = true;
				$scope.widget.resume.isEmpty = false;
				$scope.widget.resume.url = data.resume + "#view=fit";
				$scope.widget.openBtn.isVisible = true;
				$scope.widget.resume.label = "";
				$scope.widget.upload.chooseBtn.text = "Choose a new one";
				$scope.widget.deleteBtn.isVisible = true;
			}

		}, function() {
			$scope.hasResume = false;
			$scope.widget.resume.label = ($scope.isUser ? "You" : $routeParams.nickname) + " haven't upload any resume";
			$scope.widget.openBtn.isVisible = false;
			$scope.widget.resume.isEmpty = true;
			$scope.widget.resume.url = "";
			$scope.widget.upload.chooseBtn.text = "Choose";
			$scope.widget.deleteBtn.isVisible = false;
		})
	}
])