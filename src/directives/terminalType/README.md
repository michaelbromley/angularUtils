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
    [remove-caret=""] >
    ...
</ANY>
```

* **`duration`** Optionally specify the length of time in milliseconds it takes to type out the contents of this element.
Default is 1000.

* **`start-typing`** Optionally specify an expression which, when it evaluates to `true`, will trigger the typing effect.
Until it evaluates to `true`, the typing will not start. Default behaviour when this attribute is not present
it to start typing immediately.

* **`remove-caret`** Optionally specify the delay in milliseconds after which the caret will be removed (counting from once the typing has
completed). Defaults to 1000.
