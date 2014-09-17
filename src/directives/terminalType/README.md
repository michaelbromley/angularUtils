# Terminal Type Directive

This is a directive that creates an effect akin to text being typed into a computer terminal.

It probably has pretty limited applications in the real world, but I spent a bit of time working on
the code for a re-design of my personal site, so I thought it would be worth releasing for others to use.

## Demo

http://plnkr.co/edit/Mct3QE?p=preview

## Installation

1. Download the [dirTerminalType.js file](https://raw.githubusercontent.com/michaelbromley/angularUtils/master/src/directives/terminalType/dirTerminalType.js)
and include it in your AngularJS project.

2. Include the module `angularUtils.directives.dirTerminalType` as a dependency for your app.

3. Include the contents of [dirTerminalType.css](https://raw.githubusercontent.com/michaelbromley/angularUtils/master/src/directives/terminalType/dirTerminalType.css) in your project, either by just copying the contents
into an existing style sheet (since it is so small), or including the file as an external link.

## Usage

The directive can be added as an attribute to any existing element:

```HTML

<ANY dir-terminal-type
    [duration=""]
    [start-typing=""]
    [force-caret]
    [on-completion=""]
    [remove-caret=""] >
    ...
</ANY>
```

* **`duration`** Optionally specify the length of time in milliseconds it takes to type out the contents of this element.
Default is 1000.

* **`start-typing`** Optionally specify an expression which, when it evaluates to `true`, will trigger the typing effect.
Until it evaluates to `true`, the typing will not start. Default behaviour when this attribute is not present
it to start typing immediately.

* **`force-caret`** If you are using the `start-typing` attribute, by default the element's caret will not be displayed until
typing commences. Using `force-caret` forces the caret to be added as soon as the page loads, and the caret will just sit there
blinking until `start-typing` becomes true.

* **`on-completion`** Optionally provide an expression or method to evaluate once the text has finished being typed. Useful for
chaining elements together by setting a boolean value in the `on-completion` of the first element, which is then used in the
`start-typing` attribute on the second.

* **`remove-caret`** Optionally specify the delay in milliseconds after which the caret will be removed (counting from once the typing has
completed). Defaults to 1000.
