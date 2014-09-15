/**
 * A directive for AngularJS that makes an effect akin to text being typed on a computer console.
 *
 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>
 */
(function() {

    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.dirConsoleType';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch(err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }

    module.directive('dirConsoleType', ['$window', '$document', '$timeout', '$interpolate', function ($window, $document, $timeout, $interpolate) {

        /**
         * requestAnimationFrame polyfill from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
         */
        (function() {
            var lastTime = 0;
            var vendors = ['webkit', 'moz'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame =
                  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                      timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
            }
        }());

        function getNodeTextContents(rootNode) {
            var i;
            var descendantNodes = rootNode.querySelectorAll('*');
            var textNodes = [];

            addTextNode(textNodes, rootNode);

            for (i = 0; i < descendantNodes.length; i++) {
                addTextNode(textNodes, descendantNodes[i]);
            }
            return textNodes;
        }

        function addTextNode(textNodes, node) {
            if (containsText(node)) {
                textNodes.push( {
                    node: node,
                    textNodesContent: [],
                    totalChars: 0
                });
            }
        }

        /**
         * Does the node contain any childNodes that are TEXT types that are not empty?
         * @param node
         * @returns {boolean}
         */
        function containsText(node) {
            var _containsText = false;
            var nodeList = node.childNodes;
            for (var i = 0; i < nodeList.length; i++) {
                if (nodeList[i].nodeType === 3 && 0 < nodeList[i].nodeValue.trim().length) {
                    _containsText = true;
                }
            }
            return _containsText;
        }

        /**
         * Empty the values of each text node and store the contents in the textNodes object for later use.
         *
         * @param textNodes
         */
        function clearTextNodesAndStoreValues(textNodes) {
            var i, childNode, nodeObject, nodeList;

            for (i = 0; i < textNodes.length; i++) {
                nodeObject = textNodes[i];

                nodeList = nodeObject.node.childNodes;
                for (i = 0; i < nodeList.length; ++i) {
                    childNode = nodeList[i];
                    if (childNode.nodeType === 3) {
                        nodeObject.textNodesContent.push(childNode.nodeValue.trim());
                        nodeObject.totalChars += childNode.nodeValue.trim().length;

                        childNode.nodeValue = '';
                    } else {
                        nodeObject.textNodesContent.push('');
                    }
                }
            }
        }

        /**
         *
         *
         * @param textNodes
         * @param currentIteration
         * @param totalIterations
         * @returns {boolean}
         */
        function typeTextNodesText(textNodes, currentIteration, totalIterations) {
            var thisNodeLength,
                substringLength,
                currentNode,
                totalCharCount,
                currentIndex,
                currentChar,
                nodeList,
                nodeObject,
                i;

            for (i = 0; i < textNodes.length; i++) {
                nodeObject = textNodes[i];
                nodeList = nodeObject.node.childNodes;

                currentChar = Math.ceil(currentIteration / totalIterations * nodeObject.totalChars);

                // We need to figure out which of the childNodes of this node we should be adding text characters to.
                // To do this we must compare the currentChar against the length of each childNode's text content.
                // We add up the childNodes' content length as we go, and once we find that the current childNode
                // pushes the sum above the currentChar, we know that this is the node that needs its text updating.
                currentIndex = -1;
                totalCharCount = 0;
                thisNodeLength = 0;
                do {
                    thisNodeLength = getLengthOfNodeAtIndex(nodeObject, currentIndex + 1);
                    totalCharCount += getLengthOfNodeAtIndex(nodeObject, currentIndex);
                    currentIndex ++;
                }
                while (totalCharCount + thisNodeLength < currentChar && currentIndex < nodeList.length);

                // if we have gone over the totalChars, default to the last node. (-2 to account for the caret on the end)
                currentIndex = Math.min(currentIndex, nodeList.length - 2);
                currentNode = nodeList[currentIndex];

                if (currentNode && currentNode.nodeType === 3) {
                    if (nodeObject.totalChars < currentChar) {
                        substringLength = nodeObject.totalChars;
                    } else {
                        substringLength = currentChar - totalCharCount;
                    }
                    currentNode.nodeValue = nodeObject.textNodesContent[currentIndex].substring(0, substringLength);
                }

                return nodeObject.totalChars < currentChar;
            }
        }

        function getLengthOfNodeAtIndex(nodeObject, index) {
            return typeof nodeObject.textNodesContent[index] !== 'undefined' ? nodeObject.textNodesContent[index].length : 0;
        }

        /**
         * Add the caret to the end of the element, and style it to fit the text
         * @param element
         */
        function addCaret(element) {
            var height = parseInt($window.getComputedStyle(element[0])['font-size']);
            height -= 2; // make it a bit smaller to prevent it interfering with document flow.
            var backgroundColor = $window.getComputedStyle(element[0])['color'];
            var width = Math.ceil(height * 0.05);
            var marginBottom = Math.ceil(height * -0.1);
            var caret = $document[0].createElement('span');
            caret.classList.add('caret');
            caret.style.height = height + 'px';
            caret.style.width = width + 'px';
            caret.style.backgroundColor = backgroundColor;
            caret.style.marginBottom = marginBottom + 'px';
            element.append(caret);
        }

        function removeCaret(element) {
            var caret = element[0].querySelector('.caret');
            angular.element(caret).remove();
        }

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var start, elapsed;
                var duration = attrs.duration || 1000;
                var removeCaretAfter = attrs.removeCaret || 1000;

                addCaret(element);
                var textNodes = getNodeTextContents(element[0]);
                clearTextNodesAndStoreValues(textNodes);

                if (typeof attrs.starter !=='undefined') {
                    scope.$watch(function() {
                        return scope.$eval(attrs.starter);
                    }, function(val) {
                        if (val) {
                            interpolateText(scope, textNodes);
                            window.requestAnimationFrame(tick);
                        }
                    });
                } else {
                    interpolateText(scope, textNodes);
                    window.requestAnimationFrame(tick);
                }

                /**
                 * If any of the text nodes contain interpolation expressions {{ like.this }}, we need to
                 * interpolate them to get the actual value to be displayed. This will change the
                 * totalChars count so that must also be updated.
                 *
                 * @param textNodes
                 * @param scope
                 */
                function interpolateText(scope, textNodes) {
                    var i, j;

                    for (i = 0; i < textNodes.length; i++) {
                        var nodeObject = textNodes[i];
                        var nodeContentList = nodeObject.textNodesContent;

                        for(j = 0; j < nodeContentList.length; j++) {
                            var currentNodeContent = nodeContentList[j];
                            var currentLength = currentNodeContent.length;
                            var interpolatedContent = $interpolate(currentNodeContent)(scope);
                            var interpolatedLength = interpolatedContent.length;

                            var lengthDelta = interpolatedLength - currentLength;
                            nodeObject.totalChars += lengthDelta;

                            nodeContentList[j] = interpolatedContent;
                        }
                    }
                }

                /**
                 * This is the animation function that gets looped in a requestAnimationFrame call.
                 * @param timestamp
                 */
                function tick(timestamp) {
                    var currentIteration, totalIterations, done;

                    if (typeof start === 'undefined') {
                        start = timestamp;
                    }
                    elapsed = timestamp - start;

                    totalIterations = Math.round(duration / 1000 * 60);
                    currentIteration = Math.round(elapsed / 1000 * 60);
                    done = typeTextNodesText(textNodes, currentIteration, totalIterations);

                    if (elapsed < duration && !done) {
                        window.requestAnimationFrame(tick);
                    } else {
                        $timeout(function() {
                            removeCaret(element);
                        }, removeCaretAfter);
                        // reset
                        start = undefined;
                    }
                }
            }
        };
    }]);

})();