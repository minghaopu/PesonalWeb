mpw.directive("navigator", ["$location", "$users", "$timeout", "$request", function($location, $users, $timeout, $request) {
	var innerHTML = 	"<div class=\"widget-nav-container\">";
		innerHTML += 		"<div class=\"widget-nav-content\">";
		innerHTML += 			"<ul class=\"widget-nav-ul\">";
		innerHTML += 				"<li ng-repeat=\"nav in config.navs\" class=\"widget-nav-li {{nav.name}}\" ng-click=\"goto(nav.url)\">";
		innerHTML += 					"<a href=\"javascript:void(0)\" class=\"widget-nav-link\">";
		innerHTML += 					"{{nav.name}}";
		innerHTML += 					"</a>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";

		innerHTML += 		"<div class=\"widget-search-container\">";
		innerHTML +=			"<div class=\"widget-user-content\">";
		innerHTML +=				"<input type=\"text\" class=\"widget-search-input\" ng-model=\"searchData\" />";
		innerHTML +=				"<button class=\"widget-search-button\" ng-click=\"seachUser();\"><i class=\"widget-search-icon\"></></button>";
		innerHTML +=			"</div>";
		innerHTML += 		"</div>";

		innerHTML += 		"<div class=\"widget-user-container\" ng-mouseover=\"mouseover()\" ng-mouseleave=\"mouseleave()\">";
		innerHTML += 			"<div class=\"widget-user-content\">";
		innerHTML += 				"<span class=\"widget-user-text\">{{config.nickname}}</span>";
		innerHTML += 			"</div>";
		innerHTML += 			"<div class=\"widget-drop-content\" ng-show=\"isDropped\" ng-mouseover=\"mouseover()\" ng-mouseleave=\"mouseleave()\">";
		innerHTML += 				"<ul class=\"widget-drop-ul\">";
		innerHTML += 					"<li class=\"widget-drop-li\" ng-click=\"gotoProfile()\">";
		innerHTML += 						"<a href=\"javascript:void(0)\" class=\"widget-drop-link\">Profile</a>";
		innerHTML += 					"</li>";
		innerHTML += 					"<li class=\"widget-drop-li\" ng-click=\"logout()\">";
		innerHTML += 						"<a href=\"javascript:void(0)\" class=\"widget-drop-link\">Logout</a>";
		innerHTML += 					"</li>";
		innerHTML += 				"</ul>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			return function(scope, ele, attr) {
				// var navs = $module.getRoutes();
				var timer;
				var search = document.getElementsByClassName("widget-search-input")[0];
				var searchButton = document.getElementsByClassName("widget-search-button")[0];

				scope.searchData = "";

				scope.seachUser = function() {
					searchButton.blur();
					if (scope.searchData !== "") {
						$request.query({
							url: "./php/user",
							method: "POST",
							data: {
								action: "search",
								data: {
									nickname: scope.searchData
								}
							}
						}, function(data) {
							scope.searchData = "";
							$location.path("/" + data.nickname + "/blog");
						})
					}
				}

				scope.isDropped = false;
				// scope.navs = [navs.intro, navs.blog, navs.resume];
				// scope.navs = [navs.blog, navs.resume];



				scope.goto = function(url) {
					$location.path(url);
				}

				scope.mouseover = function() {
					$timeout.cancel(timer);
					scope.isDropped = true;
				}
				scope.mouseleave = function() {
					timer = $timeout(function() {
						scope.isDropped = false;
					}, 500)
				}
				scope.logout = function() {
					$request.query({
						url: "./php/user",
						data: {
							data: {
								uid: $users.getId()
							},
							action: "logout"
						}
					}, function() {
						$users.setStatus(false);
						$users.setId(null);
						$users.setName(null);
					})
				}
				scope.gotoProfile = function() {
					$location.path("/" + $users.getName() +"/profile");
				}
				angular.element(search).on("keypress", function(event) {
					if (event.keyCode === 13) {
						scope.seachUser();
					}
				})
			}
		}

	}
}]);

mpw.directive("message", ["$message", function($message) {
	// var innerHTML = 	"<div class=\"widget-msg-wrapper\" ng-show=\"isVisible\">";
	var innerHTML = 	"<div class=\"widget-msg-container\" ng-show=\"isVisible\">";
		// innerHTML += 		"<div class=\"widget-msg-container\">";
		innerHTML += 			"<div class=\"widget-msg-title\">";
		innerHTML += 				"<div class=\"widget-msg-icon-container\">";
		innerHTML += 					"<img ng-src=\"{{msg.titleIcon}}\" class=\"widget-msg-icon\" alt=\"\">";
		innerHTML += 				"</div>";
		innerHTML += 				"<div class=\"widget-msg-title-text\"><span>{{msg.title}}</span></div>";
		innerHTML += 			"</div>";
		innerHTML += 			"<div class=\"widget-msg-content-container\">";
		innerHTML += 				"<div class=\"widget-msg-content\">{{msg.text}}</div>";
		innerHTML += 			"</div>";
		innerHTML += 			"<div class=\"widget-msg-btn-container\" ng-show=\"msg.hasBtn\">";
		innerHTML += 				"<div button ng-repeat=\"btn in msg.button\" config=btn></div>";
		innerHTML += 			"</div>";
		// innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: false,
		template: innerHTML,
		scope: true,
		compile: function(ele, attr, trans) {
			return function(scope, ele, attr) {
				scope.msg = {};
				scope.isVisible = false;
				scope.$watch(function() {
					return $message.getStatus();
				}, function(newVal, oldVal) {
					scope.isVisible = newVal;
					if (newVal) scope.msg = $message.getConfig();
					else scope.msg = {};
				})
			}
		}
	}
}]);

mpw.directive("appLink", function() {
	var innerHTML = 	"<div class=\"widget-apps-container\">";
		innerHTML += 		"<div class=\"widget-apps-content\">";
		innerHTML += 			"<ul class=\"widget-apps-ul\">";
		innerHTML += 				"<li ng-repeat=\"app in config.data\" class=\"widget-apps-li {{app.name}}\">";
		innerHTML += 					"<a href=\"{{app.href}}\" class=\"widget-app-link\">";
		innerHTML += 						"<img ng-src=\"{{app.src}}\" alt=\"{{app.name}}\" class=\"widget-app-img\">";
		innerHTML += 					"</a>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		}
	}
});

mpw.directive("textBox", function() {
		var innerHTML = 	"<div class=\"widget-text-wrapper {{config.cls}}\">";
			innerHTML += 		"<div class=\"widget-icon-container {{config.iconCls}}\">";
			innerHTML += 			"<div class=\"widget-icon-content\"></div>";
			innerHTML += 		"</div>";
			innerHTML += 		"<div class=\"widget-label-container {{config.labelCls}}\">";
			innerHTML += 			"<div class=\"widget-label-content\">";
			innerHTML += 				"<span class=\"widget-label-text\">{{config.label}}</span>";
			innerHTML += 			"</div>";
			innerHTML += 		"</div>";
			innerHTML += 		"<div class=\"widget-text-content {{config.inputCls}}\" ng-switch on=\"config.inputType\">";
			innerHTML += 			"<input ng-switch-when=\"input\" type=\"{{config.type}}\"";
			innerHTML += 				" name=\"{{config.name}}\"";
			innerHTML += 				" class=\"widget-text-input\"";
			innerHTML += 				" ng-readonly=\"config.readOnly\"";
			innerHTML += 				" maxlength=\"{{config.maxLength}}\"";
			innerHTML += 				" minlength=\"{{config.minLength}}\"";
			innerHTML += 				" placeholder=\"{{config.placeholder}}\"";
			innerHTML += 				" ng-disabled=\"config.disabled\"";
			innerHTML += 				" ng-trim=\"config.trim\"";
			innerHTML += 				" ng-model=\"config.data\">";
			innerHTML += 			"<textarea ng-switch-when=\"textarea\"";
			innerHTML += 				" name=\"{{config.name}}\"";
			innerHTML += 				" class=\"widget-text-input\"";
			innerHTML += 				" maxlength=\"{{config.maxLength}}\"";
			innerHTML += 				" placeholder=\"{{config.placeholder}}\"";
			innerHTML += 				" ng-readonly=\"config.readOnly\"";
			innerHTML += 				" ng-disabled=\"config.disabled\"";
			innerHTML += 				" ng-trim=\"config.trim\"";
			innerHTML += 				" ng-model=\"config.data\"></textarea>";
			innerHTML += 		"</div>";
			innerHTML += 		"<div class=\"widget-error-container  {{config.errorCls}}\">";
			innerHTML += 			"<div ng-hide=\"config.isValid\" class=\"widget-error-content\">";
			innerHTML += 				"<span class=\"widget-error-text\">{{config.error}}</span>";
			innerHTML += 			"</div>";
			innerHTML += 		"</div>";
			innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				readOnly: false,
				disabled: false,
				type: "text",
				trim: true,
				isValid: true,
				inputType: "input"
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
			}
		}
	}
})

mpw.directive("button", function() {
	var innerHTML = 	"<div class=\"widget-button-container {{config.cls}}\" ng-class=\"config.disabled?'widget-button-disalbed':''\" ng-click=\"config.fn()\" ng-show=\"config.isVisible\">";
		// innerHTML += 		"<div class=\"widget-icon-container\">";
		// innerHTML += 			"<div class=\"widget-icon-content {{config.iconCls}}\"></div>";
		// innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-button-content\">";
		innerHTML += 			"<button class=\"widget-button-btn {{config.btnCls}}\" ng-disabled=\"config.disabled\">{{config.text}}</button>";
		innerHTML +=		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				text: "button",
				disabled: false,
				isVisible: true,
				fn: function() {}
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
				var button = ele.find("button")[0];
				ele.on("mousedown", function(event) {
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();
					button.focus();
					ele.addClass("focus");
				})
				ele.on("mouseup", function(event) {
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();
					ele.removeClass("focus");
				})
			}
		}
	}
})

mpw.directive("list", ["$location", function($location) {
	var innerHTML = 	"<div class=\"widget-list-container\">";
		innerHTML += 		"<div class=\"widget-list-content\" ng-hide=\"config.data.length > 0 ? false : true\">";
		innerHTML += 			"<ul class=\"widget-list-ul\">";
		innerHTML += 				"<li ng-repeat=\"row in config.data\" class=\"widget-list-row row-{{$index}}\">";
		innerHTML += 					"<div class=\"widget-row-title row-column\" ng-click=\"viewPassage(row)\">";
		innerHTML += 						"<a href=\"javascript:void(0)\" class=\"widget-row-link\">{{row.title}}</a>"
		innerHTML += 					"</div>";
		innerHTML += 					"<div class=\"widget-row-time row-column\">{{row.lastmodifytime}}</div>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-list-empty-content\" ng-show=\"config.data.length > 0 ? false : true\">";
		innerHTML += 			"<span class=\"widget-list-empty-text\">{{config.emptyText}}</span>";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				emptyText: "You haven't write any blog yet!",
				data: [],
				user: ""
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
				scope.isEmpty = scope.config.data.length > 0 ? false : true;
				scope.viewPassage = function(row) {
					$location.path("/" + scope.config.user + "/passage/" + row.blogId);
				}
			}
		}
	}
}])

mpw.directive("pdf", function() {
	var innerHTML = 	"<div class=\"widget-pdf-container\">";
		innerHTML += 		"<div class=\"widget-label-container {{config.labelCls}}\"  ng-hide=\"config.isImg\">";
		innerHTML += 			"<div class=\"widget-label-content\">";
		innerHTML += 				"<span class=\"widget-label-file\">{{config.label}}</span>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-pdf-content\" ng-hide=\"config.isEmpty\">";
		innerHTML += 			"<iframe ng-src=\"{{config.url}}\" type=\"application/pdf\" ></iframe>";
		innerHTML += 		"</div>";
		// innerHTML +=		"<div class=\"widget-pdf-empty-content\" ng-switch-when=\"true\">";
		// innerHTML +=			"<span class=\"widget-pdf-empty-text\">{{config.emptyMsg}}</span>";
		// innerHTML +=		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		scope: {
			config: "="
		},
		template: innerHTML,
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				isEmpty: true,
				url: ""
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
			}
		}
	}
})

mpw.directive("file", ["$request", function($request) {
	var innerHTML = 	"<div class=\"widget-file-wrapper {{config.cls}}\" ng-switch on=\"config.isImg\">";
		innerHTML += 		"<div class=\"widget-icon-container {{config.iconCls}}\">";
		innerHTML += 			"<div class=\"widget-icon-content\"></div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-label-container {{config.labelCls}}\"  ng-hide=\"config.isImg\">";
		innerHTML += 			"<div class=\"widget-label-content\">";
		innerHTML += 				"<span class=\"widget-label-file\">{{config.label}}</span>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-file-content {{config.inputCls}}\">";
		innerHTML += 			"<input type=\"file\"";
		innerHTML += 				" name=\"{{config.name}}\"";
		innerHTML += 				" class=\"widget-file-input\"";
		innerHTML += 				" ng-disabled=\"config.disabled\"";
		innerHTML += 				" ng-model=\"data\">";
		innerHTML +=			"<input type=\"text\" ng-model=\"data.name\" ng-hide=\"config.isEmpty\" readonly=\"true\ >";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-error-container  {{config.errorCls}}\">";
		innerHTML += 			"<div ng-hide=\"config.isValid\" class=\"widget-error-content\">";
		innerHTML += 				"<span class=\"widget-error-file\">{{config.error}}</span>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div button config=\"config.chooseBtn\" ng-switch-when=\"false\"></div>"
		innerHTML += 		"<div class=\"widget-preview-container\" ng-switch-when=\"true\">";
		innerHTML += 			"<div class=\"widget-preview-content\">";
		innerHTML += 				"<img ng-src=\"{{config.src}}\" alt=\"\" ng-mouseover=\"showMask()\" ng-mouseleave=\"hideMask()\"/>";
		innerHTML += 			"</div>";
		innerHTML += 			"<div class=\"widget-preview-mask\" ng-show=\"maskVisible\" ng-mouseover=\"showMask()\" ng-mouseleave=\"hideMask()\"  ng-click=\"chooseFile()\">";
		innerHTML += 				"<span>{{config.label}}</span>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div button config=\"config.uploadBtn\"></div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		template: innerHTML,
		replace: true,
		scope: {
			config: "="
		},
		controller: ["$scope", "$element", "$request", "$message", function($scope, $element, $request, $message) {
				$scope.showMask = function() {
					$scope.maskVisible = true;
				}
				$scope.hideMask = function() {
					$scope.maskVisible = false;
				}
				$scope.chooseFile = function() {
					$element.find("input")[0].click();
				}
				var defaultConfig = {
					// placeholder: "file",
					disabled: false,
					isValid: true,
					isImg: false,
					isEmpty: true,
					url: "./data/upload.json",
					maxSize: 5,
					chooseBtn: {
						text: "Choose",
						fn: $scope.chooseFile
					},
					uploadBtn: {
						text: "Upload",
						fn: function() {
							var me = this;
							me.disabled = true;
							if ($scope.config.isEmpty) {
								$message.show({
									title: "Error",
									text: "Please choose a file!!",
									button: [{
										text: "OK",
										fn: function() {
											$message.hide();
											me.disabled = false;
										}
									}]
								})
							} else if ($scope.data.size/1048576 > $scope.config.maxSize) {
								$message.show({
									title: "Error",
									text: "The file you are trying to upload are more than " + $scope.config.maxSize + "MB. Please choose another one.",
									button: [{
										text: "OK",
										fn: function() {
											$message.hide();
											me.disabled = false;
										}
									}]
								})
							}else{
								var data = new FormData();
								data.append("file", $scope.data);
								$request.query({
									url: $scope.config.url,
									data: data,
									withCredentials: true,
									headers: {
										"Content-Type": undefined
									},
									transformRequest: angular.identity
								},
								function(data) {
									me.disabled = false;
									$scope.config.successFn(data);
								},
								function(data) {
									me.disabled = false;
									$scope.config.failureFn(data);
								})
							}

						}
					},
					successFn: function() {},
					failureFn: function() {}
				}
				$scope.config = angular.extend({}, defaultConfig, $scope.config);
				$scope.maskVisible = false;

				var input = $element.find("input");
				input.bind("change", function(event) {
					var file = ((event.srcElement || event.target).files[0]);
					$scope.data = event.target.files[0];
					if ($scope.data) {
						if ($scope.data.name.match(/\.(jpg|jpeg|png|gif)$/)) {
							$scope.config.isImg = true;
						} else {
							$scope.config.isImg = false;
						}
						var reader = new FileReader();
						reader.onload = function(loadEvent) {
							$scope.$apply(function() {
								$scope.config.src = loadEvent.target.result;
							})
						}
						reader.readAsDataURL($scope.data);
					}
				});
				$scope.$watch(function() {
					return $scope.data
				}, function(newVal) {
						if (newVal && newVal.name !== "") {
							$scope.config.isEmpty = false;
						}else{
							$scope.config.isEmpty = true;
						}
					
				})

			}]
			// ,
			// link: function(scope, ele, attr) {
			// 	var defaultConfig = {
			// 		placeholder: "file",
			// 		disabled: false,
			// 		isValid: true,
			// 		isImg: false,
			// 		btn: {
			// 			text: "Upload",
			// 			fn: ["$request", function($request) {
			// 				var data = new FormData();
			// 				data.append("file", scope.data);
			// 				$request.query({
			// 					url: "./data/upload.json",
			// 					data: data,
			// 					withCredentials: true,
			// 					headers: {"Content-Type": undefined },
			// 					transformRequest: angular.identity
			// 				})
			// 				console.log("a")
			// 			}]
			// 		}
			// 	}
			// 	scope.config = angular.extend({}, defaultConfig, scope.config);

		// 	var input = ele.find("input");
		// 	input.bind("change", function(event) {
		// 		var file = ((event.srcElement || event.target).files[0]);
		// 		scope.data = event.target.files[0];
		// 		if (scope.data) {
		// 			if (scope.data.name.match(/\.(jpg|jpeg|png|gif)$/)) {
		// 				scope.config.isImg = true;
		// 			} else {
		// 				scope.config.isImg = false;
		// 			}
		// 			var reader = new FileReader();
		// 			reader.onload = function(loadEvent) {
		// 				scope.$apply(function() {
		// 					scope.filesrc = loadEvent.target.result;
		// 				})
		// 			}
		// 			reader.readAsDataURL(scope.data);
		// 		}
		// 	});

		// }
	}
}])

mpw.directive("display", function() {
	var innerHTML = 	"<div class=\"widget-display-wrapper {{config.cls}}\" ng-switch on=\"config.type\"  ng-show=\"config.text\">";
		innerHTML += 		"<div class=\"widget-icon-container {{config.iconCls}}\">";
		innerHTML += 			"<div class=\"widget-icon-content\"></div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div ng-switch-when=\"text\" class=\"widget-label-container {{config.labelCls}}\">";
		innerHTML += 			"<div class=\"widget-label-content\">";
		innerHTML += 				"<span class=\"widget-label-display\">{{config.label}}</span>";
		innerHTML += 				"<span class=\"widget-label-display\" ng-show=\"config.label\">:</span>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div ng-switch-when=\"text\" class=\"widget-display-text-content\">";
		innerHTML += 			"<span class=\"widget-display-text\">{{config.text}}</span>"
		innerHTML += 		"</div>";
		innerHTML += 		"<div ng-switch-when=\"img\" class=\"widget-display-img-content\">";
		innerHTML += 			"<img class=\"{{config.imgCls}}\" ng-src=\"{{config.imgSrc}}\" alt=\"{{config.text}}\" />";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		template: innerHTML,
		replace: true,
		scope: {
			config: "="
		},
		compile: function(ele, attrs, trans) {
			var defaultConfig = {
				type: "text"
			}
			return function(scope, ele, attrs) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
			}
		}
	}
})

mpw.directive("dynamic", ["$compile", function($compile) {
	var innerHTML = "<div class=\"widget-dynamic-container {{config.cls}}\">";
		innerHTML += 	"<div class=\"widget-dynamic-content\">";
		innerHTML += 	"</div>";
		innerHTML += "</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		link: function(scope, ele, attrs) {
			var isKeyword = function(word) {
				var keycls = "<span class=\"code-word-key\">";
				switch (word.toLowerCase()) {
					case "if":
						return keycls + word + "</span>";
					case "else":
						return keycls + word + "</span>";
					case "for":
						return keycls + word + "</span>";
					case "do":
						return keycls + word + "</span>";
					case "while":
						return keycls + word + "</span>";
					case "class":
						return keycls + word + "</span>";
					case "int":
						return keycls + word + "</span>";
					case "float":
						return keycls + word + "</span>";
					case "object":
						return keycls + word + "</span>";
					case "string":
						return keycls + word + "</span>";
					case "boolean":
						return keycls + word + "</span>";
					case "unsigned":
						return keycls + word + "</span>";
					case "new":
						return keycls + word + "</span>";
					case "delete":
						return keycls + word + "</span>";
					case "public":
						return keycls + word + "</span>";
					case "private":
						return keycls + word + "</span>";
					case "protected":
						return keycls + word + "</span>";
					case "var":
						return keycls + word + "</span>";
						// case "array":
						// 	return keycls + word + "</span>";
					case "bool":
						return keycls + word + "</span>";
					case "const":
						return keycls + word + "</span>";
					case "true":
						return keycls + word + "</span>";
					case "false":
						return keycls + word + "</span>";
					case "case":
						return keycls + word + "</span>";
					case "switch":
						return keycls + word + "</span>";
					case "return":
						return keycls + word + "</span>";
					case "break":
						return keycls + word + "</span>";
					case "static":
						return keycls + word + "</span>";
					case "void":
						return keycls + word + "</span>";
					case "try":
						return keycls + word + "</span>";
					case "struct":
						return keycls + word + "</span>";
					case "try":
						return keycls + word + "</span>";
					case "throw":
						return keycls + word + "</span>";
					case "null":
						return keycls + word + "</span>";
					case "undefined":
						return keycls + word + "</span>";
					case "catch":
						return keycls + word + "</span>";
					case "char":
						return keycls + word + "</span>";
					case "default":
						return keycls + word + "</span>";
					case "number":
						return keycls + word + "</span>";
					case "signed":
						return keycls + word + "</span>";
					case "include":
						return keycls + word + "</span>";
					case "bool":
						return keycls + word + "</span>";
					case "this":
						return keycls + word + "</span>";
					case "continue":
						return keycls + word + "</span>";
					case "function":
						return keycls + word + "</span>";
				}
				return "<span class=\"code-word-normal\">" + word + "</span>";
			}
			var formatCode = function(code) {
				var t = code;
				var lineIndex = 0;
				var newCode = "<div class=\"code-line-container\"><div class=\"code-line-index\"><span>"+ lineIndex + "</span></div><div class=\"code-line line-"+lineIndex+"\">";
				// var indexHtml = "<div class=\"code-line-index\"><span>"+ lineIndex + "</span></div>";
				if (code !== "") {
					var codes = t.replace(/\r/g, "").replace(/    /g, "\t");
					var word = "";
					// var reg = /^\w+$/g;
					// var reg2 = /[\+\-\*\/&\=\%\|]/g;
					var strStack = "";
					var isStr = false;
					var isAnno = false;
					var lastAnnLine = false;
					var ann = "";
					for (var i = 0; i < codes.length; i++) {
						var c = codes[i];
						if (codes[i] === "/" && (codes[i + 1] == "*")) {
							isAnno = true;
							newCode += "<span class=\"code-word-annotation\">/*";
							i++;
							continue;
						}
						if (codes[i] === "*" && (codes[i + 1] == "/")) {
							isAnno = false;
							newCode += "*/</span>";
							i++;
							continue;
						}
						if (isAnno) {
							if (c === "\n") {
								lineIndex++;
								newCode += "</span></div></div><div class=\"code-line-container\"><div class=\"code-line-index\"><span>"+ lineIndex + "</span></div><div class=\"code-line line-"+lineIndex+"\"><span class=\"code-word-annotation\">";
							} else if (c === "\t") {
								newCode += "<span class=\"code-word-tab\"></span>";
							} else if (c === " ") {
								newCode += "<span class=\"code-word-space\"></span>";
							}else{
								newCode += c;
							}
							continue;
						}

						if (isStr) {
							if (c === "\"") {
								newCode += "<span class=\"code-word-quote\">\"</span><span class=\"code-word-string\">" + strStack + "</span><span class=\"code-word-quote\">\"</span>";
								strStack = "";
								isStr = false;
							} else {
								strStack += c;
							}
						} else if (/^\w+$/g.test(c)) { // regexp object have problems
							word += c;
						} else {
							if (word !== "") {
								newCode += isKeyword(word);
								word = "";
							}
							if (c === " ") {
								newCode += "<span class=\"code-word-space\"></span>";
							} else if (c === ".") {
								newCode += "<span class=\"code-word-period\">.</span>";
							} else if (c === "(" || c === ")") {
								newCode += "<span class=\"code-word-paren\">" + c + "</span>";
							} else if (c === "{" || c === "}") {
								newCode += "<span class=\"code-word-curly\">" + c + "</span>";
							} else if (c === "[" || c === "]") {
								newCode += "<span class=\"code-word-square\">" + c + "</span>";
							} else if (c === "<") {
								if (codes[i + 1] && (/[\+\-\*\/&\=\%\|\!]/g.test(codes[i + 1]))) {
									newCode += "<span class=\"code-word-operator\">&lt" + codes[i + 1] + "</span>";
									i = i + 1;
								} else {
									newCode += "<span class=\"code-word-operator\">&lt</span>";
								}
							} else if (c === ">") {
								if (codes[i + 1] && (/[\+\-\*\/&\=\%\|\!]/g.test(codes[i + 1]))) {
									newCode += "<span class=\"code-word-operator\">&gt" + codes[i + 1] + "</span>";
									i = i + 1;
								} else {
									newCode += "<span class=\"code-word-operator\">&gt</span>";
								}
							} else if (/[\+\-\*\/&\=\%\|\!]/.test(c)) {
								if (codes[i + 1] && (/[\+\-\*\/&\=\%\|]/g.test(codes[i + 1]))) {

									if (codes[i + 2] && (/[\+\-\*\/&\=\%\|\!]/g.test(codes[i + 2]))) {
										newCode += "<span class=\"code-word-operator\">" + c + codes[i + 1] + codes[i + 2] + "</span>";
										i = i + 2;
									} else {
										newCode += "<span class=\"code-word-operator\">" + c + codes[i + 1] + "</span>";
										i = i + 1;
									}
								} else {
									newCode += "<span class=\"code-word-operator\">" + c + "</span>";
								}
							} else if (c === "\"") {
								isStr = true;
							} else if (c === "\n") {
								lineIndex++;
								newCode += "</div></div><div class=\"code-line-container\"><div class=\"code-line-index\"><span>"+ lineIndex + "</span></div><div class=\"code-line line-"+ lineIndex +"\">";
							} else if (c === "\t") {
								newCode += "<span class=\"code-word-tab\"></span>";
							} else {
								newCode += "<span class=\"code-word-operator\">" + c + "</span>";
							}
						}
					}
					newCode += isKeyword(word) + "</div></div>";
				}else {
					newCode += "</div></div>";
				}
				
				// return "<code>"+newCode.replace(/\/&tab/g, "<div class=\"tab\"></div>")+"</code>";
				return "<div class=\"widget-code-container\"><code>" + newCode + "</code></div>";
			}

			scope.$watch(function() {
				return scope.config.data
			}, function(data) {
				if (data !== "") {
					var codeStart = data.indexOf("<code>");
					var codeEnd = data.indexOf("</code>", codeStart);
					var str = "";
					var rest = data;

					while (codeStart > -1) {

						str += rest.substring(0, codeStart) + formatCode(rest.substring(codeStart + 6, codeEnd));
						rest = rest.substring(codeEnd + 7);
						codeStart = rest.indexOf("<code>");
						codeEnd = rest.indexOf("</code>");

					}

					str += rest;
					angular.element(ele.find("div")[0]).html(str);
					$compile(ele.contents())(scope);
				}

			})
			// ele.bind("mouseup", function(event) {
			// 	scope.config.cp.node = event.target;
			// 	scope.config.cp.event = event;
			// })
		}
	}
}])

mpw.directive("codeEditor", ["$compile", "$window", function($compile, $window) {
	var innerHTML = 	"<div class=\"widget-code-editor-container\">";
		innerHTML += 		"<textarea id=\"widget-code-input\" name=\"codeInput\" class=\"widget-code-input\" ng-model=\"config.data\" spellcheck=\"false\"></textarea>";
		// innerHTML +=		"<div class=\"widget-code-editor-sidebar\">";
		// innerHTML +=			"<div class=\"widget-code-line-num\"></div>"
		// innerHTML +=		"</div>";
		innerHTML += 		"<div class=\"widget-code-editor-content\" ng-mousedown=\"setStart($event)\">";
		innerHTML += 			"<div class=\"widget-code-cursor\" ng-show=\"isFocused\"></div>";
		// innerHTML += 			"<div class=\"widget-cover-layer\" ng-click=\"setFocus()\"></div>";
		// innerHTML += 			"<div id=\"widget-dynamic\" dynamic config=\"config\"></div>";
		innerHTML += 			"<div id=\"widget-code-index\" class=\"widget-code-index\"></div>"
		innerHTML += 			"<div id=\"widget-code-display\" class=\"widget-code-display\"  ng-mouseup=\"setPosition($event)\" ></div>"
		innerHTML +=		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		link: function(scope, ele, attrs) {
			
			var cursor = document.getElementsByClassName("widget-code-cursor")[0];
			var editor = ele[0];
			var textarea = document.getElementById("widget-code-input");
			var display = document.getElementById("widget-code-display");
			var codeIndex = document.getElementById("widget-code-index");
			var totalLines = 0;
			var unregister = null;

			scope.config.cp = {
				offsetX: 0,
				event: null,
				node: null
			}
			var dataPosition = {
				lineNum: 0,
				lineText: "",
				indexStart: 0,
				indexEnd: 0
			}
			var charWidth = 8.4015625;
			scope.isFocused = false;

			var isKeyword = function(word) {
				if (word === undefined || word === "") return "";
				var keycls = "<span class=\"code-word-key\">";
				switch (word.toLowerCase()) {
					case "if":
						return keycls + word + "</span>";
					case "else":
						return keycls + word + "</span>";
					case "for":
						return keycls + word + "</span>";
					case "do":
						return keycls + word + "</span>";
					case "while":
						return keycls + word + "</span>";
					case "class":
						return keycls + word + "</span>";
					case "int":
						return keycls + word + "</span>";
					case "float":
						return keycls + word + "</span>";
					case "object":
						return keycls + word + "</span>";
					case "string":
						return keycls + word + "</span>";
					case "boolean":
						return keycls + word + "</span>";
					case "unsigned":
						return keycls + word + "</span>";
					case "new":
						return keycls + word + "</span>";
					case "delete":
						return keycls + word + "</span>";
					case "public":
						return keycls + word + "</span>";
					case "private":
						return keycls + word + "</span>";
					case "protected":
						return keycls + word + "</span>";
					case "var":
						return keycls + word + "</span>";
						// case "array":
						// 	return keycls + word + "</span>";
					case "bool":
						return keycls + word + "</span>";
					case "const":
						return keycls + word + "</span>";
					case "true":
						return keycls + word + "</span>";
					case "false":
						return keycls + word + "</span>";
					case "case":
						return keycls + word + "</span>";
					case "switch":
						return keycls + word + "</span>";
					case "return":
						return keycls + word + "</span>";
					case "break":
						return keycls + word + "</span>";
					case "static":
						return keycls + word + "</span>";
					case "void":
						return keycls + word + "</span>";
					case "try":
						return keycls + word + "</span>";
					case "struct":
						return keycls + word + "</span>";
					case "try":
						return keycls + word + "</span>";
					case "throw":
						return keycls + word + "</span>";
					case "null":
						return keycls + word + "</span>";
					case "undefined":
						return keycls + word + "</span>";
					case "catch":
						return keycls + word + "</span>";
					case "char":
						return keycls + word + "</span>";
					case "default":
						return keycls + word + "</span>";
					case "number":
						return keycls + word + "</span>";
					case "signed":
						return keycls + word + "</span>";
					case "include":
						return keycls + word + "</span>";
					case "bool":
						return keycls + word + "</span>";
					case "this":
						return keycls + word + "</span>";
					case "continue":
						return keycls + word + "</span>";
					case "function":
						return keycls + word + "</span>";
				}
				return "<span class=\"code-word-normal\">" + word + "</span>";
			}
			var formatCode = function(code) {
				var t = code;
				var lineIndex = 0;
				var newCode = "<div class=\"code-line line-" + lineIndex + "\">";
				var indexHtml = "<div class=\"code-line-index\"><span>"+ lineIndex + "</span></div>";
				if (code !== "") {
					var codes = t.replace(/\r/g, "").replace(/    /g, "\t");
					var word = "";
					// var reg = /^\w+$/g;
					// var reg2 = /[\+\-\*\/&\=\%\|]/g;
					var strStack = "";
					var isStr = false;
					var isAnno = false;
					var lastAnnLine = false;
					var ann = "";
					for (var i = 0; i < codes.length; i++) {
						var c = codes[i];

						if (codes[i] === "/" && (codes[i + 1] == "*")) {
							isAnno = true;
							newCode += "<span class=\"code-word-annotation\">/*";
							i++;
							continue;
						}
						if (codes[i] === "*" && (codes[i + 1] == "/")) {
							isAnno = false;
							newCode += "*/</span>";
							i++;
							continue;
						}
						if (isAnno) {
							if (c === "\n") {
								lineIndex++;
								newCode += "</span></div><div class=\"code-line line-" + lineIndex + "\"><span class=\"code-word-annotation\">";
								indexHtml += "<div class=\"code-line-index\"><span>"+ lineIndex + "</span></div>";
							} else if (c === "\t") {
								newCode += "<span class=\"code-word-tab\"></span>";
								// newCode += "    ";
							} else if (c === " ") {
								newCode += "<span class=\"code-word-space\"></span>";
								// newCode += " ";
							} else {
								newCode += c;
							}
							continue;
						}

						if (isStr) {
							if (c === "\"") {
								newCode += "<span class=\"code-word-quote\">\"</span><span class=\"code-word-string\">" + strStack + "</span><span class=\"code-word-quote\">\"</span>";
								strStack = "";
								isStr = false;
							} else {
								strStack += c;
							}
						} else if (/^\w+$/g.test(c)) { // regexp object have problems
							word += c;
						} else {
							if (word !== "") {
								newCode += isKeyword(word);
								word = "";
							}
							if (c === " ") {
								newCode += "<span class=\"code-word-space\"></span>";
							} else if (c === ".") {
								newCode += "<span class=\"code-word-period\">.</span>";
							} else if (c === "(" || c === ")") {
								newCode += "<span class=\"code-word-paren\">" + c + "</span>";
							} else if (c === "{" || c === "}") {
								newCode += "<span class=\"code-word-curly\">" + c + "</span>";
							} else if (c === "[" || c === "]") {
								newCode += "<span class=\"code-word-square\">" + c + "</span>";
							} else if (c === "<") {
								if (codes[i + 1] && (/[\+\-\*\/&\=\%\|\!]/g.test(codes[i + 1]))) {
									newCode += "<span class=\"code-word-operator\">&lt" + codes[i + 1] + "</span>";
									i = i + 1;
								} else {
									newCode += "<span class=\"code-word-operator\">&lt</span>";
								}
							} else if (c === ">") {
								if (codes[i + 1] && (/[\+\-\*\/&\=\%\|\!]/g.test(codes[i + 1]))) {
									newCode += "<span class=\"code-word-operator\">&gt" + codes[i + 1] + "</span>";
									i = i + 1;
								} else {
									newCode += "<span class=\"code-word-operator\">&gt</span>";
								}
							} else if (/[\+\-\*\/&\=\%\|\!]/.test(c)) {
								if (codes[i + 1] && (/[\+\-\*\/&\=\%\|]/g.test(codes[i + 1]))) {

									if (codes[i + 2] && (/[\+\-\*\/&\=\%\|\!]/g.test(codes[i + 2]))) {
										newCode += "<span class=\"code-word-operator\">" + c + codes[i + 1] + codes[i + 2] + "</span>";
										i = i + 2;
									} else {
										newCode += "<span class=\"code-word-operator\">" + c + codes[i + 1] + "</span>";
										i = i + 1;
									}
								} else {
									newCode += "<span class=\"code-word-operator\">" + c + "</span>";
								}
							} else if (c === "\"") {
								isStr = true;
							} else if (c === "\n") {
								lineIndex++;
								newCode += "</div><div class=\"code-line line-" + lineIndex + "\">";
								indexHtml += "<div class=\"code-line-index\"><span>"+ lineIndex + "</span></div>";
							} else if (c === "\t") {
								newCode += "<span class=\"code-word-tab\"></span>";
							} else {
								newCode += "<span class=\"code-word-operator\">" + c + "</span>";
							}
						}
					}
					newCode += isKeyword(word) + "</div>";
				} else {
					newCode += "</div>";
				}

				var angularDisplay = angular.element(display);
				angularDisplay.html("<code>" + newCode + "</code>");
				var angularIndex = angular.element(codeIndex);
				angularIndex.html(indexHtml);

				$compile(angularDisplay)(scope);
				$compile(angularIndex)(scope);


				// return "<code>" + newCode + "</code>";
			}

			var toAbsolute = function(relativeIndex, lineNum) {
				var sum = 0;
				var lines = textarea.value.split("\n");
				for (var i = 0; i < lineNum; i++) {
					sum += lines[i].length;
				}
				sum += relativeIndex + lineNum;
				return sum;
			}

			var toRelative = function(index) {
				var lineNum = 0;
				var relativeIndex = -1;
				for (var i = 0; i <= index; i++) {
					if (textarea.value[i] === "\n") {
						lineNum++;
						relativeIndex = -1;
					}else {
						relativeIndex++;
					}
				}
				return {
					index: relativeIndex,
					lineNum: lineNum
				};
			}

			var setCaretPosition = function(start, end) {
				var input = textarea;
				var selectionStart = start || toAbsolute(dataPosition.indexStart, dataPosition.lineNum);
				var selectionEnd = end || toAbsolute(dataPosition.indexEnd, dataPosition.lineNum);
				if (input.setSelectionRange) {
					input.focus();
					input.setSelectionRange(selectionStart, selectionEnd);
				} else if (input.createTextRange) {
					var range = input.createTextRange();
					range.collapse(true);
					range.moveEnd('character', selectionEnd);
					range.moveStart('character', selectionStart);
					range.select();
				}
			}

			var getInputSelection = function (el) {
				var start = 0,
					end = 0,
					normalizedValue, range,
					textInputRange, len, endRange;

				if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
					start = el.selectionStart;
					end = el.selectionEnd;
				} else {
					range = document.selection.createRange();

					if (range && range.parentElement() == el) {
						len = el.value.length;
						normalizedValue = el.value.replace(/\r\n/g, "\n");

						// Create a working TextRange that lives only in the input
						textInputRange = el.createTextRange();
						textInputRange.moveToBookmark(range.getBookmark());

						// Check if the start and end of the selection are at the very end
						// of the input, since moveStart/moveEnd doesn't return what we want
						// in those cases
						endRange = el.createTextRange();
						endRange.collapse(false);

						if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
							start = end = len;
						} else {
							start = -textInputRange.moveStart("character", -len);
							start += normalizedValue.slice(0, start).split("\n").length - 1;

							if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
								end = len;
							} else {
								end = -textInputRange.moveEnd("character", -len);
								end += normalizedValue.slice(0, end).split("\n").length - 1;
							}
						}
					}
				}

				return {
					start: start,
					end: end
				};
			}



			// scope.config.data = ;
			scope.setPosition = function($event) {
				// dynamic.triggerHandler("click");
				var node = null;
				scope.isFocused = true;
				if ($event.target.className.indexOf("widget-code-display") > -1) {
					node = $event.target.childNodes[0].childNodes[$event.target.childNodes[0].childNodes.length-1];
					scope.config.cp.node = node;
				}else{
					scope.config.cp.node = $event.target;
					node = $event.target;
				}


				var rec = null;
				var outerbox = editor.getBoundingClientRect();
				var left = outerbox.left;
				var top = outerbox.top;
				if (node.nodeName.toLowerCase() === "div") {
					if (node.childNodes.length === 0) {
						rec = node.getBoundingClientRect();
						scope.config.cp.offsetX = 0;
					}else{
						var span = node.childNodes[node.childNodes.length-1];
						rec = span.getBoundingClientRect();
						scope.config.cp.offsetX = rec.width;
					}
					dataPosition.lineNum = parseInt(node.className.split("-")[2]);
				}else {
					rec = node.getBoundingClientRect();
					scope.config.cp.offsetX = $event.offsetX - $event.offsetX % charWidth;
					dataPosition.lineNum = parseInt(node.parentNode.className.split("-")[2]);
				}

				cursor.style.left = rec.left + scope.config.cp.offsetX - left + "px";
				cursor.style.top = rec.top - top + "px";
				textarea.style.left = rec.left + scope.config.cp.offsetX - left + "px";
				textarea.style.top = rec.top - top + "px";

				dataPosition.lineText = scope.config.data.split("\n")[dataPosition.lineNum];
				dataPosition.indexEnd = Math.round(parseFloat(cursor.style.left) / charWidth);
				dataPosition.indexStart = dataPosition.indexEnd;

				// moveCursor(scope.config.cp.event, scope.config.cp.node);
				setCaretPosition();
			}


			scope.setStart = function($event) {
				$event.preventDefault();
				// var dynamic = angular.element(document.getElementById("widget-dynamic"));
				textarea.focus();
			}

			

			scope.registerLoadListener = function() {
				unregister  = scope.$watch(function() {
					return scope.config.data
				}, function(data) {
					formatCode(textarea.value);
				})
			};
			scope.registerLoadListener();

			scope.config.empty = function() {
				textarea.value = "";
				scope.config.data = "";
				formatCode(textarea.value);
				setCursorPosition.left(0);
				setCursorPosition.top(0);
				scope.isFocused = false;
				scope.registerLoadListener();
			}

			var setCursorPosition = {
				left: function(position) {

					textarea.style.left = position + "px";
					cursor.style.left = position + "px";
				},
				top: function(position) {

					textarea.style.top = position + "px";
					cursor.style.top = position + "px";
				}
			}


			// angular.element(textarea).on("keyup", function(event) {
			// 	// event.preventDefault();
			// 	var absPosition = getInputSelection(textarea);
				
			// 	dataPosition.indexStart = start.index;
			// 	dataPosition.lineNum = start.lineNum;
			// 	dataPosition.indexEnd = start.index;
			// 	if (event.keyCode !== 13 && event.keyCode !== 8) {

					
			// 	}

			// })

			angular.element(textarea).on("keydown", function(event) {
				// event.preventDefault();

				var absPosition = getInputSelection(textarea);
				var relative = {};
				var keyCode = event.keyCode;

				if (keyCode === 9) { 		//tab

					relative = toRelative(absPosition.start);
					var temp = textarea.value;

					textarea.value = temp.substr(0, absPosition.start) + "    " + temp.substr(absPosition.start)
					setCaretPosition(absPosition.start+4, absPosition.start+4)

					cursor.style.left = (relative.index+4) * charWidth + "px";

					// var inHtml = formatCode(textarea.value);
					// var anDisplay = angular.element(display)
					// anDisplay.html(inHtml);
					// $compile(anDisplay)(scope);
					formatCode(textarea.value);

					dataPosition.indexStart += 4;
					dataPosition.lineNum++;
					dataPosition.indexEnd += 4;

					event.preventDefault();
				}else if (keyCode === 13) {

					cursor.style.left = 0 + "px";
					cursor.style.top = parseInt(cursor.style.top) + 20 + "px";

					dataPosition.indexStart = 0;
					dataPosition.lineNum++;
					dataPosition.indexEnd = 0;

				}else if (keyCode === 8) {
					var del = textarea.value[absPosition.start-1];
					var before = textarea.value[absPosition.start-2];
					if (absPosition.start === absPosition.end) {
						if (absPosition.start === 0) {

							relative.index = 0;
							relative.lineNum = 0;

							setCursorPosition.left(0);
							setCursorPosition.top(0);

						} else if (del === "\n") {

							relative = toRelative(absPosition.start - 2);
							relative.index++;

							cursor.style.top = + "px";
							cursor.style.left =  + "px";

							setCursorPosition.top(parseInt(cursor.style.top) - 20 );

						} else{
							relative = toRelative(absPosition.start - 1);
							setCursorPosition.left(relative.index * charWidth);
						}
					}
					dataPosition.indexStart = relative.index;
					dataPosition.lineNum = relative.lineNum;
					dataPosition.indexEnd = relative.index;
				}else if (event.key.length === 1){
					relative = toRelative(absPosition.start - 1);
					relative.index += 2;
					setCursorPosition.left(relative.index * charWidth);

					dataPosition.indexStart = relative.index;
					dataPosition.lineNum = relative.lineNum;
					dataPosition.indexEnd = relative.index;
				}else if (keyCode === 40) { // arrow down
					
					var lines = textarea.value.split("\n");
					if (dataPosition.lineNum + 1 < lines.length) {
						dataPosition.lineNum++;
						var charsInline = lines[dataPosition.lineNum].length;
						if (dataPosition.indexStart >= charsInline) {
							setCursorPosition.left(charsInline * charWidth);
							dataPosition.indexStart = charsInline;
						}
						setCursorPosition.top(parseInt(cursor.style.top) + 20)
					}else{
						var charsInline = lines[dataPosition.lineNum].length;
						dataPosition.indexStart = charsInline;
						setCursorPosition.left(charsInline * charWidth);
					}

				}else if (keyCode === 38) { // arrow up
					var lines = textarea.value.split("\n");
					if (dataPosition.lineNum - 1 >= 0) {
						dataPosition.lineNum--;
						var charsInline = lines[dataPosition.lineNum].length;
						if (dataPosition.indexStart >= charsInline) {
							setCursorPosition.left(charsInline * charWidth);
							dataPosition.indexStart = charsInline;
						}
						setCursorPosition.top(parseInt(cursor.style.top) - 20);
					}else {
						dataPosition.indexStart = 0;
						setCursorPosition.left(0);
					}
				}else if (keyCode === 37) { // arrow left
					if (dataPosition.indexStart !== 0) {
						dataPosition.indexStart--;
						setCursorPosition.left(dataPosition.indexStart * charWidth);
					}
				}else if (keyCode === 39) { // arrow right
					var charsInline = textarea.value.split("\n")[dataPosition.lineNum].length;
					if (dataPosition.indexStart < charsInline) {
						dataPosition.indexStart++;
						setCursorPosition.left(dataPosition.indexStart * charWidth);
					}
				}


			})

			angular.element(textarea).on("input propertychange", function() {
				unregister();
				formatCode(textarea.value);
				// var inHtml = formatCode(textarea.value);
				// var anDisplay = angular.element(display);
				// anDisplay.html(inHtml);

				// $compile(anDisplay)(scope);

			})

			angular.element($window).on("resize", function() {
				var outerbox = editor.getBoundingClientRect();
				var left = outerbox.left;
				var top = outerbox.top;
				var node = scope.config.cp.node;
				if (node.nodeName.toLowerCase() === "div") {
					if (node.childNodes.length === 0) {
						rec = node.getBoundingClientRect();
					}else{
						var span = node.childNodes[node.childNodes.length-1];
						rec = span.getBoundingClientRect();
					}
				}else {
					rec = node.getBoundingClientRect();
				}
				cursor.style.left = rec.left + scope.config.cp.offsetX - left + "px";
				cursor.style.top = rec.top - top + "px";
			})

			// angular.element(display).on("mouseup", function(event) {
			// 	scope.config.cp.node = event.target;
			// 	scope.config.cp.event = event;
			// })



			
		}
	}
}])

mpw.directive("editor", ["$compile", function($compile) {
	var innerHTML = 	"<div class=\"widget-editor-container\">";
		// innerHTML +=
		innerHTML += 		"<div class=\"widget-text-editor-wrapper\" ng-hide=\"isCode\">";
		innerHTML += 			"<div id=\"text-editor\" text-angular ta-toolbar=\"config.text.toolbar\" ng-model=\"config.text.data\" ng-blur=\"formatReturnData()\" ng-focus=\"\"></div>";
		innerHTML += 		"</div>";
		// innerHTML +=		"<div class=\"widget-editor-mask-layer\" ng-show=\"isCode\"></div>";
		innerHTML += 		"<div class=\"widget-code-editor-wrapper\" ng-show=\"isCode\">";
		innerHTML += 			"<div id=\"code-editor\" code-editor config=\"config.code\"></div>";
		innerHTML += 		"</div>";
		innerHTML +=		"<div button config=\"insertCode\"></div>";
		// innerHTML += 		"<div class=\"widget-preview-mask\" ng-show=\"isPreview\" ng-click=\"isPreview=false;\">";
		// innerHTML += 			"<div dynamic config=\"config.code\"></div>";
		// innerHTML +=		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		link: function($scope, $element, $attrs) {
		// controller: ["$scope", "$element", "$compile", function($scope, $element, $compile){
			$scope.config.data = "";
			$scope.codes = [];
			$scope.codeIndex = 0;
			$scope.isCode = false;
			$scope.isPreview = false;
			$scope.current = -1;
			$scope.insertCode = {
				cls: "to-text",
				text: "Done",
				isVisible: false,
				fn: function() {
					// document.querySelector("div[id^=taTextElemen]").parentNode.focus();
					if ($scope.isCode) {	//click done
						$scope.isCode = false;
						this.isVisible = false;
						if ($scope.config.code.data !== "") {
							if ($scope.current === -1) {
								$scope.codes[$scope.codeIndex] = $scope.config.code.data;
								$scope.codeIndex++;
							}else{
								$scope.codes[$scope.current] = $scope.config.code.data;
								$scope.current = -1;
							}
							$scope.config.code.empty();
						}
					}
					$scope.formatReturnData();
				}
			}
			$scope.formatReturnData = function() {

				if ($scope.codes.length === 0) $scope.config.data = $scope.config.text.data;
				else {
					var str = "";
					var rest = $scope.config.text.data;

					var codeStart = $scope.config.text.data.indexOf("<code");
					var endStartTag = null;
					// var codeStart = original.indexOf(">", codeTagStart);
					var id = null;
					var codeEnd = null;


					while (codeStart > -1) {

						endStartTag = rest.indexOf(">", codeStart);
						id = parseInt(rest.substring(codeStart, endStartTag - 1).split("-")[2]);
						codeEnd = rest.indexOf("</code>");

						str += rest.substring(0, codeStart) + "<code>" + $scope.codes[id] + "</code>";
						rest = rest.substring(codeEnd + 7);
						codeStart = rest.indexOf("<code");

					}

					str += rest;
					// return str;

					$scope.config.data = str;
				}
			}
			var formatloadData = function() {
				// var reg = /<code>.*?<\/code>/;
				var text = $scope.config.data.split(/<code>[\s\S]*<\/code>/g);
				var all = $scope.config.data.split(/<code>|<\/code>/);
				var id = "";
				var html = "";
				var str = "";
				var code = null;


				for (var i = 0, j = 0; i < text.length; i++) {
					if (text[i] === all[j]) {
						$scope.config.text.data += text[i];
						j++;
					}else{
						id = "code-area-" + $scope.codeIndex;
						html = "<p><br></p><code id=\"" + id + "\" class=\"code-area\">Click to Edit Code</code><p><br></p>";
						$scope.config.text.data += html;
						$scope.codes[$scope.codeIndex] = all[j];
						$scope.codeIndex++;

						j++;
						i--;
					}
				}
			}

			if (!$scope.config.isnew) {
				var loadListerner = $scope.$watch(function() {
					return $scope.config.data
				}, function(newVal, oldVal) {
					if (newVal !== "" && oldVal === "") {
						formatloadData();
						loadListerner();
					}
				})
			}



			angular.element(document.querySelector("div[id^=taTextElemen]")).on("click", function(event) {

				if (event.target.tagName === "CODE") {
					$scope.isCode = true;
					$scope.insertCode.isVisible = true;
					$scope.current = parseInt(event.target.id.split("-")[2]);
					$scope.config.code.data = $scope.codes[$scope.current];
					$scope.$apply();
				}
			})
		},
	}
}])
	// mpw.directive("button", function() {

// })

mpw.directive("loading", function() {
	var innerHTML = 	"<div class=\"widget-loading-container\">";
		innerHTML += 		"<div class=\"widget-loading-content\">";
		innerHTML += 			"<div class=\"widget-loading\"></div>";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		template: innerHTML,
		scope: false,
		restrict: "A",
		replace: false
	}
});
// mpw.directive("editor", function() {

// })

// mpw.directive("textEditor", function() {
// 	var innerHTML = 	"<div class=\"widget-text-editor-container\">";
// 		innerHTML += 		"<div class=\"widget-tool-container\">";
// 		innerHTML += 			"<ul class=\"widget-tool-list\">";
// 		innerHTML += 				"<li ng-repeat=\"btn in config.btns\" ng-click=\"btn.fn()\">";
// 		innerHTML += 					"<div class=\"widget-tool-btn-container\">";
// 		// innerHTML += 						"<div class=\"widget-tool-btn-content {{btn.cls}}\">";
// 		innerHTML +=							"<img ng-src=\"{{btn.src}}\" alt=\"{{btn.name}}\" />"
// 		// innerHTML +=						"</div>";
// 		innerHTML += 					"</div>";
// 		innerHTML += 				"</li>";
// 		innerHTML += 			"</ul>";
// 		innerHTML += 		"</div>";
// 		innerHTML += 		"<div class=\"widget-editor-content\" contenteditable=\"true\" ng-model=\"data\" ng-click=\"onTextClick($event)\">";
// 		innerHTML += 		"</div>";
// 		innerHTML += 	"</div>";
// 	return {
// 		restrict: "A",
// 		replace: true,
// 		template: innerHTML,
// 		scope:{
// 			config: "=",
// 			data: "="
// 		},
// 		compile: function(ele, attr, trans) {
// 			function pasteHtmlAtCaret(tag) {
// 				var sel, range;
// 				if (window.getSelection) {
// 					// IE9 and non-IE
// 					sel = window.getSelection();
// 					if (sel.getRangeAt && sel.rangeCount) {
// 						range = sel.getRangeAt(0);
// 						var temp = range.toString();
// 						range.deleteContents();

// 						// Range.createContextualFragment() would be useful here but is
// 						// non-standard and not supported in all browsers (IE9, for one)
// 						var el = document.createElement(tag);
// 						el.innerHTML = temp;
// 						var frag = document.createDocumentFragment(),
// 							node, lastNode;
// 						while ((node = el.firstChild)) {
// 							lastNode = frag.appendChild(node);
// 						}
// 						range.insertNode(frag);

// 						// Preserve the selection
// 						if (lastNode) {
// 							range = range.cloneRange();
// 							range.setStartAfter(lastNode);
// 							range.collapse(true);
// 							sel.removeAllRanges();
// 							sel.addRange(range);
// 						}
// 					}
// 				} else if (document.selection && document.selection.type != "Control") {
// 					// IE < 9
// 					var r = document.selection.createRange();
// 					r.text = "<"+tag+">" + r.text + "<\\" +tag +">";
// 				}
// 			}
// 			// function insertHtmlAtSelectionEnd(html, isBefore) {
// 			// 	var sel, range, node;
// 			// 	if (window.getSelection) {
// 			// 		sel = window.getSelection();
// 			// 		if (sel.getRangeAt && sel.rangeCount) {
// 			// 			range = window.getSelection().getRangeAt(0);
// 			// 			range.collapse(isBefore);

// 			// 			// Range.createContextualFragment() would be useful here but was
// 			// 			// until recently non-standard and not supported in all browsers
// 			// 			// (IE9, for one)
// 			// 			var el = document.createElement("div");
// 			// 			el.innerHTML = html;
// 			// 			var frag = document.createDocumentFragment(),
// 			// 				node, lastNode;
// 			// 			while ((node = el.firstChild)) {
// 			// 				lastNode = frag.appendChild(node);
// 			// 			}
// 			// 			range.insertNode(frag);
// 			// 		}
// 			// 	} else if (document.selection && document.selection.createRange) {
// 			// 		range = document.selection.createRange();
// 			// 		range.collapse(isBefore);
// 			// 		range.pasteHTML(html);
// 			// 	}
// 			// }
// 			function insertHtmlAfterSelection(html, isBefore) {
// 				var sel, range, expandedSelRange, node;
// 				if (window.getSelection) {
// 					sel = window.getSelection();
// 					if (sel.getRangeAt && sel.rangeCount) {
// 						range = window.getSelection().getRangeAt(0);
// 						expandedSelRange = range.cloneRange();
// 						range.collapse(isBefore);

// 						// Range.createContextualFragment() would be useful here but is
// 						// non-standard and not supported in all browsers (IE9, for one)
// 						var el = document.createElement("div");
// 						el.innerHTML = html;
// 						var frag = document.createDocumentFragment(),
// 							node, lastNode;
// 						while ((node = el.firstChild)) {
// 							lastNode = frag.appendChild(node);
// 						}
// 						range.insertNode(frag);

// 						// Preserve the selection
// 						if (lastNode) {
// 							expandedSelRange.setEndAfter(lastNode);
// 							sel.removeAllRanges();
// 							sel.addRange(expandedSelRange);
// 						}
// 					}
// 				} else if (document.selection && document.selection.createRange) {
// 					range = document.selection.createRange();
// 					expandedSelRange = range.duplicate();
// 					range.collapse(isBefore);
// 					range.pasteHTML(html);
// 					expandedSelRange.setEndPoint("EndToEnd", range);
// 					expandedSelRange.select();
// 				}
// 			}
// 			function insertTextAtCursor(text) {
// 				var sel, range, html;
// 				if (window.getSelection) {
// 					sel = window.getSelection();
// 					if (sel.getRangeAt && sel.rangeCount) {
// 						range = sel.getRangeAt(0);
// 						range.deleteContents();
// 						range.insertNode(document.createTextNode(text));
// 					}
// 				} else if (document.selection && document.selection.createRange) {
// 					document.selection.createRange().text = text;
// 				}
// 			}
// 			var defaultConfig = {
// 				btns: [{
// 					name: "B",
// 					src: "./img/bold-text.png",
// 					fn: function() {

// 						pasteHtmlAtCaret("b");
// 						// console.log(text);
// 						// text 
// 					}
// 				},{
// 					name: "I",
// 					src: "./img/italics.png",
// 					fn: function() {
// 						pasteHtmlAtCaret("i")
// 					}
// 				},{
// 					name: "U",
// 					src: "./img/undelined.png",
// 					fn: function() {

// 					}
// 				},{
// 					name: "Font",
// 					src: "./img/Fonts.png",
// 					fn: function() {

// 					}
// 				},{
// 					name: "Size",
// 					src: "./img/Fontsize.png",
// 					fn: function() {

// 					}
// 				},{
// 					name: "Strike",
// 					src: "./img/strike-through.png",
// 					fn: function() {

// 					}
// 				},{
// 					name: "Color",
// 					src: "./img/Fontcolor.png",
// 					fn: function() {

// 					}
// 				},{
// 					name: "Left",
// 					src: "./img/alleft.png",
// 					fn: function() {

// 					}
// 				},{
// 					name: "Center",
// 					src: "./img/alcenter.png",
// 					fn: function() {

// 					}
// 				},{
// 					name: "Right",
// 					src: "./img/alright.png",
// 					fn: function() {

// 					}
// 				}]
// 			}
// 			return function(scope, ele, attr) {
// 				scope.config = angular.extend({}, defaultConfig, scope.config);
// 				scope.onTextClick = function($event) {
// 					console.log($event)
// 				}
// 			}
// 		}
// 	}

// })