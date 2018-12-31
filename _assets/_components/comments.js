$(document).ready(function() {

    objCommentForm = $("form[name='comment']");
    objCommentSubmitBtn = objCommentForm.find("a[id='submit']");
    objCommentCancelBtn = objCommentForm.find("a[id='cancel']");
    objCommentContainer = $("div.comments-container");
    objMsgbox = $(".msgbox-background");
    objMsgboxCaption = objMsgbox.find("#msgbox-caption");
    objMsgboxIcon = objMsgbox.find("#msgbox-icon");
    objMsgboxClose = objMsgbox.find("#msgbox-close");


    objCommentContainer.each(function() {
        
        var permalink = $(this).attr("data-permalink");

        $.ajax({url: "https://comments.frigon.info/view" + permalink, success: function(result){
            objCommentContainer.html(result);

            $(".comment-reply-to").click( function( e ) {
                e.preventDefault();
        
                var replyID = $(this).attr("data-reply-id");

                objCommentForm.find("input[name='reply_to']").val(replyID);
                objCommentForm.find("input[name='name']").focus();

                objCommentSubmitBtn.text("Reply");
                objCommentCancelBtn.removeClass("btn-hidden");
            });
        }});
    });
    


    objMsgboxClose.click( function( e ) {
        e.preventDefault();
        objMsgbox.hide();
    });

    objCommentCancelBtn.click(function( e ) {
        e.preventDefault();

        objCommentForm.trigger("reset");
        objCommentSubmitBtn.text("Post");
        objCommentCancelBtn.addClass("btn-hidden");
    });

    objCommentSubmitBtn.click(function( e ) {

        e.preventDefault();
        
        objMsgboxClose.text("Cancel");
        objMsgboxCaption.text("Sending...");
        objMsgboxIcon.attr("class", "icon-spin6");
        objMsgbox.show();


        var data = objCommentForm.serialize();
        var url = "https://comments.frigon.info/post.php"

        $.post( url, data, function( result ) {

            objMsgboxClose.text("Ok");
            objMsgboxCaption.html("Comment sent!");
            objMsgboxIcon.attr("class", "icon-check");

            objCommentForm.trigger("reset");
        
        }).fail( function( xhr ) {

            if( xhr.status == 400 ) {
                objMsgboxCaption.html( xhr.responseText );
            } else {
                objMsgboxCaption.html( "Error while sending");
            }


            objMsgboxClose.text("Close");
            
            objMsgboxIcon.attr("class", "icon-error-alt");

        });
    });
});