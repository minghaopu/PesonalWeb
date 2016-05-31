mpw.directive("navigator", ["$module", "$location", "$user", "$timeout", function($module, $location, $user, $timeout) {
	var innerHTML = 	"<div class=\"widget-nav-container\">";
		innerHTML += 		"<div class=\"widget-nav-content\">";
		innerHTML += 			"<ul class=\"widget-nav-ul\">";
		innerHTML += 				"<li ng-repeat=\"nav in navs\" class=\"widget-nav-li {{nav.name}}\" ng-click=\"goto(nav.url)\">";
		innerHTML += 					"<a href=\"javascript:void(0)\" class=\"widget-nav-link\">";
		innerHTML += 						"{{nav.name | uppercase}}";
		innerHTML += 					"</a>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";
		innerHTML +=		"<div class=\"widget-user-container\" ng-mouseover=\"mouseover()\" ng-mouseleave=\"mouseleave()\">";
		innerHTML +=			"<div class=\"widget-user-content\">";
		innerHTML +=				"<span class=\"widget-user-text\">{{name}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=			"<div class=\"widget-drop-content\" ng-show=\"isDropped\" ng-mouseover=\"mouseover()\" ng-mouseleave=\"mouseleave()\">";
		innerHTML += 				"<ul class=\"widget-drop-ul\">";
		innerHTML +=					"<li class=\"widget-drop-li\" ng-click=\"gotoProfile()\">";
		innerHTML +=						"<a href=\"javascript:void(0)\" class=\"widget-drop-link\">Profile</a>";
		innerHTML +=					"</li>";
		innerHTML +=					"<li class=\"widget-drop-li\" ng-click=\"logout()\">";
		innerHTML +=						"<a href=\"javascript:void(0)\" class=\"widget-drop-link\">Logout</a>";
		innerHTML +=					"</li>";
		innerHTML += 				"</ul>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: true,
		compile: function(ele, attr, trans) {
			return function(scope, ele, attr) {
				var navs = $module.getRoutes();
				var timer;

				scope.navs = [navs.intro, navs.blog, navs.resume];
				scope.isDropped = false;
				scope.name = $user.getName();

				scope.goto = function (url) {
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
					$user.logout();
				}
				scope.gotoProfile = function() {
					$location.path("/profile")
				}
			}
		}

	}
}]);

mpw.directive("message", ["$message", function($message) {
	var innerHTML = 	"<div class=\"widget-msg-wrapper\" ng-show=\"isVisible\">";
		innerHTML += 		"<div class=\"widget-msg-container\">";
		innerHTML += 			"<div class=\"widget-msg-title\">";
		innerHTML += 				"<div class=\"widget-msg-icon-container\">"
		innerHTML +=					"<img ng-src=\"{{msg.titleIcon}}\" class=\"widget-msg-icon\">"
		innerHTML += 				"</div>";
		innerHTML += 				"<div class=\"widget-msg-title-text\">{{msg.title}}</div>";
		innerHTML += 			"</div>";
		innerHTML += 			"<div class=\"widget-msg-content-container\">";
		innerHTML += 				"<div class=\"widget-msg-content\">{{msg.text}}</div>";
		innerHTML += 				"<div class=\"widget-msg-btn-container\" ng-show=\"msg.hasBtn\">";
		innerHTML += 					"<div button ng-repeat=\"btn in msg.button\" config={{btn}}></div>";
		// innerHTML += 					"<button id=\"msg-no-btn\" class=\"msg-no-btn\" btn-config=\"msg.noBtn\"></button>";
		innerHTML += 				"</div>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-msg-mask-layer\"></div>";
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
					scope.$watch(function(){
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
		innerHTML += 				"<li ng-repeat=\"app in apps\" class=\"widget-apps-li {{app.name}}\">";
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
		scope: false
	}
});

mpw.directive("textBox", function() {
	var innerHTML = 	"<div class=\"widget-text-wrapper {{config.cls}}\">";
		innerHTML +=		"<div class=\"widget-icon-container {{config.iconCls}}\">";
		innerHTML +=			"<div class=\"widget-icon-content\"></div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-lable-container {{config.labelCls}}\">";
		innerHTML +=			"<div class=\"widget-lable-content\">";
		innerHTML +=				"<span class=\"widget-lable-text\">{{config.label}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-text-content {{config.inputCls}}\">";
		innerHTML +=			"<input type=\"{{config.type}}\"";
		innerHTML +=					" name=\"{{config.name}}\"";
		innerHTML +=					" class=\"widget-text-input\"";
		innerHTML +=					" ng-readonly=\"config.readOnly\"";
		innerHTML +=					" maxlength=\"{{config.maxLength}}\"";
		innerHTML +=					" minlength=\"{{config.minLength}}\"";
		innerHTML +=					" placeholder=\"{{config.placeholder}}\"";
		innerHTML +=					" ng-disabled=\"config.disabled\"";
		innerHTML +=					" ng-trim=\"config.trim\"";
		innerHTML +						" ng-model=\"config.data\">";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-error-container  {{config.errorCls}}\">";
		innerHTML +=			"<div ng-hide=\"config.isValid\" class=\"widget-error-content\">";
		innerHTML +=				"<span class=\"widget-error-text\">{{config.error}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=	"</div>";
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
				isValid: true
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
			}
		}
	}
})

mpw.directive("button", function() {
	var innerHTML = 	"<div class=\"widget-button-container {{config.cls}}\" ng-class=\"config.disabled?'widget-button-disalbed':''\" ng-click=\"config.fn()\">";
		innerHTML +=		"<div class=\"widget-icon-container\">";
		innerHTML +=			"<div class=\"widget-icon-content {{config.iconCls}}\"></div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-button-content\">";
		innerHTML +=			"<button class=\"widget-button-btn {{config.btnCls}}\" ng-disabled=\"config.disabled\">{{config.text}}</button>";
		innerHTML +=		"</div>";
		innerHTML +=	"</div>";
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
				fn: function(){}
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
				console.log(scope.config)
			}
		}
	}
})

mpw.directive("list", ["$location", function($location) {
	var innerHTML = 	"<div class=\"widget-list-container\">";
		innerHTML +=		"<div class=\"widget-list-content\" ng-hide=\"config.data.length > 0 ? false : true\">";
		innerHTML +=			"<ul class=\"widget-list-ul\">";
		innerHTML +=				"<li ng-repeat=\"row in config.data\" class=\"widget-list-row row-{{$index}}\">";
		innerHTML +=					"<div class=\"widget-row-title\" ng-click=\"viewPassage(row)\">";
		innerHTML +=						"<a href=\"javascript:void(0)\" class=\"widget-row-link\">{{row.title}}</a>"
		innerHTML +=					"</div>";
		innerHTML +=					"<div class=\"widget-row-time\">{{row.posttime}}</div>";
		innerHTML +=				"</li>";
		innerHTML +=			"</ul>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-list-empty-content\" ng-show=\"config.data.length > 0 ? false : true\">";
		innerHTML +=			"<span class=\"widget-list-empty-text\">{{config.emptyText}}</span>";
		innerHTML +=		"</div>";
		innerHTML +=	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				emptyText: "No blog!",
				data: []
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
				scope.isEmpty = scope.config.data.length > 0 ? false : true;
				scope.viewPassage = function(row) {
					$location.path("/passage/"+row.passageId);
				}
			}
		}
	}
}])

mpw.directive("pdf", function() {
	var innerHTML = 	"<div class=\"widget-pdf-container\" ng-switch on=\"config.isEmpty\">";
		innerHTML +=		"<div class=\"widget-pdf-content\" ng-switch-when=\"false\">";
		innerHTML += 			"<iframe ng-src=\"{{config.url}}\" type=\"application/pdf\" ></iframe>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-pdf-empty-content\" ng-switch-when=\"true\">";
		innerHTML +=			"<span class=\"widget-pdf-empty-text\">{{config.emptyMsg}}</span>";
		innerHTML +=		"</div>";
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
				emptyMsg: "You have not uploaded any resume"
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
			}
		}
	}
})

mpw.directive("file", ["$request", function($request) {
	var innerHTML = 	"<div class=\"widget-file-wrapper {{config.cls}}\">";
		innerHTML +=		"<div class=\"widget-icon-container {{config.iconCls}}\">";
		innerHTML +=			"<div class=\"widget-icon-content\"></div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-lable-container {{config.labelCls}}\">";
		innerHTML +=			"<div class=\"widget-lable-content\">";
		innerHTML +=				"<span class=\"widget-lable-file\">{{config.label}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-file-content {{config.inputCls}}\">";
		innerHTML +=			"<input type=\"file\"";
		innerHTML +=					" name=\"{{config.name}}\"";
		innerHTML +=					" class=\"widget-file-input\"";
		innerHTML +=					" placeholder=\"{{config.placeholder}}\"";
		innerHTML +=					" ng-disabled=\"config.disabled\"";
		innerHTML +						" ng-model=\"data\">";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-error-container  {{config.errorCls}}\">";
		innerHTML +=			"<div ng-hide=\"config.isValid\" class=\"widget-error-content\">";
		innerHTML +=				"<span class=\"widget-error-file\">{{config.error}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-preview-container\" ng-show=\"config.isImg\">";
		innerHTML +=			"<div class=\"widget-preview-content\">";
		innerHTML +=				"<img ng-src=\"{{filesrc}}\" alt=\"\" />";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div button config=\"config.btn\"></div>";
		innerHTML +=	"</div>";
	return {
		restrict: "A",
		template: innerHTML,
		replace: true,
		scope: {
			config: "="
		},
		controller: ["$scope", "$element", "$request", function($scope, $element, $request) {
			var defaultConfig = {
				placeholder: "file",
				disabled: false,
				isValid: true,
				isImg: false,
				btn: {
					text: "Upload",
					fn: function() {
						var data = new FormData();
						data.append("file", $scope.data);
						$request.query({
							url: "./data/upload.json",
							data: data,
							withCredentials: true,
							headers: {"Content-Type": undefined },
							transformRequest: angular.identity
						})
						console.log("a")
					}
				}
			}
			$scope.config = angular.extend({}, defaultConfig, $scope.config);

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
							$scope.filesrc = loadEvent.target.result;
						})
					}
					reader.readAsDataURL($scope.data);
				}
			});
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
	var innerHTML = 	"<div class=\"widget-display-wrapper {{config.cls}}\" ng-switch on=\"config.type\">";
		innerHTML +=		"<div class=\"widget-icon-container {{config.iconCls}}\">";
		innerHTML +=			"<div class=\"widget-icon-content\"></div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-lable-container {{config.labelCls}}\">";
		innerHTML +=			"<div class=\"widget-lable-content\">";
		innerHTML +=				"<span class=\"widget-lable-display\">{{config.label}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div ng-switch-when=\"text\" class=\"widget-display-text-content\">";
		innerHTML +=			"<span class=\"widget-display-text\"></span>"
		innerHTML +=		"</div>";
		innerHTML +=		"<div ng-switch-when=\"img\" class=\"widget-display-img-content\">";
		innerHTML +=			"<img ng-src=\"{{config.imgSrc}}\" alt=\"\" />";
		innerHTML +=		"</div>";
		innerHTML +=	"</div>";
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
				scope.config = angular.extend({}, defaultConfig, $scope.config);
			}
		}
	}
})
// mpw.directive("button", function() {

// })

// mpw.directive("loading", function() {

// });
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