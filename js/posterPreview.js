$(document).ready(function() {
    
    // read image file and update src
    function readImg(file, $id) {
        var reader = new FileReader();
        var img = new Image();
        
        reader.readAsDataURL(file);
        reader.onload = function(_file) {
            img.src = _file.target.result;
            img.onload = function() {
                $id.attr("src", this.src);
                
                // set image to original dimension
                $id.width(this.naturalWidth);
                $id.height(this.naturalHeight);
            };
            img.onerror = function() {
                alert("僅接受圖片");
            };
        };
    }
    
    // renew image & makes it draggable while upload
    $("#upload-background").change(function(e) {
        var $id = $("#img-background");
        $.when(readImg(this.files[0], $id)).then(function() {
            
            // position to origin
            $id.css({"left": 0, "top": 0})
               .draggable();
        });
    });
    
    $("#upload-profile").change(function(e) {
        var $id = $("#img-profile");
        $.when(readImg(this.files[0], $id)).then(function() {
            $id.css({"left": 0, "top": 0})
               .draggable();
        });
    });
    
    $("#poster-info").resizable({grid: [16, 16]})
                     .draggable({
                         containment: "#poster-background",
                         grid: [16, 16]
                     });
    
    $("#click2").click(function() {
        $("#poster-profile, #poster-location").css("left", "25px");
    });
});