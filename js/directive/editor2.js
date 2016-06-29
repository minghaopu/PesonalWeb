mpw.directive("editor", ["$compile", function($compile) {
	var innerHTML = 	"<div class=\"widget-editor-container\">";
		// innerHTML +=
		innerHTML += 		"<div class=\"widget-text-editor-wrapper\" ng-hide=\"isCode\">";
		innerHTML += 			"<div id=\"text-editor\" text-angular ta-toolbar=\"config.text.toolbar\" ng-model=\"config.text.data\" ng-blur=\"formatReturnData()\"></div>";
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
		controller: ["$scope", "$element", "$compile", function($scope, $element, $compile){
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
				var codeIndex = 0;
				var id = "";
				var html = "";
				var str = "";
				var code = null;
				for (var i = 0, j = 0; i < text.length; i++) {
					if (text[i] === all[j]) {
						$scope.config.text.data += text[i];
						j++;
					}else{
						id = "code-area-" + codeIndex;
						html = "<p><br></p><code id=\"" + id + "\" class=\"code-area\">Click to Edit Code</code><p><br></p>";
						$scope.config.text.data += html;
						$scope.codes[codeIndex] = all[j];
						codeIndex++;

						

						code = angular.element(document.getElementById(id));

						code.on("click", function(event) {

							event.bubbles = false;
							event.preventDefault();
							event.stopPropagation();
							event.stopImmediatePropagation();
							$scope.isCode = true;
							$scope.insertCode.isVisible = true;
							$scope.current = parseInt(code[0].id.split("-")[2]);
							$scope.config.code.data = $scope.codes[$scope.current];
							$scope.$apply();
						});

						j++;
						i--;
					}
				}
			}

			var loadListerner = $scope.$watch(function() {
				return $scope.config.data
			}, function(newVal, oldVal) {
				if (newVal !== "" && oldVal === "") {
					formatloadData();
					loadListerner();
				}
			})
		}],
	}
}])