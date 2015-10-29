/**
 *
 * jQuery Smart Search Query Highlight Plugin
 *
 * @author iamwebdesigner <iamawebgeek@gmail.com>
 * @license Apache License Version 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * @version 2.1.0
 */
(function (factory) {

	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		// Node.JS
		factory(require("jquery"));
	} else {
		// Browser
		factory(window.jQuery);
	}

})(function ($) {
	var
		Marker = function (element, options, query) {
			this.options = $.extend({}, Marker.DEFAULTS, options);
			this.normalizeNodes(element);
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
		deepExtend = function (baseObject, objectToExtend) {
			for (var property in objectToExtend) {
				if (objectToExtend.hasOwnProperty(property)) {
					if ($.isPlainObject(objectToExtend[property]) && $.isPlainObject(baseObject[property])) {
						baseObject[property] = deepExtend(baseObject[property] || {}, objectToExtend[property]);
					} else {
						baseObject[property] = objectToExtend[property];
					}
				}
			}
			return baseObject;
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
		mark = $.fn.mark,
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
		}
	};

	Marker.prototype.smartBehavior = function (string) {
		return new RegExp("[^\\W]*" + escape(string) + "[^\\W]*", this.options.ignoreCase ? "gi" : "g");
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
		this.normalizeNodes(this.$el.get(0));
	};

	Marker.prototype.normalizeNodes = function (element) {
		if (element.normalize) {
			element.normalize();
		}
	};

	Marker.prototype.wrapString = function (content) {
		dump = $("<" + this.options.markTag + "/>", this.options.markData);
		dump.append(content);
		this.marks.push(dump);
		this.options.afterMark.call(dump);
		return dump;
	};

	Marker.prototype.smartBehaviorMatchLogic = function (currentMatch) {
		if (!this.baseQuery)
			return false;
		var
			queryLength = this.baseQuery.length,
			matchLength = currentMatch.length;
		return !(queryLength < 3 && matchLength == matchLength);
	};

	Marker.prototype.mark = function (node) {
		var
			next = function (index, innerNode) {
				var nextElement = $(innerNode).siblings().get(index);
				if (nextElement !== undefined && nextElement.nextSibling !== null)
					nodeWalker.call(this, index + 1, nextElement.nextSibling);
			},
			nodeWalker = function (index, innerNode) {
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
									next.call(this, index, innerNode);
								}
							}
						} else {
							if (this.options.beforeMark(this.query)) {
								split = innerNode.splitText(this.queryPosition(innerNode.textContent));
								split.splitText(this.query.length);
								split.parentNode.replaceChild(this.wrapString($(split).clone()).get(0), split);
								next.call(this, index, innerNode);
							}
						}
					}
				} else if (
					innerNode.nodeType === 1 &&
					innerNode.childNodes.length > 0 &&
					$.inArray(innerNode.tagName, this.options.skippedTags) === -1) {
					this.mark(innerNode);
				}
			};
		$.each(node.childNodes, $.proxy(nodeWalker, this));
	};

	$.fn.mark = function (query, settings) {
		if (!$.trim(query) || this.text().trim() === "")
			return this;

		return this.each(function () {
			if ($.isArray(query)) {
				return $.each(query, $.proxy(function (index, element) {
					var currentSettings = settings,
						query = element;
					if ($.isPlainObject(element) && element.query) {
						query = element.query;
						delete element.query;
						currentSettings = deepExtend(settings, element);
					}
					$(this).mark(query, currentSettings);
				}, this));
			}

			var data = $(this).data("marker");
			if (data === undefined)
				data = [];
			data.push(new Marker(this, settings, query));
			$(this).data("marker", data);
		});
	};

	$.fn.mark.Marker = Marker;

	$.fn.mark.noConflict = function () {
		$.fn.mark = mark;
		return this;
	};

});