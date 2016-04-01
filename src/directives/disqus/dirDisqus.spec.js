/**
 * For some reason, when these tests are run along with all the others in this project, I get a "script error". Running
 * them on their own using `ddescribe` works okay. Therefore this test is ignored in general unless specifically testing
 * this directive, in which case change `xdescribe` to `ddescribe`.
 */
xdescribe('dirDisqus directive', function() {
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
        'disqus-config-language="{{ post.lang }}"' +
        'disqus-on-ready="ready()"' +
        'ready-to-bind="{{ loaded }}">' +
        '</dir-disqus>';

        inject(function($compile, $rootScope) {
            //create a scope and populate it
            scope = $rootScope.$new();
            scope.post = {
                ID: 123,
                title: 'test title',
                link: 'http://www.test.com',
                catId: 999,
                lang: 'en'
            };
            scope.loaded = false;
            scope.readyCalled = false;
            scope.ready = function() {
                scope.readyCalled = true;
            };

            //get the jqLite or jQuery element
            elem = angular.element(html);

            //compile the element into a function to process the view.
            compiled = $compile(elem);

            //run the compiled view.
            var element = compiled(scope);

            var div = document.createElement("div");
            div.innerHTML = element.html();

            // Just add disqus to document - it is needed to work embed.js properly
            document.getElementsByTagName('body')[0].appendChild(div);
        });
    });

    it('should not do anything when ready to bind is false', function() {
        //call digest on the scope!
        scope.$digest();

        expect(elem.find("#disqus_thread")).toBeTruthy();
        expect($("script[src='//shortname.disqus.com/embed.js']").length).toEqual(0);
        expect(window.disqus_shortname).toBeFalsy();
        expect(window.disqus_identifier).toBeFalsy();
        expect(window.disqus_title).toBeFalsy();
        expect(window.disqus_url).toBeFalsy();
        expect(window.disqus_category_id).toBeFalsy();
        expect(window.disqus_disable_mobile).toBeFalsy();
        expect(scope.readyCalled).toBeFalsy();
        expect(window.language).toBeFalsy();
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

        window.page = {};
        window.callbacks = {};
        window.disqus_config();

        expect(window.language).toEqual('en');
        expect(window.callbacks.onReady).toBeDefined();
        expect(window.callbacks.onReady.length).toEqual(1);
        window.callbacks.onReady[0]();
        expect(scope.readyCalled).toBeTruthy();

    });
});