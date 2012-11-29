//     Create.js - On-site web editing interface
//     (c) 2012 Veit Lehmann
//     Create may be freely distributed under the MIT license.
//     For all details and documentation:
(function (jQuery, undefined) {
	// Run JavaScript in strict mode
	/*global jQuery:false _:false document:false CKEDITOR:false */
	'use strict';

	// # TinyMCE editing widget
	//
	// This widget allows editing textual content areas with the
	// [TinyMCE](http://www.tinymce.com/) rich text editor.
	jQuery.widget('Create.tinymceWidget', jQuery.Create.editWidget, {
		enable: function () {
		},

		disable: function () {
			console.log("disable, this.id", this.element.id);

		},

		_initialize: function () {
			var el = this.element.context;
			el.id = tinymce.DOM.uniqueId();
			var $DOC = $(document);
			var $toolbar = $("<div id='cmsInlineEditToolBar'/>");
			var toolbar = $toolbar.appendTo("body").get(0);
			var lastId = "";
			var activeEd;
			var activeToolbarHeight = 0;

			var positionToolbar = function(id) {
				// if editor has changed, show new toolbar and hide others
				if (id != lastId) {
					$(".mceEditor").hide();
					document.getElementById([id, "_parent"].join("")).style.display = "inline";
					activeToolbarHeight = document.getElementById([id, "_tbl"].join("")).clientHeight + 4;
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

			tinyMCE.init({
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
				},
				init_instance_callback: function(ed) {
					positionToolbar(ed.id);
				},
				plugins: "autolink,lists,table,advlink,iespell,inlinepopups,searchreplace,paste,nonbreaking,xhtmlxtras",
				theme_advanced_buttons1: "formatselect,|,bold,italic,underline,strikethrough,sub,sup,|,link,unlink,anchor,|,removeformat,code,visualaid,|,undo,redo",
				theme_advanced_buttons2: "tablecontrols,|,bullist,numlist,|,outdent,indent,blockquote,hr",
				theme_advanced_blockformats: "p,h1,h2,h3,h4,h5,h6",
				valid_elements: "+a[tabindex|accesskey|href|onclick|target|title|name],-strong/-b,-em/-i,-ins/-u,-del/-strike,#p[id],#h1[id],#h2[id],#h3[id],#h4[id],#h5[id],#h6[id],sub,sup,-ol[id],-ul[id],-li,-blockquote,br,hr,-table[summary],-tr,tbody,thead,tfoot,#td[colspan|rowspan|width|height|align|valign|scope],#th[colspan|rowspan|width|height|align|valign|scope]",
				force_br_newlines: false,
				forced_root_block: "p",
				setup: function(ed) {
					ed.onClick.add(function(ed) {
						positionToolbar(ed.id);
					});
				}
			});
		}
	});
})(jQuery);
