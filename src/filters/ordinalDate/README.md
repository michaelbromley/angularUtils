# Ordinal Date Filter

This is a wrapper filter around the built-in [Angular date filter](http://docs.angularjs.org/api/ng.filter:date),
which adds the facility to display the English ordinal date suffix to the 'day' part of the format string.

## Example

Given the timestamp 1384474920000 (15th November 2013, 00:22:00), and the date format string 'd MMMM yyyy',
the regular Angular date filter will return '15 November 2013'. This filter will return '15th November 2013'. Simple.

## Usage

Include the filter definition somewhere in your Angular app and then use it like any filter:

    {{ 1384474920000 | ordinalDate }}

