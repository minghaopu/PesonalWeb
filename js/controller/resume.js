mpw.controller("resume", ["$scope", function($scope){
	$scope.someText = "resume";
	$scope.widget = {
		pdf: {
			isEmpty: false,
			url: "./pdf/resume.pdf#view=fit"
		}
	}
}])