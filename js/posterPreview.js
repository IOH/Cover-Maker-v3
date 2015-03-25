/*jslint white: true*/
/*global $, jQuery, alert*/

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
    
    // read image file & update src, resize to fit container, image draggable
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

            // resize image to fit container & draggable
            if ((img.naturalWidth / img.naturalHeight) > (size.Width / size.Height)) {
                $id.css({"width": "100%", "height": ""}).css({"top": 0.5 * (size.Height - $id.height()), "left": 0}).draggable();
            }
            else {
                $id.css({"width": "", "height": "100%"}).css({"top": 0, "left": 0.5 * (size.Width - $id.width())}).draggable();
            }

            //alert if image size is too small
            if (img.naturalWidth < (size.Width * 2) || img.naturalHeight < (size.Height * 2)) {
                alert("建議影像尺寸" + (size.Width * 2) + "x" + (size.Height * 2) + "以上，圖片可能太小囉！");
            }
        };
    }

    // update image & make it draggable
    $(".upload-img").change(function(e) {
        var name = $(this).attr("name");
        readImg(this.files[0], name);
        resetImg(name);
    });
    
    // info box resizable, draggable & align with profile picture
    $("#poster-info").resizable({grid: [16, 16]})
                     .draggable({
                         containment: "#poster-background",
                         grid: [16, 16]
                     });
    
    // change position of profile picture
    $("#click-left").click(function() {
        $("#poster-profile, #poster-location").css("left", "32px");
    });
    $("#click-right").click(function() {
        $("#poster-profile, #poster-location").css("left", "768px");
    });
});