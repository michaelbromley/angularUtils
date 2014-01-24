# Disqus Directive

A directive to embed a Disqus comments widget on your AngularJS page.

## Usage

First, put the directive code in your app, wherever you store your directives.

Wherever you want the Disqus comments to appear, add the following to your template:

`<dir-disqus disqus-shortname="YOUR_DISQUS_SHORTNAME"></dir-disqus>`

The only required attribute is `disqus-shortname`.

You can optionally specify the other configuration variables by including the as attributes
on the directive's element tag. For more information on the available config vars, see the
[Disqus docs](http://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables).

Note that in the tag, the config attribute names are separated with a hyphen rather
than an underscore (to make it look more HTML-like):

     <dir-disqus disqus-shortname="YOUR_DISQUS_SHORTNAME"
            disqus-identifier="{{ article.id }}"
            disqus-title="{{ article.title }}"
            ...>
     </dir-disqus>


## `ready-to-bind` attribute

If you are loading the page asynchronously, the model data (`$scope.article` in the above example) used to populate the config variables above
will probably not be defined at the time the page is loaded. This will result in your config settings
being all undefined. To get around this, you can specify a scope variable that should be set to (or evaluate to) `false`
until your data is loaded, at which point you can set it to `true`. The directive watches this property and once it changes
to `true`, any config attributes which are bound to your model should be available and used to load up the Disqus widget.

For example:

    // simple example of controller loading async data
    function myController($scope, $http) {
        $scope.contentLoaded = false;

        $http.get('api/article/1').then(function(result) {
            $scope.article = result.article;
            $scope.contentLoaded = true; // this tells the directive that it should load the Disqus widget now
        })
    }

    // in your view code
    <dir-disqus disqus-shortname="YOUR_DISQUS_SHORTNAME"
                disqus-identifier="{{ article.id }}"
                ready-to-bind="{{ contentLoaded }}">
    </dir-disqus>


 If you omit the `ready-to-bind` attribute, the Disqus widget will be created immediately. This is okay so long as
 rely on interpolated data which is not available on page load.