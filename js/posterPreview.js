/*jslint white: true*/
/*global $, alert, Hammer, FileReader*/

$(document).ready(function() {
	"use strict";
	
// img position, initial scale
	var imgBackground = document.querySelector("#img-background"),
		imgProfile = document.querySelector("#img-profile"),
		hmBackground = new Hammer.Manager(document.querySelector("#img-background")),
		hmProfile = new Hammer.Manager(document.querySelector("#img-profile"));
	
// get different element's id from image
	function getIdbyImg(target, text) {
		return($(target).attr("id").replace("img-", text));
	}
	
// update inputs value of image
	function inputsUpdate(target) {
		$(getIdbyImg(target, "#") + "-top").val($(getIdbyImg(target, "#img-")).position().top);
		$(getIdbyImg(target, "#") + "-left").val($(getIdbyImg(target, "#img-")).position().left);
		$(getIdbyImg(target, "#") + "-width").val($(getIdbyImg(target, "#img-")).width());
	}
	
// resize image to fit container
	function imgReset(target) {
		var img = target.get(0),
			containerSize = {
				Width: $(getIdbyImg(target, "#poster-")).width(),
				Height: $(getIdbyImg(target, "#poster-")).height()
			};
		
		
		if ((img.naturalHeight / img.naturalWidth) < (containerSize.Height / containerSize.Width)) {
			target.css({"width": "inherit", "height": "auto"})
				  .css({
					  "top": 0.5 * (containerSize.Height - target.height()),
					  "left": 0
				  });
		}
		else {
			target.css({"width": "auto", "height": "inherit"})
				  .css({
					  "top": 0,
					  "left": 0.5 * (containerSize.Width - target.width())
				  });
		}

	//alert if image size is too small
		if (img.naturalWidth < (containerSize.Width * 2) || img.naturalHeight < (containerSize.Height * 2)) {
			alert("建議影像尺寸" + (containerSize.Width * 2) + "x" + (containerSize.Height * 2) + "以上，圖片可能太小囉！");
		}

		inputsUpdate(target);
	}
	
// load image file & update src
	function imgLoad(file, name) {
		var reader = new FileReader(),
			img = new Image();

		reader.readAsDataURL(file);
		reader.onload = function(file) {
			img.src = file.target.result;
			img.onload = function() {
				$("#img-" + name).attr("src", this.src);
				imgReset($("#img-" + name));
			};
			img.onerror = function() {
				alert("僅接受圖片");
			};
		};
	}
	
// image resize handler
// NEEDS MODIFY!!
	function imgResize(target, center, scale) {
		$(target).css({
			"width": $(getIdbyImg(target, "#") + "-width").val() * scale,
			"height": "auto"
		}).css({
			"top": Number($(getIdbyImg(target, "#") + "-top").val()) - (center.y - Number($(getIdbyImg(target, "#") + "-top").val())) * (scale - 1),
			"left": Number($(getIdbyImg(target, "#") + "-left").val()) - (center.x - Number($(getIdbyImg(target, "#") + "-left").val())) * (scale - 1),
		});
	}
	
// mousewheer listener
	function onMousewheel(e) {
		e.center = {
			x: e.offsetX,
			y: e.offsetY
		};
		e.scale = (e.wheelDelta > 0)? 1.05 : (1 / 1.05);
		
		e.preventDefault();
		imgResize(e.target, e.center, e.scale);
		inputsUpdate(e.target);
	}
	
// pan listener
	function onPan(e) {
		if(e.type === "panend") {
			inputsUpdate(e.target);
		}
		else {
			$(e.target).css({
				"top": Number($(getIdbyImg(e.target, "#") + "-top").val()) + e.deltaY,
				"left": Number($(getIdbyImg(e.target, "#") + "-left").val()) + e.deltaX
			});
		}
	}
	
// pinch listener
	function onPinch(e) {
		if (e.type === "pinchend") {
			inputsUpdate(e.target);
		}
		else {
			imgResize(e.target, e.center, e.scale);
		}
	}

// mousewheel event
// IE9, Chrome, Safari, Opera
	imgBackground.addEventListener("mousewheel", onMousewheel, false);
	imgProfile.addEventListener("mousewheel", onMousewheel, false);
// Firefox
	imgBackground.addEventListener("DOMMouseScroll", onMousewheel, false);
	imgProfile.addEventListener("DOMMouseScroll", onMousewheel, false);

// hammer pan, pinch event
	hmBackground.add(new Hammer.Pan({threshold: 0, pointers: 0}));
	hmBackground.add(new Hammer.Pinch({threshold: 0})).recognizeWith(hmBackground.get("pan"));
	hmProfile.add(new Hammer.Pan({threshold: 0, pointers: 0}));
	hmProfile.add(new Hammer.Pinch({threshold: 0})).recognizeWith(hmProfile.get("pan"));
	
	hmBackground.on("panmove panend", onPan);
	hmBackground.on("pinchstart pinchmove", onPinch);
	hmProfile.on("panmove panend", onPan);
	hmProfile.on("pinchstart pinchmove", onPinch);
	
// initialize
	imgReset($("#img-background"));
	imgReset($("#img-profile"));
	
// upload image
	$(".upload-img").change(function() {
		var name = this.name;
		imgLoad(this.files[0], name);
	});
	
// info box resizable, draggable & align with profile image
//	$("#poster-info").resizable({grid: [16, 24]})
//                     .draggable({
//                         containment: "#poster-background",
//                         grid: [16, 16]
//                     });
	
// change position of profile image
    $("input[name=pro_position]").click(function() {
		switch (this.value) {
			case "left":
				$("#poster-profile, #poster-location").show().css("left", "32px");
				break;
			case "right":
				$("#poster-profile, #poster-location").show().css("left", "768px");
				break;
			case "none":
				$("#poster-profile").hide();
				break;
		}
	});

// change poster-location color
	$("input[name=location_color]").click(function() {
		$("#poster-location").css("color", this.value);
	});

// export result
	$("#export-poster").click(function() {
		alert("敬請期待！");
	});
});