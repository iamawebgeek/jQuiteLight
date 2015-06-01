/*!
 *
 * jQuery Smart Search Query Highlight Plugin
 *
 * @author iamwebdesigner batkamolodec@gmail.com
 * @license Apache License Version 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
 

(function ($) {

	if (!$)
		throw new Error("jQuery library must be loaded first");

	var
		Marker = function (element, options, query) {
			this.options = $.extend({}, Marker.DEFAULTS, options);
			this.$el = $(element);
			validate(this.options, this.$el);
			this.marks = [];
			this.isRegex = false;
			this.baseQuery = false;
			if (query instanceof RegExp) {
				this.query = query;
				this.isRegex = true;
			} else {
				if (this.options.useSmartBehavior) {
					this.baseQuery = query.toString();
					this.query = this.smartBehavior(query);
					this.isRegex = true;
				} else {
					query = query.toString();
					this.query = this.options.ignoreCase ? query.toLowerCase() : query;
				}
			}
			this.mark(element);
		},
		validate = function (settings, elem) {
			if (!/[a-zA-Z0-9]+/.test(settings.markTag))
				$.error("Invalid marking tag!");
			if (!$.isArray(settings.skippedTags))
				$.error("Option skippedTags expected to be an array");
			if (!$.isFunction(settings.afterMark) || !$.isFunction(settings.beforeMark))
				$.error("Options afterMark and beforeMark must be functions");
			if ($.inArray(elem.prop("tagName").toLowerCase(), settings.skippedTags) !== -1)
				$.error("Given element is to be skipped!");
		},
		escape = function escapeRegExp(str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},
		dump,
		split;

	Marker.DEFAULTS = {
		skippedTags: ["script","style"],
		ignoreCase: true,
		escape: false,
		useSmartBehavior: false,
		beforeMark: function (text) { return true; },
		afterMark: function (element) {},
		markTag: "span",
		markData: {
			"class": "marked-text"
		},
		markCss: {}
	};

	Marker.prototype.smartBehavior = function (string) {
		return new RegExp(string + "[a-zA-ZА-Яа-я0-9]*", this.options.ignoreCase ? "gi" : "g");
	};

	Marker.prototype.queryPosition = function (text) {
		if (this.isRegex)
			return text.search(this.query);
		else
			return this.options.ignoreCase ? text.toLowerCase().indexOf(this.query) : text.indexOf(this.query);
	};

	Marker.prototype.destroy = function () {
		$(this.marks).each(function () {
			$(this).replaceWith($(this).html());
		});
	};

	Marker.prototype.wrapString = function (content) {
		dump = $("<" + this.options.markTag + "/>", this.options.markData);
		dump.append(content);
		dump.css(this.options.markCss);
		this.marks.push(dump);
		this.options.afterMark.call(dump);
		return dump;
	};

	Marker.prototype.smartBehaviorMatchLogic = function (currentMatch) {
		return !(this.baseQuery && this.baseQuery.length < 3 && currentMatch > this.baseQuery);
	};

	Marker.prototype.mark = function (node) {
		var nodeWalker = function (index, innerNode) {
			if (innerNode.nodeType === 3) {
				var position = this.queryPosition(innerNode.textContent);
				if (position !== -1) {
					if (this.isRegex) {
						var match = innerNode.textContent.match(this.query)[0];
						if (this.options.beforeMark(match)) {
							if (this.smartBehaviorMatchLogic(match)) {
								split = innerNode.splitText(this.queryPosition(innerNode.textContent));
								split.splitText(match.length);
								split.parentNode.replaceChild(this.wrapString($(split).clone()).get(0), split);
								nodeWalker.call(this,index + 1,$(innerNode).siblings().get(index).nextSibling);
							}
						}
					} else {
						if (this.options.beforeMark(this.query)) {
							split = innerNode.splitText(this.queryPosition(innerNode.textContent));
							split.splitText(this.query.length);
							split.parentNode.replaceChild(this.wrapString($(split).clone()).get(0), split);
							nodeWalker.call(this,index + 1,$(innerNode).siblings().get(index).nextSibling);
						}
					}
				}
			} else if(
				innerNode.nodeType === 1 &&
				innerNode.childNodes.length > 0 &&
				$.inArray(innerNode.tagName, this.options.skippedTags) === -1)
			{
				this.mark(innerNode);
			}
		};
		$.each(node.childNodes, $.proxy(nodeWalker, this));
	};

	$.fn.textOnly = function() {
		return this.clone()
			.children()
			.remove()
			.end()
			.text();
	};

	$.fn.mark = function (query, settings) {
		if (!$.trim(query) || this.text().trim()==="")
			return this;

		return this.each(function () {
			if ($.isArray(query)) {
				return $.each(query, $.proxy(function (index, element) {
					$(this).mark(element, settings);
				}, this));
			}

			var data = $(this).data("marker");
			if (data === undefined)
				data = [];
			data.push(new Marker(this,settings,query));
			$(this).data("marker", data);
		});
	};

})(window.jQuery);