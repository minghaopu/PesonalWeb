mpw.controller("intro", ["$scope", "$module", "$user", function($scope, $module, $user){
	$scope.someText = "intro";
	$scope.widget = {
		file: {
				placeholder: "file",
				readOnly: false,
				disabled: false,
				isValid: true,
				isImg: false
			}
	}
}])