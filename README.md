# jQuiteLight
jQuery Smart Search Query Highlight Plugin

## Features
- Works with Regular Expressions.
- An array of search queries can be applied at once.
- Smart highlight logic is included.
- Additional logic can be applied using `beforeMark` property.
- Each highlight is held separately, so it is easy to remove highlight by index.

## Installation
Installing using node package manager.  
Type the following in your console inside your project directory:  
```
npm install jquitelight
```

If you have [bower](http://bower.io) installed in your pc, you can install the plugin using the command:
```
bower install jquitelight
```

Inline HTML including
```html
<!-- Note: jQuery version should not be less than 1.6 -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js"></script>
<script src="path/to/plugin/jquitelight.js"></script>
```

## Usage
```js

// basic highlighting
$(".element-to-be-highlighted").mark("text to be highlighted here");

// With RegExp
$(".element-to-be-highlighted").mark(new RegExp("/test.{1,2}/"));

// An array of queries
$(".element-to-be-highlighted").mark(["test", "another-test"]);

// Using options
$(".element-to-be-highlighted").mark(["test", "another-test"], {
	markData: {
		"class": "my-highlight"
	},
	ignoreCase: false
});
// To remove highlight use:
// Get array of highlights
var HIGHLIGHTS = $(".element-to-be-highlighted").data("marker");
// Destroy
HIGHLIGHTS[0].destroy();
```

### Resolving plugin conflicts
```js
// if you have another plugin with such jQuery method
// you can get overridden method by using noConflict method
var prevMarkMethod = $.fn.mark.noConflict();
$.fn.mark.myCoolMark = prevMarkMethod;
```

### Making changes into plugin
```js
// starting from version v1.2.0 plugin core object is linked to jQuery method
var plugin = $.fn.mark.Marker,
	oldWrapStringMethod = plugin.prototype.wrapString;
plugin.prototype.wrapString = function (content) {
	console.log(content);
	return oldWrapStringMethod.call(this, content);
}
```

## Advanced usage (tricks)
```js
// starting version 2.0.0
// make some strings inside the text links with specific url
$(".some-content").mark([
	{
		query: "test",
		markData: {
			href: "http://www.example.com/test"
		}
	},
	{
		query: "another-test",
		markData: {
			href: "/under-domain-link"
        }
	},
	{
        query: "strict lower case text",
        ignoreCase: false,
        markData: {
            title: "advanced usage test",
            href: "/strict-lower-case"
        }
    }], {
	markData: {
		"class": "linked"
	},
	markTag: "a",
	ignoreCase: true
});

// excluding some sensitive words from matching when using together with smart behaviour
$(".text-container").mark("each word occurence from this sentence should be highlighted".split(" "), {
	useSmartBehavior: true,
	beforeMark: function (match) {
		// exclude words "bee" and "teach" 
		return match !== "bee" && match !== "teach";	
	}
});
```

## Options
`skippedTags`  
Type: array  
Default: `["script", "style"]`  
Expected an array of strings with HTML tag names that should be skipped on highlighting (in lower case).

`ignoreCase`  
Type: bool  
Default: `true`  
Expected a boolean value for ignoring query matching case.

`useSmartBehavior`  
Type: bool  
Default: `false`  
Expected a boolean value for using `RegExp` extending function for string queries.

`beforeMark`  
Type: Function  
Default: `function (text) { return true; }`  
Function deciding match highlight. Accepts a matched string. Should return a boolean value.
 
`afterMark`  
Type: Function  
Default: `function (element) {}`  
Function for manipulating with highlight. Accepts a jQuery element (wrapper of current match).

`markTag`  
Type: String  
Default: `"span"`  
Name of an HTML tag for wrapping matches.

`markData`  
Type: Object  
Default: `{ "class": "marked-text" }`  
Attributes to be applied for wrapper.