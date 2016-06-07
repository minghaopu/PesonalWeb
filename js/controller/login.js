mpw.controller("login", ["$scope", "$user", function($scope, $user) {
	$scope.isLogin = true;

	$scope.widget = {
		switchBtn: {},
		loginForm: {},
		registerForm: {}
	};

	$scope.widget.switchBtn = {
		text: "Sign Up",
		fn: function() {
			if ($scope.isLogin) {
				$scope.isLogin = false;
				this.text = "Log In";
				$scope.widget.registerForm.username.data = "";
				$scope.widget.registerForm.password.data = "";
				$scope.widget.registerForm.confirm.data = "";
			} else {
				$scope.isLogin = true;
				this.text = "Sign Up";
				$scope.widget.loginForm.username.data = "";
				$scope.widget.loginForm.password.data = "";
			}
		}
	}

	$scope.widget.loginForm = {
		username: {
			placeholder: "Username",
			name: "username",
			data: ""
		},
		password: {
			placeholder: "Password",
			name: "password",
			type: "password",
			data: ""
		},
		loginBtn: {
			text: "Log In",
			fn: function() {
				$user.login($scope.widget.loginForm)
			}
		}
	}
	$scope.widget.registerForm = {
		username: {
			placeholder: "Username",
			name: "username",
			data: ""
		},
		password: {
			placeholder: "Password",
			name: "password",
			type: "password",
			data: ""
		},
		confirm: {
			placeholder: "Confirm Your Password",
			name: "confirm",
			type: "password",
			data: ""
		},
		registerBtn: {
			text: "Sign Up",
			fn: function() {
				$user.register($scope.widget.registerForm);
			}
		}
	}
}])