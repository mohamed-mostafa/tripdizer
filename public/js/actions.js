    $(document).ready(function () {
        ////////
        //////
        var owl = $("#owl-demo2");
        owl.owlCarousel({
            itemsCustom: [
          [0, 1]
          , [450, 2]
          , [600, 2]
          , [700, 2]
          , [1000, 4]
          , [1200, 4]
          , [1400, 5]
          , [1600, 5]
        ]
            , autoPlay: 3000
            , navigation: true
            , pagination: true
            , paginationNumbers: false
        , });
        $('#owl-demo2 .owl-next').html('<i class="fa fa-angle-right"></i>');
        $('#owl-demo2 .owl-prev').html('<i class="fa fa-angle-left"></i>');
        $("#owl-demo").owlCarousel({
            navigation: false
            , slideSpeed: 300
            , paginationSpeed: 400
            , singleItem: true
            , autoPlay: 3000
            , pagination: true
            , paginationNumbers: false, // "singleItem:true" is a shortcut for:
            // items : 1, 
            // itemsDesktop : false,
            // itemsDesktopSmall : false,
            // itemsTablet: false,
            // itemsMobile : false
        });
        $("#owl-demo3").owlCarousel({
            navigation: true
            , slideSpeed: 300
            , paginationSpeed: 400
            , singleItem: true, //autoPlay: 3000,
            pagination: true
            , paginationNumbers: false, // "singleItem:true" is a shortcut for:
            // items : 1, 
            // itemsDesktop : false,
            // itemsDesktopSmall : false,
            // itemsTablet: false,
            // itemsMobile : false
        });
        $('#owl-demo3 .owl-next').html('<i class="fa fa-angle-right"></i>');
        $('#owl-demo3 .owl-prev').html('<i class="fa fa-angle-left"></i>');
        var owl = $("#owl-demo4");
        owl.owlCarousel({
            itemsCustom: [
          [0, 1]
          , [450, 2]
          , [600, 2]
          , [700, 2]
          , [1000, 2]
          , [1200, 2]
          , [1400, 2]
          , [1600, 2]
        ], //autoPlay : 3000,
            navigation: true
            , pagination: true
            , paginationNumbers: false
        , });
        $('#owl-demo4 .owl-next').html('<i class="fa fa-angle-right"></i>');
        $('#owl-demo4 .owl-prev').html('<i class="fa fa-angle-left"></i>');
        
		
		$("#landing-section").addClass("hidden");
		$("#registerationflow").removeClass("hidden");
		$("header").addClass("small-header");
        //initMap();
        /************add class active on nav item clickS*********************************/
        $(document).on("click", ".nav li a", function() {
            $('.nav li').removeClass('active');
            var $this = $(this);
            if (!$this.parent().hasClass('active')) {
                $this.parent().addClass('active');
            }
            //e.preventDefault();
        });
        /**************************change active nav on scroll S*************************/
        var sections = $('section')
            , nav = $('nav')
            , nav_height = nav.outerHeight();
        $(window).on('scroll', function () {
            var cur_pos = $(this).scrollTop();
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (cur_pos >= 50) {
                
                $(".up-btn").removeClass("hidden");
				$("header").addClass("small-header");
            }
            else {
                if ($("#registerationflow").hasClass("hidden")) {
                    $("header").removeClass("small-header");
                }
                $(".up-btn").addClass("hidden");
            }
            sections.each(function () {
                var top = $(this).offset().top - nav_height
                    , bottom = top + $(this).outerHeight();
                if (cur_pos >= top && cur_pos <= bottom) {
                    nav.find('a').parent().removeClass('active');
                    sections.removeClass('active');
                    $(this).addClass('active');
                    nav.find('a[href="#' + $(this).attr('id') + '"]').parent().addClass('active');
                }
            });
        });
        /**************************change active nav on scroll E*************************/

        /*********************smooth scroll S***************************/
        var $root = $('html, body');
        $(document).on("click", ".up-btn", function() {
            $('html, body').stop().animate({
                scrollTop: 0
            }, 500);
        });
        /*********************smooth scroll E***************************/
        $(document).on("change", "select.to-destination", function(e) {
            e.preventDefault();
			var map = angular.element(document.getElementById('home')).scope().getMap();
            var selectedElementPosition = $(this).find(":selected").data("latlng");
            var selectedElementDescription = $(this).find(":selected").data('description');
            var selectedElementName = $(this).find(":selected").data('display-name');

            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            for (var j = 0; j < infowindows.length; j++) {
                infowindows[j].close();
            }
            if (selectedElementPosition != undefined) {
                var splittedPosition = selectedElementPosition.split(',');
                if (splittedPosition != undefined) {
                    var latitudes = splittedPosition[0].split("#");
                    var longitudes = splittedPosition[1].split("#");
                    var description = selectedElementDescription.split("#");
                    var name = selectedElementName.split("#");
                    for (var index=0; index < latitudes.length; index++) {
                        var myLatlng = new google.maps.LatLng(latitudes[index], longitudes[index]);
                        if (myLatlng.lat() == 0 && myLatlng.lng() == 0) {
                            continue;
                        } else {
                            map.setCenter(myLatlng);
                            
                            var marker = new google.maps.Marker({
                                position: myLatlng
                                , map: map
                                , icon: "icon.png"
                                , animation: google.maps.Animation.DROP
                            });
                        }
                        var contentString = '<div id="content" class="map-popup">'
                            +'<div class="popup-img-container">'
                            +'<img src="images/country-thumbnails/' + name[index] + '.jpg" />'
                            +'</div>'
                            + '<h1 id="firstHeading" class="firstHeading">'
                            + name[index]
                            + '</h1>'
                            +'<span class="popup-description">' + description[index] + '</span>'
                            + '</div>';
                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        infowindow.open(map, marker);
                        infowindows.push(infowindow);
                        markers.push(marker);
                        }
                    }                    
            } else {
            	for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
            }
        });
        
               /************ new wizard ************/
        var regForm = $("#registrationForm");

        regForm.validate({
            errorPlacement: function errorPlacement(error, element) {

                if(element.attr("type") == "checkbox" || element.attr("type") == "radio") {
                    element.parent().before(error);
                } else {
                    element.after(error);
                    error.addClass("regError");
                }
            },
            rules: {
                from: "required",
                to: "required",
                date_from: "required",
                date_to: "required",
                trip_type: "required",
                people_number: {
                    required: true,
                    number: true
                },
                /*other_people_number: {
                 required: true,
                 number: true
                 },*/
                budget: "required",
                own_budget: {
                    required: true,
                    number: true
                },
                full_name: "required",
                email: {
                    required: true,
                    email: true
                },
                email2: {
                    required: true,
                    email: true,
                    equalTo: "#email"
                },
                mobile: {
                    required: true
                },
                birth_date: "required",
                referral_type: "required"

                /*options: {
                     required: true,
                     minlength: 5,
                     maxlength: 5,
                     email: true,
                     number: true,
                     equalTo: #xxx
                 }*/

            },
            messages: {
                from: {
                    required: "This field is required"
                },
                to: {
                    required: "This field is required"
                },
                date_from: {
                    required: "This field is required"
                },
                date_to: {
                    required: "This field is required"
                },
                trip_type: {
                    required: "This field is required"
                },
                people_number: {
                    required: "This field is required",
                    number: "Please enter numbers only"
                },
                /*other_people_number: {
                 required: "This field is required",
                 number: "Please enter numbers only"
                 },*/
                budget: {
                    required: "This field is required"
                },
                own_budget: {
                    required: "This field is required",
                    number: "Please enter numbers only"
                },
                full_name: {
                    required: "This field is required"
                },
                email: {
                    required: "This field is required",
                    email: "Please enter a valid email address"
                },
                email2: {
                    required: "This field is required",
                    email: "Please enter a valid email address",
                    equalTo: "Email address is not the same"
                },
                mobile:  {
                    required: "This field is required",
                    number: "Please enter numbers only"
                },
                birth_date: {
                    required: "This field is required"
                },
                referral_type: {
                    required: "This field is required"
                },
            }
        });


        regForm.find("#wizard").steps({
            headerTag: "h3",
            bodyTag: "fieldset",
            transitionEffect: "slideLeft",
            onStepChanging: function (event, currentIndex, newIndex)
            {
                // Allways allow previous action even if the current form is not valid!
                if (currentIndex > newIndex)
                {
                    return true;
                }
                regForm.validate().settings.ignore = ":disabled,:hidden";
                return regForm.valid();
            },
            onStepChanged: function (event, currentIndex, priorIndex){},
            onFinishing: function (event, currentIndex)
            {
                regForm.validate().settings.ignore = ":disabled";
                return regForm.valid();
            },
            onFinished: function (event, currentIndex){}
        });



        /****** new range ******/
        $('input[type=range]').each(function(){
            var rangeVal = $(this).val(),
                outputEle = $(this).parent().find(".range-output");

            $(outputEle).css({
                "left" : rangeVal + "%"
            });
            $(outputEle).find("output").val(rangeVal);
            //console.log(rangeVal)

        });
            $('input[type=range]').on('input', function () {
                var rangeVal = $(this).val(),
                    outputEle = $(this).parent().find(".range-output");

                $(outputEle).css({
                    "left" : rangeVal + "%"
                });
                $(outputEle).find("output").val(rangeVal);
            });




        ////initiate
        //$('select').material_select();
        $('.modal').modal();
        $('input#input_text, textarea#textarea1').characterCounter();
        //Get current date
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var currentDate = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            closeOnSelect: true
            , closeOnClear: true
            , min: new Date(currentDate)
            , max: new Date(d.getFullYear()+1, 12, 31),
            onSet: function( arg ){
                if ( 'select' in arg ){ //prevent closing on selecting month/year
                    this.close();
                }
            }
        });
        $('.birthDate').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 100, // Creates a dropdown of 15 years to control year
            closeOnSelect: true
            , closeOnClear: true
            , max: new Date(currentDate),
            onSet: function( arg ){
                if ( 'select' in arg ){ //prevent closing on selecting month/year
                    this.close();
                }
            }
        });


     $('#start-now').click(function() {
      if ($('li.step.current').hasClass('first')){
       $(".actions").addClass("firstStep");
    }       
});
   
$(".actions a[href='#next']").click(function() {
      if (!$('li.step.current').hasClass('first')){
       $(".actions").removeClass("firstStep");
    } 
});
        $(".actions a[href='#previous']").click(function() {
     if ($('li.step.current').hasClass('first')){
       $(".actions").addClass("firstStep");
    } 
});      
    
  $(".step.first.done").click(function() {
       $(".actions").addClass("firstStep");
});  
   $(".step.done").click(function() {
       $(".actions").removeClass("firstStep");
}); 
   
   // Add smooth scrolling to all links
   $(".scrollable").on('click', function(event) {

 // Make sure this.hash has a value before overriding default behavior
 if (this.hash !== "") {
   // Prevent default anchor click behavior
   event.preventDefault();

   // Store hash
   var hash = this.hash;

   // Using jQuery's animate() method to add smooth page scroll
   // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
   $('html, body').animate({
     scrollTop: $(hash).offset().top
   }, 800, function(){

     // Add hash (#) to URL when done scrolling (default click behavior)
     window.location.hash = hash;
   });
 } // End if
   });
        
    });


