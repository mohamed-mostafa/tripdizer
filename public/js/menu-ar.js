$(document).ready(function () {
    $(document).on('click', '.one', function (event) {
        event.preventDefault();
        $("#wizard-t-0").click();
    });
    $(document).on('click', '.two', function (event) {
        event.preventDefault();
        $("#wizard-t-1").click();
    });
    $(document).on('click', '.three', function (event) {
        event.preventDefault();
        $("#wizard-t-2").click();
    });
    $(document).on('click', '.four', function (event) {
        event.preventDefault();
        $("#wizard-t-3").click();
    });
    $(document).on('click', '.five', function (event) {
        event.preventDefault();
        $("#wizard-t-4").click();
        $("body").scrollTop(0);
    });
    $(document).on('click', '.six', function (event) {
        event.preventDefault();
        $("#wizard-t-5").click();
    });
    $(document).on('click', '.seven', function (event) {
        event.preventDefault();
        $("#wizard-t-6").click();
    });

    $("a[href$='#previous']").on("click", function () {
        $("body").scrollTop(0);
    })
    $("a[href$='#next']").on("click", function () {
        $("body").scrollTop(0);
    })
    $("a[href$='#finish']").on("click", function () {
        $("body").scrollTop(0);
    })

});