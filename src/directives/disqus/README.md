# Disqus Directive

A directive to embed a Disqus comments widget on your AngularJS page.

## Prerequisites

This directive will only work if your Angular app is configured in one of the following ways:

 - HTML5 mode. This is done by setting `$locationProvider.html5Mode(true)` in your module's config block. Disqus is able to correctly distinguish between separate pages when in html5 mode, since each page has a fully unique URL.
 - Using hashbang (`#!`) URLs. This is done by setting `$locationProvider.hashPrefix('!')` in your module's config block. This is required if you aren't using html5 mode as above, due to a limitation imposed by Disqus. See http://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites

Setting up as above will ensure that Disqus is able to correctly distinguish between separate pages, without showing the same comments on every single page of your app.
By default, Angular does not use html5 mode, and also has no hashPrefix set, so you'll have to do one of the above set-up actions in order to use this directive. As far as I know, there is no way to get it to work with
the default hash-only (no `!`) urls that Angular uses.

## Usage

First, put the directive code in your app, wherever you store your directives.

Wherever you want the Disqus comments to appear, add the following to your template:

```html
<dir-disqus disqus-shortname="YOUR_DISQUS_SHORTNAME"
         disqus-identifier="{{ identifier }}"
         disqus-url="{{ url }}">
</dir-disqus>
```

The attributes given above are all required. The inclusion of the identifier and URL ensure that identifier conflicts will not occur. See http://help.disqus.com/customer/portal/articles/662547-why-are-the-same-comments-showing-up-on-multiple-pages-

If the identifier and URL and not included as attributes, the directive will throw an exception.

You can optionally specify the other configuration variables by including the as attributes
on the directive's element tag. For more information on the available config vars, see the
[Disqus docs](http://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables).

Note that in the tag, the config attribute names are separated with a hyphen rather
than an underscore (to make it look more HTML-like).



## `ready-to-bind` attribute

If you are loading the page asynchronously, the model data (`$scope.article` in the above example) used to populate the config variables above
will probably not be defined at the time the page is loaded. This will result in your config settings
being all undefined. To get around this, you can specify a scope variable that should be set to (or evaluate to) `false`
until your data is loaded, at which point you can set it to `true`. The directive watches this property and once it changes
to `true`, any config attributes which are bound to your model should be available and used to load up the Disqus widget.

For example:

```JavaScript
// simple example of controller loading async data
function myController($scope, $http) {
    $scope.contentLoaded = false;

    $http.get('api/article/1').then(function(result) {
        $scope.article = result.article;
        $scope.contentLoaded = true; // this tells the directive that it should load the Disqus widget now
    })
}
```
```html
// in your view code
<dir-disqus disqus-shortname="YOUR_DISQUS_SHORTNAME"
            disqus-identifier="{{ article.id }}"
            disqus-url="{{ article.url }}"
            ready-to-bind="{{ contentLoaded }}">
</dir-disqus>
```

 If you omit the `ready-to-bind` attribute, the Disqus widget will be created immediately. This is okay so long as
 rely on interpolated data which is not available on page load.