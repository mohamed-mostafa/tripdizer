/*
$(document).ready(
		function() {
			wizardIntialize();
			i = 1;
			$(".step").removeClass("active");
			$steps.first().addClass("active");
			$(".wizard-tab-content").removeClass("active");
			$tabsContent.first().addClass("active");
			$('.wizard-back').addClass("hidden");

			if ($('body').hasClass("english")) {
				$tabsContent.first().animate({
					left : '0%',
					opacity : '1'
				});
			} else {
				$tabsContent.first().animate({
					right : '0%',
					opacity : '1'
				});
			}
			$('.wizard-next').click(function() {
				wizardControlNext();
			});
			$('.wizard-back').click(function() {
				wizardControlBack();
			});

		});


function wizardIntialize() {
	$wizardContainer = $('.numeric-wizard-container'); // class or id
	$steps = $wizardContainer.find(".step");
	$tabsContent = $wizardContainer.find(".wizard-tab-content");

}

function wizardControlNext() {
	if (i + 1 <= $steps.length) {
		$(".step.active").addClass("success");
		$(".step").removeClass("active");
		$(".wizard-tab-content").removeClass("active");
		$(".step").eq(i).addClass("active");
		$(".wizard-tab-content").eq(i).addClass("active");
		if ($('body').hasClass("english")) {
			$(".wizard-tab-content.active").css('left', "-100%");
			$(".wizard-tab-content.active").css('right', "auto");
			$(".wizard-tab-content").eq(i).animate({
				left : '0%',
				opacity : '1',
				right : 'auto'
			});
		} else {
			$(".wizard-tab-content.active").css('right', "-100%");
			$(".wizard-tab-content.active").css('left', "auto");
			$(".wizard-tab-content").eq(i).animate({
				right : '0%',
				opacity : '1',
				left : 'auto'
			});
		}

		++i;
		if (i > 1) {
			$('.wizard-back').removeClass("hidden");
		}
		if (i >= $steps.length) {
			$('.wizard-next').addClass("hidden");
		}

	}
}

function wizardControlBack() {

	if (i >= 1) {
		i--;
		$(".step").removeClass("active");
		$(".wizard-tab-content").removeClass("active");
		$(".step").eq(i - 1).removeClass("success");
		$(".step").eq(i - 1).addClass("active");
		$(".wizard-tab-content").eq(i - 1).addClass("active");
		if ($('body').hasClass("english")) {
			$(".wizard-tab-content.active").css('right', "-100%");
			$(".wizard-tab-content.active").css('left', "auto");
			$(".wizard-tab-content").eq(i - 1).animate({
				right : '0%',
				opacity : '1'
			});
		} else {
			$(".wizard-tab-content.active").css('left', "-100%");
			$(".wizard-tab-content.active").css('right', "auto");
			$(".wizard-tab-content").eq(i - 1).animate({
				left : '0%',
				opacity : '1'
			});
		}
		if (i <= 1) {
			$('.wizard-back').addClass("hidden");
		} else if (i <= $steps.length) {
			$('.wizard-next').removeClass("hidden");
		}

	}

}

*/
