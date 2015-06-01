# jQuiteLight
jQuery Smart Search Query Highlight Plugin

##Usage
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

##Options
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

`markCss`
Type: Object  
Default: `{}`  
Css properties to be applied for wrapper.