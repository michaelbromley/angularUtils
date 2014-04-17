# uiBreadcrumbs Directive

This is a directive that auto-generates breadcrumbs based on angular-ui-router routes.

## Requirements

This directive is designed to work with [angular-ui-router](https://github.com/angular-ui/ui-router), and will not work with the default Angular router.

The design of the directive also relies on the use of nested states in order to auto-generate the breadcrumbs hierarchy. See more on nested states here:
[https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data)
Note that the use of nested states does not imply nested *views*. Often, in a usual breadcrumbs use case, you won't want to have to nest a new view each time you go down the breadcrumb trail. To avoid using
nested views, you should use a named view and refer to it when configuring your states. See the [demo](http://plnkr.co/edit/bBgdxgB91Z6323HLWCzF?p=preview) and the example below for an idea of how this would work.

## Usage

Assuming you already have your app configured to use ui-router, you then need to put this directive somewhere and use it like so:

    <ui-breadcrumbs displayname-property="data.displayName"></ui-breadcrumbs>

The `displayname-property` attribute must point to some property on your state config object that contains the string you wish to display as the
route's breadcrumb. If none is specified, or if the specified property is not found, the directive will default to displaying the route's name.

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

## Demo

You can see a working demo that demonstrates all of the above here: [http://plnkr.co/edit/bBgdxgB91Z6323HLWCzF?p=preview](http://plnkr.co/edit/bBgdxgB91Z6323HLWCzF?p=preview)

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