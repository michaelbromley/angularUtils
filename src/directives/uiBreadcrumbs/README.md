# uiBreadcrumbs Directive

This is a directive that auto-generates breadcrumbs based on angular-ui-router routes.

**No longer maintained** (July 2016) I am no longer using this  in any of my projects. As such, I have no time to maintain it. Pull requests for fixes and features are welcome. If someone would like to maintain a fork, let me know and I will link to it here.

## Demo

You can see a working demo demonstrating most of the features here: [http://plnkr.co/edit/bBgdxgB91Z6323HLWCzF?p=preview](http://plnkr.co/edit/bBgdxgB91Z6323HLWCzF?p=preview)

## Requirements

This directive is designed to work with [angular-ui-router](https://github.com/angular-ui/ui-router), and will not work with the default Angular router.

The design of the directive also relies on the use of nested states in order to auto-generate the breadcrumbs hierarchy. See more on nested states here:
[https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data)
Note that the use of nested states does not imply nested *views*. Often, in a usual breadcrumbs use case, you won't want to have to nest a new view each time you go down the breadcrumb trail. To avoid using
nested views, you should use a named view and refer to it when configuring your states. See the [demo](http://plnkr.co/edit/bBgdxgB91Z6323HLWCzF?p=preview) and the example below for an idea of how this would work.

## Installation

### 1. Download
You can install with Bower or npm:

`bower install angular-utils-ui-breadcrumbs`
`npm install angular-utils-ui-breadcrumbs`

Alternatively just download the files `uiBreadcrumbs.js` and `uiBreadcrumbs.tpl.html`. Using bower has the advantage of making version management easier.

### 2. Include in your app

Make sure the file `uiBreadcrumbs.js` is being loaded in your app, and that the template file is available somewhere (see the next section for how to configure the path to the template).

Declare the dependency in your Angular module:

```JavaScript
angular.module('myApp', ['angularUtils.directives.uiBreadcrumbs']);
```

## Usage

Assuming you already have your app configured to use ui-router, you then need to put this directive somewhere and use it like so:

```HTML
<ui-breadcrumbs displayname-property="data.displayName"
                [template-url=""]
                [abstract-proxy-property=""]>
</ui-breadcrumbs>
```

* **`displayname-property`** (required) This attribute must point to some property on your state config object that contains the string you wish to display as the
route's breadcrumb. If none is specified, or if the specified property is not found, the directive will default to displaying the route's name.
* **`template-url`** (optional) Use this attribute to specify the URL of the `uiBreadcrumbs.tpl.html` file. Alternatively this may be configured in the JavaScript file
itself, in which case this attribute would not be needed.
* **`abstract-proxy-property`** (optional) Used when working with abstract states. See the section on working with abstract states below for a full explanation.

## Example setup

He is an example that illustrates the main features of the directive:

```JavaScript
angular.module('yourModule').config(function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'content@': {
                    templateUrl: ...
                }
            },
            data: {
                displayName: 'Home'
            }
        })
        .state('home.usersList', {
            url: 'users/',
            views: {
                'content@': {
                    templateUrl: ...
                }
            },
            data: {
                displayName: 'Users'
            }
        })
        .state('home.userList.detail', {
            url: ':id',
            views: {
                'content@': {
                    templateUrl: ...
                }
            },
            data: {
                displayName: '{{ user.firstName }} {{ user.lastName | uppercase }}'
            }
            resolve: {
                user : function($stateParams, userService) {
                    return userService.getUser($stateParams.id);
                }
            }
        })
        .state('home.userList.detail.image', {
            views: {
                'content@': {
                    templateUrl: ...
                }
            },
            data: {
                displayName: false
            }
        })
```

```html
// in the app template somewhere
<ui-breadcrumbs displayname-property="data.displayName"></ui-breadcrumbs>
<div ui-view="content"></div>
```

The first two states are straightforward. The property specified in the `displayname-property` attribute can be seen
to exist in the config object, the value of which is a string with the name we want to display in the breadcrumb.

The third state illustrates how we can use a resolved value as our breadcrumb display name. This is done by using the
regular Angular interpolation syntax `{{ value }}`. In this case, `user` corresponds to the `resolve` function that is using our
imaginary `userService` to asynchronously grab an object containing the details of the current user. You can also see that, just like in any Angular interpolation
string, you can reference properties of objects, use filters and so on.

The fourth state illustrates that if we don't want a state to show up in the breadcrumbs, we should set the
 display name to `false`.

## Working With Abstract States

AngularUI Router provides the option of setting up [abstract states](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#abstract-states), which
by definition cannot be transitioned to. Therefore, we cannot show them in the breadcrumbs, as clicking on an abstract state would cause the router to try
to transition to that state, which results in an exception.

Therefore, the default behaviour is to ignore abstract states and skip that level of the breadcrumb hierarchy.

However, in many cases this behaviour would not be desirable. Consider the following setup (taken from the ui-router docs):

```JavaScript
$stateProvider
    .state('contacts', {
        abstract: true,
        url: '/contacts',

        // Note: abstract still needs a ui-view for its children to populate.
        // You can simply add it inline here.
        template: '<ui-view/>'
    })
    .state('contacts.list', {
        // url will become '/contacts/list'
        url: '/list'
        //...more
    })
    .state('contacts.detail', {
        // url will become '/contacts/detail'
        url: '/detail',
        //...more
    })
```

In this case, if we were in the `contacts.detail` state, the breadcrumbs would only display that state and ignore the parent state as it
is abstract. What we really want to do is substitute the `contacts.list` state for the parent state. This is because, logically, the
list of contacts is one level up from the detail page, even though they are strictly at the same level in the $state definition.

In order to achieve this substitution, we can use the `abstract-proxy-property` attribute on our directive. This tells the directive
to look for the specified property on the state config object, where it should find the name of the state to use instead of the abstract state.

To implement this, we would modify the above example to look like this:

```JavaScript
$stateProvider
    .state('contacts', {
        abstract: true,
        url: '/contacts',
        template: '<ui-view/>'
        data: {
            breadcrumbProxy: 'contacts.list'
        }
    })
    .state('contacts.list', {
        url: '/list'
        //...more
    })
    .state('contacts.detail', {
        url: '/detail',
        //...more
    })
```

The directive element would then look like this:

```HTML
<ui-breadcrumbs displayname-property="data.displayName" abstract-proxy-property="data.breadcrumbProxy"></ui-breadcrumbs>
```

Now, when we are in the `contacts.detail` state, the breadcrumbs will show the `contacts.list` as the immediate parent,
rather than the abstract `contacts` state.

## Styling
The template structure is based on the [Bootstrap 3 breadcrumbs component](http://getbootstrap.com/components/#breadcrumbs), so it
includes an `active` class to signify the current (left-most) item in the breadcrumbs list. You can, of course, modify the template as needed
or simply define your own CSS to fit it with your app's style.

## Note on the `data` object
A potential "gotcha" is the fact that the `data` object gets inherited by child states ([see docs here](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data)).
If you want to avoid this behaviour, don't use the `data` object to define your breadcrumb's `displayname-property`. Use another property on the `.state()` config object instead.

## Credits
I used some ideas and approaches from the following sources:

- [http://stackoverflow.com/a/22263990/772859](http://stackoverflow.com/a/22263990/772859)
- [http://milestone.topics.it/2014/03/angularjs-ui-router-and-breadcrumbs.html](http://milestone.topics.it/2014/03/angularjs-ui-router-and-breadcrumbs.html)
