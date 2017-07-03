$(document).ready(function() {

    $('#uploadModal').on('click', function() {
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
    });

    $('.upload-btn').on('click', function(evt) {
        $('#upload-input').click();
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
    });

    $('#upload-input').on('change', function(evt) {
        var uploadData  = $('#upload-input');
       
        if(uploadData.val() != "") {
            var formData    = new FormData();
            formData.append('upload', uploadData[0].files[0]);
            $.ajax({
                url:'/company/upload',
                type:'post',
                data:formData,
                processData:false,
                contentType:false,
                success:function(data) {
                    uploadData.val('');
                },
                xhr:function() {
                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function(evt) {
                        if( evt.lengthComputable ) {
                            var uploadPercentage = evt.loaded / evt.total;
                            uploadPercentage = uploadPercentage * 100;
                            $('.progress-bar').text(uploadPercentage+'%');
                            $('.progress-bar').width(uploadPercentage+'%');

                            if( uploadPercentage === 100 ) {
                                $('.progress-bar').text('Completed');
                                $('#completed').width('Completed');
                            }
                        }
                    }, false);
                    return xhr
                }
            })
        }
    });
});