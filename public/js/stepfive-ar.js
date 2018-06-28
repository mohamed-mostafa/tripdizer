$(document).ready(function() {
    $(".wrap").click(function() {
        $(".popup").fadeIn("fast", function() {
            var name = document.getElementById("country1").innerHTML;
            document.getElementById("countryName").innerHTML = name;
            var img = document.getElementById("counImg1").src;
            document.getElementById("imgSrc").src = img;
            document.getElementById("description").innerHTML = "بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر ";

        });

    });
    $(".wrap1").click(function() {
        $(".popup").fadeIn("fast", function() {
            var name = document.getElementById("country2").innerHTML;
            document.getElementById("countryName").innerHTML = name;
            var img = document.getElementById("counImg2").src;
            document.getElementById("imgSrc").src = img;
            document.getElementById("description").innerHTML = "بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر ";

        });
    });
    $(".wrap2").click(function() {
        $(".popup").fadeIn("fast", function() {
            var name = document.getElementById("country3").innerHTML;
            document.getElementById("countryName").innerHTML = name;
            var img = document.getElementById("counImg3").src;
            document.getElementById("imgSrc").src = img;
            document.getElementById("description").innerHTML = "بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر ";

        });
    });
    $(".wrap3").click(function() {
        $(".popup").fadeIn("fast", function() {
            var name = document.getElementById("country4").innerHTML;
            document.getElementById("countryName").innerHTML = name;
            var img = document.getElementById("counImg4").src;
            document.getElementById("imgSrc").src = img;
            document.getElementById("description").innerHTML = "بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر ";

        });
    });
    $(".wrap4").click(function() {
        $(".popup").fadeIn("fast", function() {
            var name = document.getElementById("country5").innerHTML;
            document.getElementById("countryName").innerHTML = name;
            var img = document.getElementById("counImg5").src;
            document.getElementById("imgSrc").src = img;
            document.getElementById("description").innerHTML = "بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر ";

        });

    });
    $(".wrap5").click(function() {
        $(".popup").fadeIn("fast", function() {
            var name = document.getElementById("country6").innerHTML;
            document.getElementById("countryName").innerHTML = name;
            var img = document.getElementById("counImg6").src;
            document.getElementById("imgSrc").src = img;
            document.getElementById("description").innerHTML = "بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر  بلد جميل وساحر بلد جميل وساحر  بلد جميل وساحر ";

        });

    });

    $(".btnModal").click(function() {
        $(".popup").fadeOut();
    })
    $("#wizard ul li:nth-child(5n)").css("display", "none");
    $("#wizard ul li:nth-child(5n)").addClass("five");
    $("#wizard ul li:nth-child(6n)").addClass("six");
    $("#wizard ul li:nth-child(7n)").addClass("seven");


    $(".six span").text("5");
    $(".seven span").text("6");
    $(".recommendedCountries div").addClass("hidden");
    $("#menu-step").css("display", "none");
});







//////////////////////////////

function chk() {
    if (document.getElementById("help").checked == true) {
        $(".recommendedCountries div").removeClass("hidden");
        $("#wizard ul li:nth-child(5n)").css("display", "block");
        if ($(".six span").hasClass("num")) {
            $(".six span").text("6");
            $(".seven span").text("7");

        }
        $(".to-destination").addClass("gray");
        document.getElementById("to").setAttribute("disabled", "disabled");
        $("#menu-step").css("display", "block");

    } else {
        $(".recommendedCountries div").addClass("hidden");
        $("#wizard ul li:nth-child(5n)").css("display", "none");
        document.getElementById("to").removeAttribute("disabled", "disabled");
        $(".to-destination").removeClass("gray");
        $(".six span").text("5");
        $(".seven span").text("6");
        $("#menu-step").css("display", "none");


    }

}


function change() {
    if ($(".recommendedCountries div").hasClass("hidden")) {
        $(".actions a[href='#next']").mousedown(function() {
            console.log("gg");
            if ($(".travel").hasClass("current")) {
                console.log("fffffffffffffffff");
                $(".actions a[href='#next']").click();
                console.log("click");
                $(".details").addClass("current");
            }
        });

        $(".actions a[href='#previous']").mousedown(function() {
            console.log("gg");
            if ($(".details").hasClass("current")) {
                console.log("preppppppppppppp");
                $(".actions a[href='#previous']").click();
                console.log("click");
                // $(".details").addClass("current");
            }
        });

    }


}