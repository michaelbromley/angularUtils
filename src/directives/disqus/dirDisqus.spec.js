xdescribe('dirDiqus directive', function() {
    var scope,
        elem,
        compiled,
        html;

    beforeEach(module('angularUtils.directives.dirDisqus'));
    beforeEach(function (){
        //set our view html.
        html = '<dir-disqus disqus-shortname="shortname" ' +
                           'disqus-identifier="{{ post.ID }}"' +
                           'disqus-title="{{ post.title }}"' +
                           'disqus-url="{{ post.link }}"' +
                           'disqus-category-id="{{ post.catId }}"' +
                           'disqus-disable-mobile="false"' +
                           'ready-to-bind="{{ loaded }}">' +
                '</dir-disqus>';

        inject(function($compile, $rootScope) {
            //create a scope and populate it
            scope = $rootScope.$new();
            scope.post = {
                ID: 123,
                title: 'test title',
                link: 'http://www.test.com',
                catId: 999
            };
            scope.loaded = false;

            //get the jqLite or jQuery element
            elem = angular.element(html);

            //compile the element into a function to process the view.
            compiled = $compile(elem);

            //run the compiled view.
            compiled(scope);

            //call digest on the scope!
            scope.$digest();
        });
    });

    it('should not do anything when ready to bind is false', function() {
        expect(elem.find("#disqus_thread")).toBeTruthy();
        expect($("script[src='//shortname.disqus.com/embed.js']").length).toEqual(0);
        expect(window.disqus_shortname).toBeFalsy();
        expect(window.disqus_identifier).toBeFalsy();
        expect(window.disqus_title).toBeFalsy();
        expect(window.disqus_url).toBeFalsy();
        expect(window.disqus_category_id).toBeFalsy();
        expect(window.disqus_disable_mobile).toBeFalsy();
    });

    it('should activate when ready to bind is true', function() {
        scope.loaded = true;
        scope.$digest();
        expect($("script[src='//shortname.disqus.com/embed.js']").length).toEqual(1);
        expect(window.disqus_shortname).toEqual('shortname');
        expect(window.disqus_identifier).toEqual('123');
        expect(window.disqus_title).toEqual('test title');
        expect(window.disqus_url).toEqual('http://www.test.com');
        expect(window.disqus_category_id).toEqual('999');
        expect(window.disqus_disable_mobile).toEqual('false');
    });
});