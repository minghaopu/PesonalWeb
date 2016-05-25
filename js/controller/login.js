mpw.controller("login", ["$scope", "$user", function($scope, $user) {
	$scope.someText = "login";
	$scope.widgetConfig = {};
	$scope.widgetConfig.username = {
		label: "Login:",
		readOnly: false,
		data: "123",
		disabled: false,
		placeholder: "Please enter your username",
		type: "text",
		trim: true,
		name: "username",
		error: "Please enter corret username",
		isValid: true,
		maxLength: 20
	};
	$scope.widgetConfig.password = {
		label: "Password:",
		name: "password",
		readOnly: false,
		placeholder: "Please enter your password",
		type: "password",
		trim: true,
		data: "",
		error: "Please enter corret password",
		isValid: true,
		minLength: 2,
		maxLength: 20
	}
	$scope.widgetConfig.button = {
		text: "submit",
		disabled: false,
		fn: function() {
			$user.login({
				username: $scope.widgetConfig.username.data,
				password: $scope.widgetConfig.password.data,
				action: "login"
			})
		}
	}
}])