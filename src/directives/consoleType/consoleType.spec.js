
describe('consoleType directive', function() {

    var $compile;
    var $scope;
    var $timeout;
    var containingElement;

    beforeEach(module('angularUtils.directives.dirConsoleType'));

    beforeEach(inject(function($rootScope, _$compile_, _$timeout_) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        $scope = $rootScope.$new();
        containingElement = angular.element('<div></div>');
    }));

    function compile(text, duration, removeCaret) {
        var html;
        duration = duration || 1000;
        removeCaret = removeCaret || 1000;
        html = '<p dir-console-type duration="' + duration + '" remove-caret="' + removeCaret + '">' + text + '</p>';
        containingElement.append($compile(html)($scope));
        $scope.$apply();
    }

    xit('should type complete text of simple element', function(done) {
        var text = 'Hello, this is some text!';
        compile(text, 200);

        setTimeout(function() {
            expect(containingElement.html()).toContain(text);
            done();
        }, 200);
    });

    xit('should type half the text at halfway through duration', function(done) {
        var text = 'Hello, this is some text!';
        compile(text, 200);

        setTimeout(function() {
            expect(containingElement.html()).toContain(text.substring(0, Math.floor(text.length / 2) - 2));
            expect(containingElement.html()).not.toContain(text);
            done();
        }, 100);
    });

    xit('should add a caret to the element', function() {
        var text = 'Hello, this is some text!';
        compile(text);

        expect(containingElement.find('.caret').length).toEqual(1);
    });

    xit('should remove the caret after the specified time', function(done) {
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
        compile(text, 100);

        setTimeout(function() {
            expect(containingElement.html()).toContain(text);
            done();
        }, 200);
    });

});