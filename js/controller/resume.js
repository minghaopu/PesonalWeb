mpw.controller("resume", ["$scope", "$request", "$window", "$route", function($scope, $request, $window, $route) {
	$scope.hasResume = false;
	$scope.widget = {
		resume: {
			url: ""
		},
		upload: {
			isImg: false,
			label: "You haven't upload any resume",
			url: "./data/uploadResume.json",
			successFn: function(data) {
				$scope.hasResume = true;
				$scope.widget.resume.isEmpty = false;
				$scope.widget.resume.url = data.url + "#view=fit";
				$scope.widget.openBtn.isVisible = true;
				$scope.widget.upload.label = "";
				$scope.widget.upload.chooseBtn.text = "Choose a new one";
			},
			failureFn: function(data) {
				$scope.hasResume = false;
				$scope.widget.upload.label = "You haven't upload any resume";
				$scope.widget.openBtn.isVisible = false;
				$scope.widget.resume.isEmpty = true;
				$scope.widget.resume.url = "";
				$scope.widget.upload.chooseBtn.text = "Choose"
			}
		},
		openBtn: {
			text: "Open in new tab",
			isVisible: false,
			fn: function() {
				$window.open($scope.widget.resume.url, '_blank', 'toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes')
			}
		}
	}
	$scope.$watch(function() {
		return $scope.widget.upload
	})
	$request.query({
		url: "./data/resume.json"
	}, function(data) {
		$scope.hasResume = true;
		$scope.widget.resume.isEmpty = false;
		$scope.widget.resume.url = data.url + "#view=fit";
		$scope.widget.openBtn.isVisible = true;
		$scope.widget.upload.label = "";
		$scope.widget.upload.chooseBtn.text = "Choose a new one";
	}, function() {
		$scope.hasResume = false;
		$scope.widget.upload.label = "You haven't upload any resume";
		$scope.widget.openBtn.isVisible = false;
		$scope.widget.resume.isEmpty = true;
		$scope.widget.resume.url = "";
		$scope.widget.upload.chooseBtn.text = "Choose"
	})
}])