// Variable to hold request
var request;

// Bind to the submit event of our form
$("#groupTripsForm").submit(function(event){

    // Abort any pending request
    if (request) {
        request.abort();
    }
    // setup some local variables
    var $form = $(this);

    // Let's select and cache all the fields
    var $inputs = $form.find("input, select, button, textarea");

    // Serialize the data in the form
    var serializedData = $form.serialize();

    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    // Fire off the request to /form.php
    request = $.ajax({
        url: "https://script.google.com/macros/s/AKfycbwTv50WqMnTYCIOAnYzqHYjmawUD4nG_ywgxq94BJSWX8gxIBc/exec",
        type: "post",
        data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log("Hooray, it worked!");
        console.log(response);
        console.log(textStatus);
        console.log(jqXHR);
        $('#groupTripsRegistrationModal').modal('hide');
        $('#thankYouModal').modal('show');
        $.post("http://services-hezahawsafer.rhcloud.com/grouptrip/register", { email: jQuery('input[name="email"]').val(), name: jQuery('input[name="name"]').val(), phone: jQuery('input[name="phone"]').val(), trip: jQuery('input[name="trip"]').val(), message: jQuery('textarea[name="message"]').val(), pex: jQuery('input[name="pex"]').val(), from: jQuery('input[name="from"]').val(), to: jQuery('input[name="to"]').val() }, function (resp) {
            jQuery('input[name="email"]').val("");
            jQuery('input[name="name"]').val("");
            jQuery('input[name="phone"]').val("");
            jQuery('input[name="trip"]').val("");
            jQuery('textarea[name="message"]').val("");
            jQuery('input[name="pex"]').val("");
            jQuery('input[name="from"]').val("");
            jQuery('input[name="to"]').val("");
            if (resp.done) console.log("Data sent also to server");
        });
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
        $inputs.prop("disabled", false);
    });

    // Prevent default posting of form
    event.preventDefault();
});