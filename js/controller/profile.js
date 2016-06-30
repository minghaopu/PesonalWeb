mpw.controller("profile", [
	"$scope",
	"$timeout",
	"$request",
	"$formatData",
	"$message",
	"$error",
	function($scope, $timeout, $request, $formatData, $message, $error) {
		$scope.isEditing = false;
		$scope.widget = {
			display: {},
			changePwdForm: {},
			updateForm: {},
			portUpdate: {
				name: "portrait",
				isImg: true,
				label: "Please choose a new photo",
				// url: "./data/changePortrait.json",
				url: "./php/image",
				src: ""
			},
			successFn: function(data) {
				$scope.widget.portUpdate.isEmpty = true;
			},
			failureFn: function(data) {
				$scope.widget.portUpdate.isEmpty = true;
				$message.show({
					title: "Error",
					text: $error(data.errorcode),
					button: [{
						text: "OK",
						fn: function() {
							$message.hide();
						}
					}]
				})
			}
		};
		var editFn = function() {
			var me = this;
			me.disabled = true;
			$scope.isEditing = true;
			$timeout(function() {
				me.disabled = false;
			}, 500)
		}

		var cancelFn = function() {
			var me = this;
			me.disabled = true;
			$scope.isEditing = false;
			$timeout(function() {
				me.disabled = false;
			}, 500)
		}

		var changePwd = function() {
			var me = this;
			me.disabled = true;
			$request.query({
				url: "./php/user",
				method: "POST",
				data: $formatData($scope.widget.changePwdForm, "updatePwd")
			}, function() {
				me.disabled = false;
				$scope.widget.changePwdForm.oldPwd.data = "";
				$scope.widget.changePwdForm.newPwd.data = "";
				$scope.widget.changePwdForm.confirm.data = "";
				$message.show({
					title: "Success",
					text: "Your password has been modified sucessfully!",
					button: [{
						text: "OK",
						fn: function() {
							$message.hide();
						}
					}]
				})
			}, function() {
				me.disabled = false;
			})
		}

		var updateProfile = function() {
			var me = this;
			me.disabled = true;
			$request.query({
				// url: "./data/updateProfile.json",
				url: "./php/user",
				method: "POST",
				data: $formatData($scope.widget.updateForm, "updateInfo")
			}, function(data) {
				$scope.$parent.$parent.nav.nickname = data.nickname;
				$scope.widget.display.nickname.text = data.nickname;
				$scope.widget.display.bio.text = data.bio;
				$scope.widget.display.email.text = data.email;
				$scope.widget.display.portrait.imgSrc = data.portrait;
				for (var prop in data.apps) {
					if (prop === "email") continue;
					$scope.widget.display.apps[prop] = {
						label: prop,
						text: data.apps[prop]
					}
				}
				$scope.$parent.apps.data = {}
				for (var prop in data.apps) {
					if (data.apps === "") continue;
					$scope.$parent.apps.data[prop] = {
						name: prop,
						href: (prop === "email" ? "mailto:" : "http://") + data.apps[prop],
						src: "./img/icon/" + prop + ".png"
					}
				}

				me.disabled = false;
				$scope.isEditing = false;
			}, function() {
				me.disabled = false;
			})
		}

		$request.query({
			url: "./php/user",
			async: false,
			method: "POST",
			data: {
				action: "getInfo",
				data: {}
			}
		}, function(data) {
			$scope.widget.display = {
				editBtn: {
					text: "Edit",
					isVisible: true,
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
					text: data.apps.email
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
					data: data.apps.email
				},
				facebook: {
					label: "Facebook",
					name: "facebook",
					data: data.apps.facebook || ""
				},
				twitter: {
					label: "Twitter",
					name: "twitter",
					data: data.apps.twitter || ""
				},
				linkedin: {
					label: "LinkedIn",
					name: "linkedin",
					data: data.apps.linkedin || ""
				},
				github: {
					label: "Github",
					name: "github",
					data: data.apps.github || ""
				},
				updateBtn: {
					text: "Update Profile",
					fn: updateProfile
				},
				cancelBtn: {
					text: "Cancel",
					fn: cancelFn
				}
			}
			$scope.widget.portUpdate.src = data.portrait
			for (var prop in data.apps) {
				if (prop === "email") continue;
				$scope.widget.display.apps[prop] = {
					label: prop,
					text: data.apps[prop]
				}
			}
		})

	}
])