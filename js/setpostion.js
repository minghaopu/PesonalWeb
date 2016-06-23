			scope.setPosition = function($event) {
				// dynamic.triggerHandler("click");
				scope.isFocused = true;
				scope.config.cp.node = $event.target;
				var node = $event.target;

				var rec = null;
				var outerbox = editor.getBoundingClientRect();
				var left = outerbox.left;
				var top = outerbox.top;
				if (node.nodeName.toLowerCase() === "div") {
					dataPosition.lineNum = parseInt(node.className.split("-")[2]);

					if (node.childNodes.length === 0) {
						rec = node.getBoundingClientRect();
						cursor.style.left = "0px";
						dataPosition.indexStart = 0;

					} else {
						var span = node.childNodes[node.childNodes.length - 1];
						rec = span.getBoundingClientRect();
						cursor.style.left = rec.right - left + "px";

						dataPosition.indexStart = textarea.value.split("\n")[dataPosition.lineNum].length
					}
				} else {
					if (node.className === "code-word-annotation") {
						
					}
					var siblings = node.parentNode.childNodes;
					var index = 0;
					for (var i = 0; i < siblings.length; i++) {
						if (siblings[i] === node) break;
						index += siblings[i].innerText.length;
					}

					rec = node.getBoundingClientRect();

					dataPosition.indexStart = Math.round($event.offsetX / charWidth - 1) + index;
					dataPosition.lineNum = parseInt(node.parentNode.className.split("-")[2]);

					cursor.style.left = rec.left + $event.offsetX - $event.offsetX % charWidth - left + "px";


				}
				cursor.style.top = rec.top - top - 100 + "px";
				dataPosition.indexEnd = dataPosition.indexStart;

				// moveCursor(scope.config.cp.event, scope.config.cp.node);
				setCaretPosition();
			}