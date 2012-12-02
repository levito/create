//     Create.js - On-site web editing interface
//     (c) 2012 Veit Lehmann
//     Create may be freely distributed under the MIT license.
//     For all details and documentation:
(function ($, undefined) {
	// Run JavaScript in strict mode
	/*global jQuery:false _:false document:false */
	'use strict';

	// # TinyMCE editing widget
	//
	// This widget allows editing textual content areas with the
	// [TinyMCE](http://www.tinymce.com/) rich text editor.

	var $DOC = $(document);

	$DOC.ready(function() {
		var $toolbar = $("<div id='cmsInlineEditToolBar'/>");
		window.toolbar = $toolbar.appendTo("body").get(0);
		var lastId = "";
		var activeEd;
		var activeToolbarHeight = 0;
		window.positionToolbar = function (id) {
			// if editor has changed, show new toolbar and hide others
			if (id != lastId) {
				$(".mceEditor").hide();
				document.getElementById([id, "_parent"].join("")).style.display = "inline";
				activeToolbarHeight = document.getElementById([id, "_tbl"].join("")).clientHeight + 2;
				activeEd = document.getElementById(id);
				lastId = id;
				toolbar.style.left = [activeEd.offsetLeft, "px"].join("");
			}
			// in any case, test if we need to reposition; keep it lightweight, no jQuery!
			if ((window.pageYOffset + activeToolbarHeight > activeEd.offsetTop)
			 && (window.pageYOffset < activeEd.offsetTop + activeEd.clientHeight)) {
				toolbar.style.position = "fixed";
				toolbar.style.top = [activeToolbarHeight, "px"].join("");
			} else {
				toolbar.style.position = "absolute";
				toolbar.style.top = [activeEd.offsetTop, "px"].join("");
			}
		};

		$DOC.on("scroll", function() {
			!!lastId && positionToolbar(lastId);
		});

		$DOC.on("click focus", function(e) {
			if ($(e.target).closest(".mceContentBody, .mceEditor, .mceMenu").length) {
				toolbar.style.visibility = "visible";
			} else {
				toolbar.style.visibility = "hidden";
			}
		});

		// this hack is needed for "object_resizing: true"
		/*$toolbar.on("focus", "*", function(e) {
			$(this).blur();
		});*/

		// fix some default behaviour
		$DOC.on("click", "a .mceContentBody, button .mceContentBody, label .mceContentBody", function(e) {
			e.preventDefault();
		});
	});

	$.widget('Create.tinymceWidget', $.Create.editWidget, {
		enable: function () {
			tinymce.editors.forEach(function(ed) { ed.bodyElement.setAttribute("contenteditable", "true") });
			toolbar.style.display = "block";
			this.options.disabled = false;
		},

		disable: function () {
			tinymce.editors.forEach(function(ed) { ed.bodyElement.setAttribute("contenteditable", "false") });
			toolbar.style.display = "none";
			this.options.disabled = true;
		},

		getTinyMceOptions: function (el) {
			var overrides = {
				mode: "exact",
				elements: el.id,
				content_editable: true,
				theme: "inline",
				theme_advanced_statusbar_location : "none",
				theme_advanced_toolbar_container: "cmsInlineEditToolBar",
				object_resizing: false,
				visual: false,
				formats: {
					underline: { inline: "ins" },
					strikethrough: { inline: "del" }
				}
			}
			return _.extend(this.options.editorOptions, overrides);
		},

		_initialize: function () {
			var self = this;
			var el = self.element.context;
			var $el = $(self.element);
			el.id = tinymce.DOM.uniqueId();

			$el.on("focus", function (e) {
				positionToolbar(el.id);
			});

			$el.on("blur keyup", function (e) {
				if (tinymce.get(el.id).isDirty()) {
	          		self.options.changed(el.innerHTML);
				}
			});

			tinyMCE.init(self.getTinyMceOptions(el));
		}
	});
})(jQuery);
