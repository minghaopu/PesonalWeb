mpw.controller("profile", ["$scope", "$timeout", function($scope, $timeout) {
	$scope.isEditing = false;
	// $timeout(function() {
	// 	$scope.isEditing = true;
	// }, 3000)
}])
mpw.controller("viewProfile", ["$scope", "$timeout", "$request", function($scope, $timeout, $request) {
	var editFn = function() {
		var me = this;
		me.disabled = true;
		$scope.$parent.$parent.isEditing = true;
		$timeout(function() {
			me.disabled = false;
		}, 500)
	}
	$request.query({
		url: "./data/userProfile.json",
		async: false,
		method: "GET"
	}, function(data) {
		$scope.widget = {
			edit: {
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
			bio: {
				label: "Bio",
				type: "text",
				text: data.bio
			},
			apps: []
		}
		for (var i = 0; i < data.apps.length; i++) {
			$scope.apps[i] = {
				label: data.name,
				type: "text",
				text: data.apps[i].href
			}
		}
	}, function() {
		// error message
	})


}])
mpw.controller("editProfile", ["$scope", function($scope) {

}])