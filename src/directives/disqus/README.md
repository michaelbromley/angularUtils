# Disqus Directive

A directive to embed a Disqus comments widget on your AngularJS page.

## Prerequisites

This directive will only work if your Angular app is configured in one of the following ways:

 - HTML5 mode. This is done by setting `$locationProvider.html5Mode(true)` in your module's config block. Disqus is able to correctly distinguish between separate pages when in html5 mode, since each page has a fully unique URL.
 - Using hashbang (`#!`) URLs. This is done by setting `$locationProvider.hashPrefix('!')` in your module's config block. This is required if you aren't using html5 mode as above, due to a limitation imposed by Disqus. See http://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites

Setting up as above will ensure that Disqus is able to correctly distinguish between separate pages, without showing the same comments on every single page of your app.
By default, Angular does not use html5 mode, and also has no hashPrefix set, so you'll have to do one of the above set-up actions in order to use this directive. As far as I know, there is no way to get it to work with
the default hash-only (no `!`) urls that Angular uses.

## Installation

1. Download the file `dirDisqus.js` or use the Bower command `bower install angular-utils-disqus`
2. Include the JavaScript file in your index.html page.
2. Add a reference to the module `angularUtils.directives.dirDisqus` to your app.

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

## Full API

You can optionally specify the other configuration variables by including the as attributes
on the directive's element tag. For more information on the available config vars, see the
[Disqus docs](http://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables).

```HTML
<dir-disqus disqus-shortname="YOUR_DISQUS_SHORTNAME"
            disqus-identifier="{{ post.ID }}"
            disqus-title="{{ post.title }}"
            disqus-url="{{ post.link }}"
            disqus-category-id="{{ post.catId }}"
            disqus-disable-mobile="false"
            disqus-config-language="{{ post.lang }}"
            disqus-remote-auth-s3="{{remote_auth_s3}}"
            disqus-api-key="{{public_api_key}}"
            disqus-on-ready="ready()"
            ready-to-bind="{{ loaded }}"
            >
</dir-disqus>
```

If using the `disqus-config-language` setting, please see [this Disqus article on multi-lingual websites](https://help.disqus.com/customer/portal/articles/466249-multi-lingual-websites)
for which languages are supported.

## `disqus-remote-auth-s3 and disqus-api-key` attributes for SSO
If using the `disqus-remote-auth-s3 and disqus-api-key` setting, please see [Integrating Single Sign-On](https://help.disqus.com/customer/portal/articles/236206#sso-script)
to know how to generate a remote_auth_s3 and public_api_key.

note:Single Sign-on (SSO) allows users to sign into a site and be able to use Disqus Comments without having to re-authenticate Disqus. SSO will create a site-specific user profile on Disqus, in a way that will prevent conflict with existing Disqus users.


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

If you omit the `ready-to-bind` attribute, the Disqus widget will be created immediately. This is okay so long as you don't rely on interpolated data which is not available on page load.

## `disqus-on-ready` attribute

 If Disqus is rendered, `disqus-on-ready` function will be called. Callback is registered to disqus by similar technique
 as explained in [this post](https://help.disqus.com/customer/portal/articles/466258-capturing-disqus-commenting-activity-via-callbacks).
