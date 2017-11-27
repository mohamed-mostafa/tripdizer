    $(document).ready(function () {
        ////initiate
        $('select').material_select();
        $('.modal').modal();
        $('input#input_text, textarea#textarea1').characterCounter();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
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
        $("#start-now").click(function () {
            $("#landing-section").addClass("hidden");
            $("#registerationflow").removeClass("hidden");
            $("header").addClass("small-header");
        });
        /************add class active on nav item clickS*********************************/
        $('.nav li a').click(function (e) {
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
                $("header").addClass("small-header");
                $(".up-btn").removeClass("hidden");
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
        var toDestinationContent = '<div class="row col s12 noPadding toDestinationField">' + '<div class="input-field col s11">' + '<select class="to-destination">' + ' <option value="" disabled selected>To</option>' + ' <option onclick="alert();" value="1" data-latlng="35.861660,104.195397">China</option>' + '  <option value="2" data-latlng="6.550080,-72.383340">Mosco</option>' + '  <option value="3" data-latlng="38.963745,35.243322">Turkey</option>' + ' </select>' + ' </div>' + ' <div class="col s1">' + '    <button class="remove-btn" type="button">-</button>' + ' </div>' + ' </div>';
        $(".add-btn").click(function () {
            $(toDestinationContent).appendTo("#lcationPickupContainer");
            $('select.to-destination').last().material_select();
        });
        $(".remove-btn").click(function () {
            $('#lcationPickupContainer .toDestinationField').last().remove();

        });

        /*********************smooth scroll S***************************/
        var $root = $('html, body');
        $('a').click(function () {
            var href = $.attr(this, 'href');
            $root.animate({
                scrollTop: $(href).offset().top
            }, 500, function () {
                window.location.hash = href;
            });
            return false;
        });
        $(".up-btn").click(function () {
            $('html, body').stop().animate({
                scrollTop: 0
            }, 500);
        });
        /*********************smooth scroll E***************************/
        $("select.to-destination").change(function (e) {
            e.preventDefault();
            var selectedElementPosition = $(this).find(":selected").data("latlng");
            if (selectedElementPosition != undefined) {
                var splittedPosition = selectedElementPosition.split(',');
                if (splittedPosition != undefined) {
                    var myLatlng = new google.maps.LatLng(splittedPosition[0], splittedPosition[1]);
                    map.setCenter(myLatlng);
                    // Sets the map on all markers in the array.
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                    for (var j = 0; j < infowindows.length; j++) {
                        infowindows[j].close();
                    }
                    var marker = new google.maps.Marker({
                        position: myLatlng
                        , map: map
                        , icon: "icon.png"
                        , animation: google.maps.Animation.DROP
                    });
                }
            }
            var contentString = '<div id="content" class="map-popup">'
                                +'<div class="popup-img-container">'
            +'<img src="images/slider/10.jpeg" />'
            +'</div>'
                                + '<h1 id="firstHeading" class="firstHeading">'
                                + $(this).find(":selected").text() 
                                + '</h1>'
            +'<span class="popup-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</span>'
            + ' <div class="col s12">' 
            + '    <a class="btn-pick" href="#">Pick this city and next</a>' 
            + ' </div>'
                                + '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            infowindow.open(map, marker);
            infowindows.push(infowindow);
            markers.push(marker);
        });
        /************Initialize Map S*********************************/
        function initMap() {
            var pos = {
                lat: 25.124254
                , lng: 55.37949200000003
            };
            var mapOptions = {
                zoom: 10
                , center: pos
                , disableDefaultUI: true
                , zoomControl: true
            , };
            map = new google.maps.Map(document.getElementById('flow-map-container'), mapOptions);
            markers = [], infowindows = [];
            var marker = new google.maps.Marker({
                position: pos
                , map: map
                , icon: "icon.png"
                , animation: google.maps.Animation.DROP
            });
            markers.push(marker);
        }
        initMap();

        function initContactMap() {
            var pos = {
                lat: 25.124254
                , lng: 55.37949200000003
            };
            var mapOptions = {
                zoom: 10
                , center: pos
                , disableDefaultUI: true
            };
            var map = new google.maps.Map(document.getElementById('map-container'), mapOptions);
            var marker = new google.maps.Marker({
                position: pos
                , map: map
                , icon: "icon.png"
                , animation: google.maps.Animation.DROP
            });
        }
        initContactMap();
    }); /************Initialize Map E*********************************/