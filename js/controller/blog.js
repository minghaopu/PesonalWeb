mpw.controller("blog", ["$scope", "$users", "$request", "$location", "$routeParams", function($scope, $users, $request, $location, $routeParams) {
	var requestData = {
		action: "getIndex",
		data: {}
	};
	$scope.widget = {
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
		},
		apps: {
			data: {}
		},
		resumeBtn: {
			text: "Check " + $routeParams.nickname + "'s Resume",
			fn: function() {
				$location.path("/" + $routeParams.nickname + "/resume");
			}
		}
	};
	if ($routeParams.nickname === $users.getName()) {
		$scope.isUser = true;
		requestData.data.isUser = true;
		requestData.data.nickname = $users.getName()
	} else {
		$scope.isUser = false;
		requestData.data.isUser = false;
		requestData.data.nickname = $routeParams.nickname;
	}


	$scope.widget.blog = {
		emptyText: $routeParams.nickname === $users.getName() ? "You haven't write any blog yet!" : $routeParams.nickname + " haven't write any blog yet!",
		data: [],
		user: $routeParams.nickname
	}
	$request.query({
		// url: "./data/blog.json",
		url: "./php/passage",
		// url: "./php/user",
		// method:
		data: requestData
	}, function(data) {

		if (data.isFound === false) {
			$location.path("/" + $users.getName() + "/blog");
		} else {
			$scope.widget.blog.data = data.list;
			if (!$scope.isUser) {
				$scope.widget.author.text = data.nickname;
				$scope.widget.bio.text = data.bio;
				$scope.widget.portrait.imgSrc = data.portrait;
				var apps = data.apps;
				for (var prop in apps) {
					$scope.widget.apps.data[prop] = {
						name: prop,
						href: (prop === "email" ? "mailto:" : "") + apps[prop],
						src: "./img/icon/" + prop + ".png"
					}
				}
			}

		}

	}, function() {

	})
	$scope.widget.createBtn = {
		text: "Write a new blog",
		fn: function() {
			$location.path("/edit/new");
		}
	}
}])