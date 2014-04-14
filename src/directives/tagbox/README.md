# Tagbox Directive

This directive adds Twitter-like suggestion and autocompletion of tags in an `<input>` or `<textarea>` element.

## Demo

[http://plnkr.co/edit/9Mwed1W7dIrG6kSbbQSF?p=preview](http://plnkr.co/edit/9Mwed1W7dIrG6kSbbQSF?p=preview)

## Usage

The directive is invoked by adding `dir-tagbox` to the input element. The directive attribute takes one argument which must be an array of strings, which are the tags for auto-suggestion.

You may also optionally specify the character that is used as a prefix to your tags, such as `#` if you are aiming for hashtag functionality. This is done by adding the `dir-tagtoken` attribute.

```JavaScript
// in your controller
$scope.tags = datastore.getAllTags(); // let's assume this gets an array or all possible tags from the server.
```
```html
// in your template
<input type="text" dir-tagbox="tags" dir-tagtoken="#" dir-on-tag-select="myHandler()">
```

In the above example, when the user starts to type `#ca`.., all matching tags will appear in a box below the input.

### Optional Attributes

- `dir-tagtoken`: As mentioned above, this is used to specify the character that signifies the start of a tag. Typical examples are `#` or '@', but any character (or none) can be specified.
- `dir-on-tag-select`: This can be used to specify a callback function which will fire when a tag has been selected from the selections box (either by clicking on it or using the keyboard to select it).
The method specified should exist as a method of the $scope object of your controller. A typical use case would be to add the selected tag to an array upon selection.

## Requirement

The directive as given here makes use of a custom filter of mine - [`startsWith`](https://github.com/michaelbromley/angularUtils/tree/master/src/filters/startsWith). This is needed as the standard Angular `filter` filter matches if your substring appears *anywhere* in the target string, but this is
often undesirable behaviour in this type of application. If you don't want to bother with the `startsWith` filter, just change that line to use the standard Angular `filter` filter. **Note: this filter is now included with the module so it should all work
out of the box.**

## Styling

In order to get the "highlighting" effect in the suggestions box, you'll need to style the `.selected` class. Here is a basic suggested styling, which is used in the demo above.

```css
.dir-tagbox-wrapper {
  // the directive wraps the input element and the suggestions container in a wrapper div to enable proper positioning of the suggestions container.
  // By default it does not need to be styled, but if required, this class can be used to style it.
}
.suggestions-container {
  background-color: rgba(255,255,255,0.95);
  border: 1px solid #999;
  cursor: pointer;
}
.suggestion {
  padding: 3px 10px;
  font-size: 1.1em;
}
.suggestion.selected, .suggestion:hover {
  background-color: #00b3ee;
}
```

## Keyboard Controls
The keyboard can be used to select from the suggestions using the up and down arrow keys. Pressing enter will select that tag and add it to the input, as will clicking a suggestion with the mouse