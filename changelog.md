# CHANGELOG

## v2.1.0
### Changes
- Deprecated in 2.0 property `markCss` has been removed 
### Features
- Installation via bower
### Fixes
- Query string is now escaped when used with `useSmartBehavior` property

## v2.0.0
### Changes
- When object with property `query` is passed as `<string|RegExp|number|object>` to highlight, its value would be used to be highlighted. Other properties are combined with the plugin settings. In the previous versions such objects were converted to string using `toString` method
- Deprecated property `markCss`. Use css classes instead

## v1.2.0
### Features
- noConflict support (see Usage section in readme)
- Linked the plugin to jQuery method

## v1.1.0
### Features
- Support for Node.js
- Installation via npm