
describe('dirTerminalType directive', function() {

    var $compile;
    var $scope;
    var $timeout;
    var containingElement;

    beforeEach(module('angularUtils.directives.dirTerminalType'));

    beforeEach(inject(function($rootScope, _$compile_, _$timeout_) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        $scope = $rootScope.$new();
        containingElement = angular.element('<div></div>');
    }));

    function compile(text, duration, removeCaret, startTyping) {
        var html;

        duration = duration ? 'duration="' + duration + '"' : '';
        removeCaret = removeCaret ? 'remove-caret="' + removeCaret + '"' : '';
        startTyping = startTyping ? 'start-typing="' + startTyping + '"' : '';

        html = '<p dir-terminal-type ' + duration + ' ' + removeCaret + ' ' + startTyping + ' >' + text + '</p>';
        containingElement.append($compile(html)($scope));
        $scope.$apply();
    }

    it('should initially remove the contents', function() {
        var text = 'Hello, this is some text!';
        compile(text, 200);

        expect(containingElement.text()).toEqual('');
    });

    it('should type complete text of simple element', function(done) {
        var text = 'Hello, this is some text!';
        compile(text, 200);

        setTimeout(function() {
            expect(containingElement.html()).toContain(text);
            done();
        }, 250);
    });

    it('should type half the text at halfway through duration', function(done) {
        var text = 'Hello, this is some text!';
        compile(text, 200);

        setTimeout(function() {
            expect(containingElement.html()).toContain(text.substring(0, Math.floor(text.length / 2) - 2));
            expect(containingElement.html()).not.toContain(text);
            done();
        }, 100);
    });

    it('should add a caret to the element', function(done) {
        var text = 'Hello, this is some text!';
        compile(text);

        setTimeout(function() {
            expect(containingElement.find('.caret').length).toEqual(1);
            done();
        }, 50);
    });

    it('should hide the caret until typing begins by default if typing has not started', function() {
        compile('hello', 100, 100, 'false');

        expect(containingElement.find('.caret').length).toEqual(0);
    });

    it('should show the caret when force-caret is used, even if typing has not started', function() {
        var html = '<p dir-terminal-type duration="100" start-typing="false" force-caret>message: {{ myText }}</p>';
        containingElement.append($compile(html)($scope));
        $scope.$apply();

        expect(containingElement.find('.caret').length).toEqual(1);
    });

    it('should remove the caret after the specified time', function(done) {
        var text = 'Hello, this is some text!';
        compile(text, 100, 100);

        setTimeout(function() {
            $timeout.flush();
            expect(containingElement.find('.caret').length).toEqual(0);
            done();
        }, 200);
    });

    it('should handle child elements with text content', function(done) {
        var text = 'No! I <em>don\'t</em> want to visit <a href="www.google.com">google.com</a>';
        compile(text, 200);

        setTimeout(function() {
            expect(containingElement.html()).toContain(text);
            done();
        }, 250);
    });

    it('should interpolate simple text content', function(done) {
        $scope.myValue = "This is an interpolated string!";
        compile('{{ myValue }}', 200);

        setTimeout(function() {
            expect(containingElement.html()).toContain($scope.myValue);
            done();
        }, 250);
    });

    it('should interpolate complex nested content', function(done) {
        $scope.rap = {
            location: 'West Philadelphia',
            action1: 'born',
            action2: 'raised'
        };

        compile('In <em>{{ rap.location }}</em> <ul><li>{{ rap.action1 }}</li><li> and {{ rap.action2 }}</li></ul>', 200);

        setTimeout(function() {
            expect(containingElement.text()).toContain('In West Philadelphia born and raised');
            done();
        }, 250);
    });

    it('should not start typing if the start-typing attribute is set and evals to false', function(done) {
        compile('hello', 100, 100, 'false');

        setTimeout(function() {
            expect(containingElement.text()).toEqual('');
            done();
        }, 250);
    });

    it('should start typing when the start-typing attribute is set and evals to true', function(done) {
        compile('hello', 100, 100, 'myVal');
        $scope.$apply(function() {
            $scope.myVal = true;
        });

        setTimeout(function() {
            expect(containingElement.text()).toEqual('hello');
            done();
        }, 250);
    });

    it('should work when the element starts off hidden', function(done) {
        var html = '<p dir-terminal-type duration="100" ng-show="myText" start-typing="myText" >message: {{ myText }}</p>';
        containingElement.append($compile(html)($scope));
        $scope.$apply();

        expect(containingElement.text()).toEqual('');

        $scope.$apply(function() {
            $scope.myText = 'hello';
        });

        expect(containingElement.text()).toEqual('');

        setTimeout(function() {
            expect(containingElement.text()).toEqual('message: hello');
            done();
        }, 250);
    });

    it('should fire a callback if specified by on-completion', function(done) {
        $scope.myMethod = function() {};

        var html = '<p dir-terminal-type duration="100" on-completion="myMethod()">message: {{ myText }}</p>';
        containingElement.append($compile(html)($scope));
        $scope.$apply();

        spyOn($scope, 'myMethod');

        setTimeout(function() {
            expect($scope.myMethod).toHaveBeenCalled();
            done();
        }, 250);
    });

    it('should execute an expression if specified by on-completion', function(done) {
        var html = '<p dir-terminal-type duration="100" on-completion="myVal = \'foo\'">message: {{ myText }}</p>';
        containingElement.append($compile(html)($scope));
        $scope.$apply();

        setTimeout(function() {
            expect($scope.myVal).toEqual('foo');
            done();
        }, 250);
    });

    it('should work with multiple elements at the same time', function(done) {
        compile('will', 100);
        compile('smith', 100);

        setTimeout(function() {
            expect(containingElement.children().eq(0).text()).toEqual('will');
            expect(containingElement.children().eq(1).text()).toEqual('smith');
            done();
        }, 250);
    });
});