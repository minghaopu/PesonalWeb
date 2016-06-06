mpw.controller("profile", ["$scope", "$timeout", "$request", "$formatData", function($scope, $timeout, $request, $formatData) {
	$scope.isEditing = false;
	$scope.widget = {
		display: {},
		changePwdForm: {},
		updateForm: {}
	};

	var editFn = function() {
		var me = this;
		me.disabled = true;
		$scope.isEditing = true;
		$timeout(function() {
			me.disabled = false;
		}, 500)
	}

	var changePwd = function() {
		var me = this;
		this.disabled = true;
		$request.query({
			url: "./data/changePwd.json",
			method: "POST",
			data: $formatData($scope.widget.changePwdForm, "changePwd");
		}, function() {
			me.disabled = false;
			// success msg
		}, function() {
			me.disabled = false;
			// error msg
		})
	}

	var updateProfile = function() {
		var me = this;
		this.disabled = true;
		$request.query({
			url: "./data/updateProfile.json",
			method: "POST",
			data: $formatData($scope.widget.updateForm, "updateProfile")
		}, function() {
			me.disabled = false;
			// success msg
		}, function() {
			me.disabled = false;
			// failure msg
		})
	}

	$request.query({
		url: "./data/userProfile.json",
		async: false,
		method: "GET"
	}, function(data) {
		$scope.widget.display = {
			editBtn: {
				text: "Edit",
				disabled: false,
				fn: editFn
			},
			portrait: {
				label: "portrait",
				type: "img",
				text: "portrait",
				imgSrc: data.portrait,
				imgCls: "portrait"
			},
			nickname: {
				label: "Nickname",
				type: "text",
				text: data.nickname
			},
			email: {
				label: "Email",
				type: "text",
				text: data.email
			},
			bio: {
				label: "Bio",
				type: "text",
				text: data.bio
			},
			apps: {}
		}
		$scope.widget.changePwdForm = {
			
			oldPwd: {
				label: "Old Password",
				type: "password",
				name: "oldPwd",
				data: ""
			},
			newPwd: {
				label: "New Password",
				type: "password",
				name: "newPwd",
				data: ""
			},
			confirm: {
				label: "Confirm Password",
				type: "password",
				name: "confirm",
				data: ""
			},
			pwdSubBtn: {
				text: "Change Password",
				fn: changePwd
			}
		}
		$scope.widget.updateForm = {
			port: {
				name: "portrait",
				isImg: true,
				label: "Please choose a new photo",
				url: "./data/changePortrait.json"
			},
			nickname: {
				label: "Nickname",
				name: "nickname",
				data: data.nickname
			},
			bio: {
				label: "Bio",
				name: "bio",
				inputType: "textarea",
				data: data.bio
			},
			email: {
				label: "Email",
				name: "email",
				data: data.email
			},
			facebook: {
				label: "Facebook",
				name: "facebook",
				data: data.apps.facebook !== undefined?data.apps.facebook.href:""
			},
			twitter: {
				label: "Twitter",
				name: "twitter",
				data: data.apps.twitter !== undefined?data.apps.twitter.href:""
			},
			linkedin: {
				label: "LinkedIn",
				name: "linkedin",
				data: data.apps.linkedin !== undefined?data.apps.linkedin.href:""
			},
			github: {
				label: "Github",
				name: "github",
				data: data.apps.github !== undefined?data.apps.github.href:""
			},
			updateBtn: {
				text: "Update Profile",
				fn: updateProfile
			}
		}
		for (var prop in data.apps) {
			$scope.widget.display.apps[prop] = {
				label: data.apps[prop].name,
				text: data.apps[prop].href
			}
		}
	}, function() {
		// error message
	})

}])
	// mpw.controller("viewProfile", ["$scope", "$timeout", "$request", function($scope, $timeout, $request) {


// }])
// mpw.controller("editProfile", ["$scope", function($scope) {
// 	$scope.widget = {

// 	}
// }])