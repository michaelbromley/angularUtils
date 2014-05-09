# Pagination Directive

## Another one?

Yes, there are quite a few pagination solutions for Angular out there already, but what I wanted to do was make
something that would be truly plug-n-play - no need to do any set-up or logic in your controller. Just add
an attribute, drop in your navigation wherever you like, and boom - instant, full-featured pagination.

## Example

Let's say you have a collection of items on your controller's `$scope`. Often you want to display them with
the `ng-repeat` directive and then paginate the results if there are too many to fit on one page. This is what this
module will enable:

```HTML
<ul>
    <li dir-paginate="item in items | itemsPerPage: 10">{{ item }}</li>
</ul>

// then somewhere else on the page ....

<dir-pagination-controls></dir-pagination-controls>
```

...and that's literally it.

## Usage

First you need to include the module in your project, and make sure that the `templateUrl` is pointing to the
correct location of the `dirPagination.tpl.html` file.

```HTML
<ANY
    dir-paginate="expression | itemsPerPage: (int|expression)">
    ...
    </ANY>
...
<dir-pagination-controls
    [max-size=""]
    [direction-links=""]
    [boundary-links=""]>
    </dir-pagination-controls>
```

* **`expression`** Under the hood, this directive delegates to the `ng-repeat` directive, so the syntax for the
expression is exactly as you would expect. [See the ng-repeat docs for the full rundown](https://docs.angularjs.org/api/ng/directive/ngRepeat).
This means that you can also use any kind of filters you like, etc.

* **`itemsPerPage`** The `expression` **must** include this filter. It is required by the pagination logic. The syntax
is the same as any filter: `itemsPerPage: 10`, or you can also bind it to a property of the $scope: `itemsPerPage: pageSize`.

* **`max-size`** (optional, default = 9) Specify a maximum number of pagination links to display. The default is 9, and
the minimum is 5 (setting a lower value than 5 will not have an effect).

* **`direction-links`** (optional, default = true) Specify whether to display the "forwards" & "backwards" arrows in the
pagination.

* **`boundary-links`** (optional, default = false) Specify whether to display the "start" & "end" arrows in the
pagination.

## Demo

[Here is a working demo on Plunker](http://plnkr.co/edit/Wtkv71LIqUR4OhzhgpqL?p=preview) which demonstrates some cool features such as live-binding the "itemsPerPage" and
filtering of the collection.

## Styling

I've based the pagination navigation on the Bootstrap 3 component, so if you use Bootstrap in your project,
you'll get some nice styling for free. If you don't use Bootstrap, it's simple to style the links with css.

## Credits

I did quite a bit of research before I figured I needed to make my own directive, and I picked up a lot of good ideas
from various sources:

* Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ. This is where I learned how to
delegate to the ng-repeat directive from within my own, and I used some of the code he gives here.

* AngularUI Bootstrap: https://github.com/angular-ui/bootstrap. I used a few ideas, and a couple of attribute names,
from their pagination directive.

* StackOverflow: http://stackoverflow.com/questions/10816073/how-to-do-paging-in-angularjs. Picked up a lot of ideas
from the various contributors to this thread.