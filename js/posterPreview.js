/*jslint white: true*/
/*global $, alert*/

$(document).ready(function() {
    
// return the container size
    function containerSize(name) {
        var $id = $("#poster-" + name),
            size = {
                Width: $id.width(),
                Height: $id.height()
            };
            
        return size;
    }
    
// read image file & update src
    function readImg(file, name) {
        var reader = new FileReader(),
            img = new Image(),
            $id = $("#img-" + name);
        
        reader.readAsDataURL(file);
        reader.onload = function(file) {
            img.src = file.target.result;
            img.onload = function() {
                $id.attr("src", this.src);
            };
            img.onerror = function() {
                alert("僅接受圖片");
            };
        };
    }
    
// resize image to fit container, image draggable
    function resetImg(name) {
        var $id = $("#img-" + name),
            img = $id.get(0),
            size = containerSize(name);

        img.onload = function() {

            // resize image to fit container, draggable & zoomable
            if ((img.naturalHeight / img.naturalWidth) < (size.Height / size.Width)) {
                $id.css({"width": "100%", "height": ""})
                   .css({"top": 0.5 * (size.Height - $id.height()), "left": 0})
                   .draggable().imgZoom(this.width);
            }
            else {
                $id.css({"width": "", "height": "100%"})
                   .css({"top": 0, "left": 0.5 * (size.Width - $id.width())})
                   .draggable().imgZoom(this.width);
            }

            //alert if image size is too small
            if (img.naturalWidth < (size.Width * 2) || img.naturalHeight < (size.Height * 2)) {
                alert("建議影像尺寸" + (size.Width * 2) + "x" + (size.Height * 2) + "以上，圖片可能太小囉！");
            }
        };
    }
	
// change selected text to red
	function textRed() {
        var index = $("input[name=text-red]:checked").val(),
            selector = ".experience-text:eq(" + index + ")";
        
        $(selector).css("color", "#F00");
        $(".experience-text:not(" + selector + ")").css("color", "#000");
    }
	
// initialize
	resetImg("background");
	resetImg("profile");
	textRed();

// update image & make it draggable
    $(".upload-img").change(function(e) {
        var name = this.name;
        readImg(this.files[0], name);
        resetImg(name);
    });
    
// info box resizable, draggable & align with profile image
	$("#poster-info").resizable({grid: [16, 24]})
                     .draggable({
                         containment: "#poster-background",
                         grid: [16, 16]
                     });
    
// change position of profile image
    $(".profile-position").click(function() {
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
    
// change selected experience-text color to red
    $("input[name=text-red]").change(function() {
		textRed();
	});
    
// change poster-location color
    $(".location-color").click(function() {
        $("#poster-location").css("color", this.value);
    });
	
// export result
	$("#export-poster").click(function() {
		$("input[name=text-red]:radio").hide();
		alert("敬請期待！");
	});
	
// image zooming
// still not accurate, needs modify!!
    $.fn.imgZoom = function(originW) {
		function MouseWheel(e) {
            var divider = (e.wheelDelta || e.detail) > 0? 30 : -30, // IE9+, Chrome, Safari, Opera || Firefox
				deltaW = originW / divider,
                mouseX = e.offsetX || e.layerX, // Others || Firefox
                mouseY = e.offsetY || e.layerY,
                imgX = $(this).offset().left,
                imgY = $(this).offset().top;

            e.preventDefault();
			
			if (this.width + deltaW >= 0.5 * originW) {
				$(this).width(this.width + deltaW)
            		   .height(this.width * (this.naturalHeight / this.naturalWidth));
            	$(this).offset({
					top: imgY - (deltaW * (this.naturalHeight / this.naturalWidth)) * mouseY / this.height,
					left: imgX - deltaW * mouseX / this.width
            	});
			}
			
            return false;
        }
		
		this.get(0).addEventListener("mousewheel", MouseWheel, false); // IE9+, Chrome, Safari, Opera
        this.get(0).addEventListener("DOMMouseScroll", MouseWheel, false); // Firefox
    };
});