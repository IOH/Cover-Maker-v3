$(document).ready(function() {
    function readImage(file) {
  
        var reader = new FileReader();
        var image  = new Image();
        
        reader.readAsDataURL(file);  
        reader.onload = function(_file) {
            image.src = _file.target.result;
            image.onload = function() {
                var w = this.width,
                    h = this.height,
                    t = file.type,
                    n = file.name,
                    s = ~~(file.size/1024) +'KB';
                $('#uploadPreview').html('<img src="'+ this.src +'"> '+w+'x'+h+' '+s+' '+t+' '+n+'<br>');
            };
            image.onerror= function() {
                alert('Only image available.');
            };      
        };
    }
    $("#choose").change(function (e) {
        if(this.disabled) return alert('File upload not supported!');
        var F = this.files;
        readImage(F[0]);
    });
});