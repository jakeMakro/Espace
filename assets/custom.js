$(window).on('load',function(){
  newHeroLayout4();
  lazyLoadVideos();
});

function newHeroLayout4() {
  // new-hero-section section Tow image layout 4 -- for the mobile
  if( $(window).width() < 750 ){
    $('.banner--content-align-mobile-twoImg-TLay-4').each(function(){
      var _thisMain = $(this);
      $(this).find('.banner__content').each(function(index, ele){
        var _class = '.banner__media_'+(index+1);
        var _bannerImg = $(_thisMain.find(_class));
        if( $(this).outerHeight(true) > _bannerImg.outerHeight(true) ){
          _bannerImg.css('min-height', ($(this).outerHeight(true) +50 )+'px' );
          $(this).css('min-height', ($(this).outerHeight(true) +50 )+'px' );        
          }
      });
    });
  }else{
    return;
  }
  // new-hero-section section Tow image layout 4 -- for the mobile
}

$(document).ready(function () {


  /*appilnce page and all-stain page accordian*/
  $(document).on("click", ".main-content--wrap .terms-condition-wrapper .set > span", function() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".set-content").slideUp(450);
      $(".main-content--wrap .terms-condition-wrapper .set > span i").removeClass("fa-minus").addClass("fa-plus");
    } else {
      $(".main-content--wrap .terms-condition-wrapper .set > span i").removeClass("fa-minus").addClass("fa-plus");
      $(this).find("i").removeClass("fa-plus").addClass("fa-minus");
      $(".main-content--wrap .terms-condition-wrapper .set > span").removeClass("active");
      $(this).addClass("active");
      $(".main-content--wrap .terms-condition-wrapper .set-content").slideUp(450);
      $(this).siblings(".set-content").slideDown(450);
    }
  });

  /*close btn for protection plan drawer page*/
  $(document).on("click", ".protection-plan-drawer-wrap [data-drawer-close]", function(e) {
    e.preventDefault();
    $('body').removeClass('drawer--active').css("padding-right", "");
  });

  /*close btn for removal service popup*/
  $(document).on("click", "cart-items [data-service-popup-close]", function(e) {
    e.preventDefault();
    $(this).closest('services-box').removeClass('popup-active');
  });

  /*outside click event*/
  $(document).on("click", function (e) {
    if ($(e.target).is(".prot_plan_text") === false) { 
      if ($("div.protection_plan-global").hasClass("opened")) { 
       $("div.protection_plan-global").removeClass('opened');                                                          
      }
    }
    
    /* close protection plan drawer in cart page*/
    if(!e.target.closest('.protection-plan-drawer-wrap')){
      $('body').removeClass('drawer--active').css("padding-right", "");
    }
    /* close protection plan drawer in cart page*/

    /* close removal service popup in cart page*/
    if(!e.target.closest('.removal-service--content')){
      $('cart-items services-box').removeClass('popup-active');
    }
    /* close removal service popup in cart page*/
  });
  
  // document click event
  document.onclick = function (e) {
    // close hotspot item popup when outdside click  -- section ==> [ hotspots.liquid ]
    if (!e.target.closest("[data-hotspot-product]")) {
      var activeHotspot = document.querySelector("[data-hotspot-product].active") || null;
      if (activeHotspot != null) {
        activeHotspot.classList.remove("active");
      }
    }
    // close sort dropdown
    if(!e.target.closest(".filters-top-right")){
      if(document.querySelector('.filters-top-right .custom-select-grp .selected-sort')){
        document.querySelector('.filters-top-right .custom-select-grp .selected-sort').classList.remove('active');  
      }
    }
    /******************** drawer overlay click close popup ************************/
    if (e.target.classList.contains("overlay-active")) {
      e.target.classList.remove("overlay-active");
      document.querySelector(".mobile-accordian").classList.remove("active");
    }
    /******************** drawer overlay click close popup END ************************/
  };


  //collection page bottom seo description readmore/readless btn
  $(document).on("click", '.collection-text-sectoin [data-read-more]', function (e) {
    e.preventDefault();
    $(this).closest('.collection-text-sectoin').find('.read-more-text').addClass('hidden');
    $(this).closest('.collection-text-sectoin').find('.read-less-text').removeClass('hidden');
    $(this).addClass('hidden');
    $(this).closest('.collection-text-sectoin').find('[data-read-less]').removeClass('hidden');
  });
  $(document).on("click", '.collection-text-sectoin [data-read-less]', function (e) {
    e.preventDefault();
    $(this).closest('.collection-text-sectoin').find('.read-more-text').removeClass('hidden');
    $(this).closest('.collection-text-sectoin').find('.read-less-text').addClass('hidden');
    $(this).addClass('hidden');
    $(this).closest('.collection-text-sectoin').find('[data-read-more]').removeClass('hidden');
  });

                
  // Announcement bar
  var announcementBar = document.querySelector("[data-slider-announcement-bar]") || null;
  if (announcementBar) {
    announcementBarSlider();
  }
  //END -- Announcement bar

  // Promotion bar mobile
  var promotionBarSection = document.querySelector(".promotion-section [data-promotion-bar]");
  if (promotionBarSection) {
    promotionBarSlider();
  }
  //END -- Promotion bar mobile

  //multi coloumn slider section
  var multicolumnSliderSection = document.querySelector(".multicolumn-slider [data-swiper-slider]") || null;
  if (multicolumnSliderSection) {
    multicolumnSlider();
  }
  //END -- multi coloumn slider section
  

  //image-text-gallery section
  var imageTextGallerySliderSection = document.querySelector(".image-text-gallery [data-image-text-gallery-slider]") || null;
  if (imageTextGallerySliderSection) {
    imageTextGallerySlider();
  }
  //END -- image-text-gallery section

  
  // product carousel section
  var product_carousel = document.querySelector(".product--carousel [data-product-carousel]") || null;
  if (product_carousel) {
    productCarousel();
  }
  //END -- product carousel section

  //shop categories section
  var shopCategoriesSection = document.querySelector(".shop-categories [data-shop-categories-slider]") || null;
  if (shopCategoriesSection) {
    shopCategoriesSlider();
  }
  //END -- shop categories section
  
  // Help Center Navigation
  $(".help-center-selected").click(function(){
    $(this).parents(".help-drop-down-wrap").toggleClass("activeDrop");
  })
  //END -- Help Center Navigation
  
  // Footer Accordion
  var footerAcco = document.querySelector(".footer [data-footer-accordion]") || null;
  if (footerAcco && document.body.clientWidth <= 749) {
    footerAccordion();
  }
  //END -- Footer Accordion

  $(".copy-btn").on("click", function () {
    value = $(this).data("clipboard-text"); //Upto this I am getting value
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(value).select();
    document.execCommand("copy");
    $temp.remove();
  });

  /************************START template -- index [ HOMEPAGE ] **********************/
  if (document.body.classList.contains("template-index")) {
    // section ==> home-hero.liquid
    var heroSection = document.querySelector(".hero-section [data-hero-section]") || null;
    if (heroSection) {
      heroSectionSlider();
    }

    // section ==> image-with-text-slider.liquid
    var imgTextSliderSec = document.querySelector(".image-text-slider [data-image-text-slider]") || null;
    if (imgTextSliderSec) {
      imgTextSlider();
    }

    // section ==> collections-tabs.liquid
    var collTabs = document.querySelector(".collections-tabs [data-collections-tabs]");
    if (collTabs) {
      collectionTabs();
    }

    // section ==> hotspots.liquid
    // var hotspotSec = document.querySelector(".hotspots-section") || null;
    // if (hotspotSec) {
    //   hotspotsSection();
    // }

    //hotspot-img-text.liquid section
    var hotspotSliderEle = document.querySelector("[data-hotspot-slider]") || null;
    if (hotspotSliderEle) {
      hotspotSlider();
    }
    //END -- hotspot-img-text.liquid section
    
    // section ==> faq.liquid
    var faqSec = document.querySelector(".section-faq [data-faq-wrapper]") || null;
    if (faqSec) {
      faqSection();
    }
  }
  /*********************** END template -- index [ HOMEPAGE ] ******************/

  /************************START template -- product [ PRODUCT PAGE ] **********************/
  if (document.body.classList.contains("template-product")) {
    if (window.producttype == "applince_product" || window.producttype == "antitache_product") {
      getHTMLData();
    }
  }
  /************************END template -- product [ PRODUCT PAGE ] **********************/


  /*********************** Appliance Repair Form Page Validation Start************************/
  if (document.body.classList.contains("template-appliance-repair")) {
    $(".appliance-wrapper .appliance_repair").submit(function (e) {
      e.preventDefault();
      $(".error-msg").removeClass("active");
      var FirstName = $("#customer-firstname").val();
      FirstName = $.trim(FirstName);
      var LastName = $("#customer-lastname").val();
      LastName = $.trim(LastName);
      var tel = $("#customer-Telephone").val();
      tel = $.trim(tel);
      var address = $("#customer-Address").val();
      address = $.trim(address);
      var Province = $("#customer-Province").val();
      Province = $.trim(Province);
      var phn = $("#customer-phone").val();
      phn = $.trim(phn);
      var email = $("#customer-email").val();
      email = $.trim(email);
      var brand = $(".select__select[name='customer-Device-brand']").val();
      brand = $.trim(brand);
      var ele = null;
      if (
        FirstName == "" ||
        LastName == "" ||
        address == "" ||
        email == "" ||
        tel == "" ||
        Province == "" ||
        phn == "" ||
        brand == ""
      ) {
        if (FirstName == "") {
          $("#customer-firstname").next("span").addClass("active");
          ele = ele == null ? $("#customer-firstname") : ele;
        }
        if (LastName == "") {
          $("#customer-lastname").next("span").addClass("active");
          ele = ele == null ? $("#customer-lastname") : ele;
        }
        if (tel == "") {
          $("#customer-Telephone").next("span").addClass("active");
          ele = ele == null ? $("#customer-Telephone") : ele;
        }
        if (Province == "") {
          $("#customer-Province").next("span").addClass("active");
          ele = ele == null ? $("#customer-Province") : ele;
        }
        if (address == "") {
          $("#customer-Address").next("span").addClass("active");
          ele = ele == null ? $("#customer-Address") : ele;
        }
        if (phn == "") {
          $("#customer-phone").next("span").addClass("active");
          ele = ele == null ? $("#customer-phone") : ele;
        }
        if (email == "") {
          $("#customer-email").next("span").addClass("active");
          ele = ele == null ? $("#customer-email") : ele;
        }
        if (brand == "") {
          $(".select__select[name='customer-Device-brand']")
            .next("svg")
            .next("span")
            .addClass("active");
          ele = ele == null ? $(".select__select[name='customer-Device-brand']") : ele;
        }
        if( ele != null ){
          $('html,body').animate({
            scrollTop: (ele.offset().top - ( $('.section-header').height() + 15 ) )
          },500);
        }
      } else {
        var chk_mobile = document.querySelector('[id="customer-Telephone"]');
        var chk_val = telephoneCheck(chk_mobile.value);
        if(chk_val == true){
            chk_mobile.closest('.form__input-wrapper').querySelector('.error-msg').classList.remove('active');
        }else{
            chk_mobile.closest('.form__input-wrapper').querySelector('.error-msg').classList.add('active');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        
        if(document.querySelectorAll('.error-msg.active').length == 0){
          var form = $(this);
          var url = form.attr("action");
          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
              $('body, html').animate({ scrollTop: 0 });
              form.hide();
              form.closest(".contact-form-wrapper.appliance-wrapper").find("#success-msg").html(
                  "<h3>Merci!</h3><b>Votre message a été reçu.  Nous examinerons votre demande et vous répondrons dans les plus brefs délais.</b>"
                )
                .fadeIn(300);
            },
          });
        }
      }
    });
    function telephoneCheck(str) {
      return str.match(/^(\([0-9]{3}\) *|[0-9]{3}-*)[0-9]{3}-*[0-9]{4}$/) !== null;
    }
    // document.querySelector('[id="customer-Telephone"]').addEventListener('input', function(e) {
    //   var chk_val = telephoneCheck(this.value);
    //   if(chk_val == true){
    //       e.target.closest('.form__input-wrapper').querySelector('.error-msg').classList.remove('active');
    //   }else{
    //       e.target.closest('.form__input-wrapper').querySelector('.error-msg').classList.add('active');
    //   }
    // })

  }
  /*********************** Appliance Repair Form Page Validation End************************/

  /*********************** Return Warranty Page Validation Start************************/
  if (document.body.classList.contains("template-warranty") || document.body.classList.contains("template-gp-credit") ) {
    $(".warranty-form .return_warranty").submit(function (e) {
      e.preventDefault();
      $(".error-msg").removeClass("active");
      var FirstName = $("#customer-firstname").val();
      FirstName = $.trim(FirstName);
      var LastName = $("#customer-lastname").val();
      LastName = $.trim(LastName);
      var address = $("#customer-Address").val();
      address = $.trim(address);
      var email = $("#client-email").val();
      email = $.trim(email);
      var order = $("#customer-order").val();
      order = $.trim(order);
      var tel = $("#customer-Telephone").val();
      tel = $.trim(tel);
      var ele = null;
      if (FirstName == "" || LastName == "" || address == "" || email == "" || order == "" || tel == "") {
        if (FirstName == "") {
          $("#customer-firstname").next("span").addClass("active");
          ele = ele == null ?  $("#customer-firstname") : ele;
        }
        if (LastName == "") {
          $("#customer-lastname").next("span").addClass("active");
          ele = ele == null ? $("#customer-lastname") : ele;
        }
        if (address == "") {
          $("#customer-Address").next("span").addClass("active");
          ele = ele == null ? $("#customer-Address") : ele;
        }
        if (email == "") {
          $("#client-email").next("span").addClass("active");
          ele = ele == null ? $("#client-email") : ele;
        }
        if (order == "") {
          $("#customer-order").next("span").addClass("active");
          ele = ele == null ? $("#customer-order") : ele;
        }
        if (tel == "") {
          $("#customer-Telephone").next("span").addClass("active");
          ele = ele == null ? $("#customer-Telephone") : ele;
        }
        if( ele != null ){
          /*$('html,body').animate({
            scrollTop: (ele.offset().top - ( $('.section-header').height() + 15 ) )
          },500);*/
        }
      } else {
        var form = $(this);
        var url = form.attr("action");

        $.ajax({
          type: "POST",
          url: url,
          data: form.serialize(),
          success: function (data) {
            $('body, html').animate({ scrollTop: 0 });
            form.hide();
            form.closest(".warranty-form").find("#success-msg").html("<h3>Merci</h3>").fadeIn(300);
          },
        });
      }
    });
  }

  if (document.body.classList.contains("template-warranty") || document.body.classList.contains("template-appliance-repair") || document.body.classList.contains("template-gp-credit") ) {
    document.querySelectorAll('form .field__required').forEach(function(ele, eleIndex, eleArray){
      ele.addEventListener("focus", inputFunction);
      ele.addEventListener("blur", inputFunction);    
    });
  
    function inputFunction(event){
      var _field = event.target.closest('.field')
      if( event.target.value == '' ){
        _field.querySelector('.error-msg').classList.add('active');
      }else{
        if( event.target.type == "email" && !validateEmail(event.target.value) ){
          _field.querySelector('.error-msg').classList.add('active');
        }else {
          if( _field && _field.querySelector('.error-msg').classList.contains('active') ){
            _field.querySelector('.error-msg').classList.remove('active');
          }
        }
      }
    }

    function validateEmail(mail) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){ return (true); }
      return (false);
    }
  }
  /******************************Return Warranty Page Validation End************************/

  /************************faq page **********************/
  if (document.body.classList.contains("template-faq")) {
    // faq search
    $(document).on("keyup", "#sidebar-faq-search", function () {
      var q = $(this).val().toLowerCase();
      if (q.length >= 3) {
        $("[data-content]").addClass("hidden");
        $("[data-content*='" + q + "']").removeClass("hidden");

        $("[data-content*='" + q + "'].faq-qa-btn").closest("[data-faq-row]").addClass("active").find("[data-faq-title]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-qa-btn").closest("[data-faq-row]").find("[data-faq-qa-list]").slideDown();
        $("[data-content*='" + q + "'].faq-qa-btn").closest("[data-faq-question-wrap]").removeClass("hidden");

        $("[data-content*='" + q + "'].faq-title").closest("[data-faq-row]").find("[data-faq-qa-list] [data-faq-question-wrap]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-title").closest("[data-faq-row]").find("[data-faq-qa-list] [data-faq-question-wrap] [data-faq-question]").removeClass("hidden");

        $("[data-content*='" + q + "'].faq-qa-wrap").closest("[data-faq-row]").find("[data-faq-title]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-qa-wrap").closest("[data-faq-row]").addClass("active").find("[data-faq-qa-list]").slideDown();
        $("[data-content*='" + q + "'].faq-qa-wrap").find("[data-faq-question]").removeClass("hidden");
        $("[data-content*='" + q + "'].faq-qa-wrap").addClass("active").find("[data-faq-ans]").slideDown();

        // console.log("qa",$("[data-content*='" + q + "']"));
      } else {
        $("[data-content]").removeClass("hidden");
      }
    });

    // faq category show/hide
    $(document).on("click", "[data-faq-category]", function (e) {
      //remove hidden class and set blank search input
      e.preventDefault();
      $(".sidebar-faq-topics .faq-cat-list li.active").removeClass("active");
      $(this).parent().addClass("active");
      var header = $("sticky-header").outerHeight(true) || 0;
      var id = $(this).attr("href");
      $("html, body").stop();
      $("html, body").animate({
          scrollTop: $(id).offset().top - header - 23,
        },200);

      $("[data-content]").removeClass("hidden");
      $(".faq-content-wrapper #sidebar-faq-search").val("");
    });

    //faq questions/answer toggle
    $(document).on("click", "[data-faq-question-wrap] [data-faq-question]", function () {
        $(this).closest(".faq-row").siblings().find("[data-faq-question-wrap]").removeClass("active").find("[data-faq-ans]").slideUp();
        $(this).closest("[data-faq-question-wrap]").siblings().removeClass("active").find("[data-faq-ans]").slideUp();
        $(this).closest("[data-faq-question-wrap]").toggleClass("active").find("[data-faq-ans]").slideToggle();
      });
  }
  /*********************** END faq page ******************/

  $(document).on("click", ".fullhrs", function () {
    $(this).find("ul").slideToggle();
  });

  if (document.querySelector(".AT_timing") != null) {
    var crntDayFr = document
      .querySelector(".AT_timing")
      .getAttribute("data-current-day");
    var opnHours = "";

    $(".AT_timing .week_day").each(function (key, val) {
      var opnDay = $(this).text().trim();
      if (opnDay.indexOf(crntDayFr) > -1) {
        $(this).next().addClass("today-date");
        opnHours = $(this).next(".today-date").text().trim();
      }
    });
  }

  $(".today-date").each(function () {
    var html = $(this).text().trim();
    $(this).closest(".content-item").find(".open_hours_text span").text(html);
  });

  
  
});


function getHTMLData() {
  if ($(".product__info-wrapper .page-custom-handlize").length) {
    var page_handle = $(".page-custom-handlize").text();
    $.ajax({
      type: "GET",
      url: page_handle,
      dataType: "html",
      success: function (data) {
        var dataGet = $(data).filter("#MainContent").html();
        $(".pages-content-custom").html(dataGet);
      },
    });
  }
}

function announcementBarSlider() {
  document.querySelectorAll('[data-slider-announcement-bar] .announcement-bar__message span').forEach(function(el){
    el.closest('.swiper-slide').setAttribute('data-height', el.offsetHeight);
  });
  var mySwiper = new Swiper("[data-slider-announcement-bar]", {
    direction: "vertical",
    slidesPerView: 1,
    spaceBetween: 0,
    allowTouchMove: false,
    speed: 700,
    loop: true,    
    autoHeight: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".slider-button--next",
      prevEl: ".slider-button--prev"
    }
  });  
  // mySwiper.on('slideChangeTransitionStart', function (swiper) {
  //   var _height = Number($(swiper.el).find('.swiper-slide-active').attr('data-height')) + 20;
  //   /*$(swiper.el).css("height",'');*/
  //   $(swiper.el).removeClass('largeAnnocement')
  //   if( _height > 33 ){
  //     /*$(swiper.el).height(_height);*/
  //     $(swiper.el).addClass('largeAnnocement')      
  //   }
  // });
}


function promotionBarSlider(){
  const promo_carousel = document.querySelector('.promotion-section [data-promotion-bar]');
  if(!promo_carousel) return;

  // breakpoint where swiper will be destroyed
  const breakpoint = window.matchMedia('(max-width: 989px)');
  let mySwiper; // keep track of swiper instances to destroy later

  const enableSwiper = function() {
    mySwiper = new Swiper (promo_carousel, {
      slidesPerView: 1,
      allowTouchMove: false,
      speed: 800,
      loop: true,    
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: ".slider-button--next",
        prevEl: ".slider-button--prev"
      }
    });
  };
  
  const breakpointChecker = function() {
    // if larger viewport then destroy swiper instances
    if (breakpoint.matches) {
      return enableSwiper();
    } else if (breakpoint.matches === false) {
      if (mySwiper !== undefined) mySwiper.destroy(true, true);
      return;
    }
  };
  
  breakpoint.addListener(breakpointChecker); // keep an eye on viewport size changes
  breakpointChecker(); // call on-load
}


function footerAccordion() {
  $(document).on(
    "click",
    "[data-footer-accordion] [data-footer-accordion-btn]",
    function (e) {
      e.preventDefault();
      $(this).closest("[data-footer-accordion]").siblings().removeClass("active").find("[data-footer-accordion-content]").slideUp();
      $(this).closest("[data-footer-accordion]").toggleClass("active").find("[data-footer-accordion-content]").slideToggle();
    }
  );
}

function heroSectionSlider() {
  var heroSec = new Swiper(".hero-section [data-hero-section]", {
    loop: false,
    // allowTouchMove: false,
    effect: 'slide',
    speed: 700,
    slidesPerView: 1,
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    pagination: {
      el: ".hero-section .swiper-pagination",
      clickable: true
    },
    navigation: {
      nextEl: ".hero-section-nav .slider-next",
      prevEl: ".hero-section-nav .slider-prev"
    },
    on: {
      init: function(slide){
        //get height if layout 2 option is active
        if(slide.el.closest('.hero-layout-two')){
          let swipPagination = slide.el.closest('.hero-layout-two').querySelector('.swiper-pagination');
          if(swipPagination && document.body.clientWidth < 750){
            setTimeout(function(){
              let firstSlideHeight = slide.slides[0].querySelector('.right-col .big-img-box').offsetHeight;
              swipPagination.style.top = `${firstSlideHeight}px`;
            },150);
          }
        }
      },
      slideChange: function (slide) {
       //console.log('slide changed >>', slide);
        //add active class, if banner is half image banner option active
        let getActiveIndex = slide.activeIndex;
        slide.el.classList.remove('half-banner-active');
        if(slide.slides[getActiveIndex].classList.contains('banner-half-img')){
          slide.el.classList.add('half-banner-active');
        }

        mediaControl(slide);
      }
    }
  });

  function mediaControl(slide) {
    
    var autoplayVid = slide.wrapperEl.querySelectorAll(".slideshow__slide .autoplay-true");
    if(autoplayVid.length){
      autoplayVid.forEach((vid) => {
        if (vid.nodeName == "VIDEO") {
          vid.pause();
        } else {
          var src = vid.getAttribute("src");
          vid.removeAttribute("src");
          if (!vid.hasAttribute("data-src")) {
            vid.setAttribute("data-src", src);
          }
        }
      });
    }

    var videoHolders = slide.wrapperEl.querySelectorAll(".slideshow__slide video-holder");
    if (videoHolders.length) {
      videoHolders.forEach((videoWrap) => {
        var videoEle = videoWrap.querySelector(".video");
        setTimeout(function () {
          if (videoEle) {
            if (videoEle.nodeName == "VIDEO") {
              videoEle.pause();
            } else {
              videoEle.removeAttribute("src");
            }
            videoWrap.classList.remove("active");
          }
        }, 300);
      });
    }

    setTimeout(function () {
      var activeSlidesWrap = slide.wrapperEl.querySelectorAll(".slideshow__slide.swiper-slide-active .autoplay-true");
      if (activeSlidesWrap.length) {
        activeSlidesWrap.forEach((activeSlide_vid) => {
          if (activeSlide_vid.nodeName == "VIDEO") {
            activeSlide_vid.play();
          } else {
            var src = activeSlide_vid.getAttribute("data-src");
            activeSlide_vid.setAttribute("src", src);
          }
        });
      }
    }, 200);
    
  }

  function heroPagination(heroSec) {
    var currentPagiEle = heroSec.wrapperEl.closest("[data-hero-section]").querySelectorAll("[data-hero-current]");
    if (currentPagiEle.length) {
      currentPagiEle.forEach((curr) => {
        curr.innerText = heroSec.realIndex + 1;
      });
    }
    var totalPagiEle = heroSec.wrapperEl.closest("[data-hero-section]").querySelectorAll("[data-hero-total]");
    if (totalPagiEle.length) {
      totalPagiEle.forEach((total) => {
        total.innrtText = heroSec.slides.length;
      });
    }
  }
  
}

function multicolumnSlider() {
  if(document.body.clientWidth <= 749) return;
  let swiper = new Swiper("[data-swiper-slider]", {
    spaceBetween: 20,
    slidesPerView: 2.5,
    slidesPerGroupSkip: 1,
    loop: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: ".multicolumn-slider .swiper-next",
      prevEl: ".multicolumn-slider .swiper-prev"
    },
    breakpoints: {
      1501: {
        slidesPerView: 4.5,
      },
      1200: {
        slidesPerView: 3.5,
      },
    }
  });
}

function imageTextGallerySlider() {
  if(document.body.clientWidth <= 749) return;
  
  let swiperThumb = new Swiper("[data-image-text-gallery-thumb-slider]", {
    spaceBetween: 10,
    slidesPerView: 3.5,
    watchSlidesProgress: true
  });

  let swiper = new Swiper("[data-image-text-gallery-slider]", {
    spaceBetween: 20,
    effect: 'fade',
    speed: 700,
    slidesPerView: 1,
    allowTouchMove: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class="${className}">${index + 1}</span>`;
      }
    },
    thumbs: {
      swiper: swiperThumb
    }
  });
  
}

function shopCategoriesSlider() {
  if(document.body.clientWidth <= 749) return;
  let swiper = new Swiper("[data-shop-categories-slider]", {
    spaceBetween: 20,
    slidesPerView: 3.1,
    // slidesPerGroupSkip: 1,
    loop: true,
    navigation: {
      nextEl: ".shop-categories .swiper-next",
      prevEl: ".shop-categories .swiper-prev"
    },
    breakpoints: {
      990: {
        spaceBetween: 40,
      }
    }
  });
}

function hotspotSlider() {
  let swiper = new Swiper(".hotspot-img-text [data-hotspot-slider]", {
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: {
      nextEl: ".hotspot-img-text .swiper-next",
      prevEl: ".hotspot-img-text .swiper-prev"
    },
    pagination: {
      el: ".hotspot-img-text .swiper-pagination",
      clickable: true
    },
    breakpoints: {
      1500: {
        slidesPerView: 1.6,
        spaceBetween: 40
      },
      750: {
        slidesPerView: 1.1
      }
    }
  });
}

function imgTextSlider() {
  var imgText = new Swiper(".image-text-slider [data-image-text-slider]", {
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    longSwipes: false,
    navigation: {
      nextEl: ".image-text-slider-nav .slider-next",
      prevEl: ".image-text-slider-nav .slider-prev",
    },
    breakpoints: {
      1501: {
        slidesPerView: 1.4,
      },
      1200: {
        slidesPerView: 1.3,
      },
      990: {
        slidesPerView: 1.2,
      },
    },
    on: {
      init(imgText) {
        // set height
        if (document.body.clientWidth >= 990) {
          var slider = this;
          setTimeout(function () {
            var sliderEle =
              slider.slidesEl.closest("[data-image-text-slider]") || null;
            var activeHeight = slider.slidesEl.querySelector(
              ".swiper-slide-active"
            ).clientHeight;
            // console.log("activeHeight",activeHeight);
            if (sliderEle && activeHeight) {
              sliderEle.style.height = `${activeHeight}px`;
            }
          }, 500);
        }
        // set navigation element
        if (document.body.clientWidth >= 750) {
          var sliderNav =
            this.slidesEl
              .closest("[data-image-text-slider]")
              .querySelector(".slider-nav") || null;
          var activeWidth = this.slidesEl.querySelector(
            ".swiper-slide-active"
          ).clientWidth;
          var getX = this.slidesEl
            .querySelector(".swiper-slide-active")
            .getBoundingClientRect();
          if (sliderNav) {
            var left = activeWidth + (Math.abs(getX.x) - sliderNav.clientWidth);
            sliderNav.style.left = `${left}px`;
          }
        }
      },
    },
  });

  imgTextPagination(imgText);

  imgText.on("slideChange", function () {
    imgTextPagination(imgText); // for pagination
  });

  function imgTextPagination(imgText) {
    var currentPagiEle =
      imgText.wrapperEl
        .closest("[data-image-text-slider]")
        .querySelector("[data-hero-current]") || null;
    if (currentPagiEle) {
      currentPagiEle.innerText = imgText.realIndex + 1;
    }
    var totalPagiEle =
      imgText.wrapperEl
        .closest("[data-image-text-slider]")
        .querySelector("[data-hero-total]") || null;
    if (totalPagiEle) {
      totalPagiEle.innrtText = imgText.slides.length;
    }
  }
}

function collectionTabs() {
  // collection tab btn click
  $(document).on("click", "[data-collections-tabs] [data-coll-tab-btn]", function (e) {
    e.preventDefault();
    var handle = $(this).attr("data-handle");
    $(this).closest(`[data-collections-tabs]`).find(`.collections-tabs-wrap`).find(`[data-handle]`).removeClass("active");
    $(this).closest(`[data-collections-tabs]`).find(`.collections-tabs-wrap`).find(`[data-handle="${handle}"]`).addClass("active");
    $(this).closest(`[data-collections-tabs]`).find(`.collections-tabs-head`).find(`[data-coll-tab-btn]`).removeClass('active');
    $(this).addClass('active');
  });

  // load more btn - mobile
  $(document).on("click", "[data-collections-tabs] [data-coll-tab-loadmore-mob]", function (e) {
    e.preventDefault();
    $(this).addClass("loading");
    var btn = $(this);
    setTimeout(function () {
      btn.attr("disabled", "disabled");
      btn.addClass("hidden");
      if(btn.next('.spacer').length) btn.next('.spacer').addClass('hidden');
      btn.closest("[data-coll-tab-item]").find(".grid").find(".grid__item").fadeIn();
    }, 500);
  });

  // if option section style == slider
  if ($(window).width() >= 990 && $("[data-collections-tabs] .swiper").length) {
    var collectionTabsSwiper = new Swiper("[data-collections-tabs] .swiper", {
      // loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
      speed: 900,
      navigation: {
        nextEl: ".collections-tabs-nav .slider-next",
        prevEl: ".collections-tabs-nav .slider-prev",
      },
      breakpoints: {
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 40
        },
      },
    });

    // Set slider btn center of the product-card
    var height = 0, linkHeight = 0;
    let coollectionSliderArry = [];
    if(collectionTabsSwiper.length > 0){
      coollectionSliderArry = collectionTabsSwiper;
    }else{
     coollectionSliderArry.push(collectionTabsSwiper); 
    }  
    if(Object.keys(collectionTabsSwiper).length || coollectionSliderArry.length){
      for(let i=0; i<coollectionSliderArry.length; i++){
        var heightMinus = 0;
        var parent = coollectionSliderArry[i].wrapperEl.closest("slider-component") || null;

        // get value only first time, bcoz element found only for first slider
        if (parent && i == 0) {
          var itemContent = parent.querySelector(".grid__item .card > .card__content") || null;
          if (itemContent) height += itemContent.clientHeight;
          var linkWrap = parent.querySelector(".link-wrap") || null;
          if (linkWrap) linkHeight = Math.round(linkWrap.clientHeight);
        }
        heightMinus = height;
        var linkWrap = parent.querySelector(".link-wrap") || null;
        if (linkWrap) {
          var styles = getComputedStyle(linkWrap);
          var margin = Number(styles.marginTop.replace("px", ""));
          var h = Number(styles.height.replace("px", ""));
          heightMinus = heightMinus + linkHeight + margin;
        }
        var navBtns = parent.closest('.collections-tabs-item-wrap').querySelectorAll(".slider-nav.collections-tabs-nav .slider-btn");
        if (navBtns.length) {
          navBtns.forEach((btn) => {
            var count = (heightMinus + 15) / 2; // 15px is .card__inner - margin-bottom
            btn.style.marginTop = `-${count}px`;
          });
        }
      }
    }
    
  }
}

function faqSection() {
  $(document).on("click", "[data-faq-wrapper] [data-faq-que]", function (e) {
    e.preventDefault();
    $(this).closest("[data-faq-item]").siblings().removeClass("active").find("[data-faq-ans]").slideUp();
    $(this).closest("[data-faq-item]").toggleClass("active").find("[data-faq-ans]").slideToggle();
  });
}

// recently view load more btn - mobile
$(document).on("click",".recently-viewed-products [data-coll-tab-loadmore-mob]",function (e) {
  e.preventDefault();
  $(this).addClass("loading");
  var btn = $(this);
  setTimeout(function () {
    btn.attr("disabled", "disabled");
    btn.addClass("hidden");
    if(btn.next('.spacer').length) btn.next('.spacer').addClass('hidden');
    btn.closest(".recently-viewed-products").find(".swiper-slide").fadeIn();
  }, 500);
});

function hotspotsSection() {
  var hotspotsBtn = document.querySelectorAll(
    "[data-hotspot-product] [data-hotspot-btn]"
  );
  if (hotspotsBtn.length) {
    hotspotsBtn.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        btn.closest("[data-hotspot-product]").classList.toggle("active");
        var allHotspots = btn
          .closest(".hotspots-main")
          .querySelectorAll("[data-hotspot-product]");
        if (allHotspots.length) {
          allHotspots.forEach((item) => {
            if (item != btn.closest("[data-hotspot-product]")) {
              item.classList.remove("active");
            }
          });
        }
      });
    });
  }
}


function lazyLoadVideos() {
  var lazyVideos = [].slice.call(document.querySelectorAll(".vid-lazyload"));
  if(!lazyVideos.length) return;
  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
              videoSource.removeAttribute('data-src');
              videoSource.closest('video').classList.remove('vid-lazyload');
              if(videoSource.closest('video').querySelector('img')){
                videoSource.closest('video').querySelector('img').remove();
              }
            }
          }
          video.target.load();
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });
    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
}

function productCarousel() {
  if ($(window).width() >= 990 && $(".product--carousel [data-product-carousel]").length) {
    var productCarouselSwiper = new Swiper(".product--carousel [data-product-carousel]", {
      // loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
      speed: 900,
      navigation: {
        nextEl: ".product-carousel--nav .slider-next",
        prevEl: ".product-carousel--nav .slider-prev"
      },
      breakpoints: {
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 40
        }
      }
    });

    // Set slider btn center of the product-card
    var height = 0
    let coollectionSliderArry = [];
    if(productCarouselSwiper.length > 0){
      coollectionSliderArry = productCarouselSwiper;
    }else{
     coollectionSliderArry.push(productCarouselSwiper); 
    }  
    if(Object.keys(productCarouselSwiper).length || coollectionSliderArry.length){
      for(let i=0; i<coollectionSliderArry.length; i++){
        var heightMinus = 0;
        var parent = coollectionSliderArry[i].wrapperEl.closest("[data-product-carousel]") || null;

        // get value only first time, bcoz element found only for first slider
        if (parent && i == 0) {
          var itemContent = parent.querySelector(".grid__item .card > .card__content") || null;
          if (itemContent) height += itemContent.clientHeight;
        }
        heightMinus = height;
        var navBtns = parent.closest('.product--carousel').querySelectorAll(".product-carousel--nav .slider-btn");
        if (navBtns.length) {
          navBtns.forEach((btn) => {
            var count = (heightMinus + 15) / 2; // 15px is .card__inner - margin-bottom
            btn.style.marginTop = `-${count}px`;
          });
        }
      }
    }
    
  }
}

// hero section <video-holder> JS START
class videoGroup extends HTMLElement {
  constructor() {
    super();
    this.observeVideoElemenentViewPort();
  }

  observeVideoElemenentViewPort() {
    const observer = new IntersectionObserver((entries) => {
      //console.log('entry -->', entries);
      entries.forEach((entry) => {
        const intersecting = entry.isIntersecting;
        if (intersecting) {
          const targetVisibleEle = entry.target;
          setTimeout(() => {
            this.initVideo(targetVisibleEle);
          }, 150);
          observer.unobserve(targetVisibleEle);
        }
      });
    });
    observer.observe(this);
  }

  initVideo(target, windowWidth = document.body.getBoundingClientRect().width) {
    const figureEle = target.querySelector("figure");
    const videoEle = target.querySelector(".video");

    if (videoEle) {
      //iframe with no autoplay [ thumb click to play ]
      if (figureEle) {
        var temp = 0;
        figureEle.addEventListener("click", () => {
          if (temp == 0) {
            temp = 1;
            if (videoEle.nodeName == "VIDEO") {
              setTimeout(() => {
                // videoEle.load();
                videoEle.play();
              });
            } else {
              target
                .querySelector("iframe")
                .setAttribute(
                  "src",
                  target.querySelector("[data-src]").dataset.src
                );
            }
            target.classList.add("active");
          } else {
            temp = 0;
            target.classList.remove("active");
            if (videoEle.nodeName == "VIDEO") {
              videoEle.pause();
            } else {
              videoEle.removeAttribute("src");
            }
          }
        });
      }
    }
  }
}
customElements.define("video-holder", videoGroup);
// hero section <video-holder> JS END


/*********** Drop Down Click Trigger On Cart Start *************************/
$(".drop-down-list li").click(function () {
  var getOption = $(this).attr("data-number");
  $(this)
    .parents(".option-list")
    .children("label")
    .each(function () {
      var GetLable = $(this).attr("data-number");
      if (GetLable == getOption) {
        $(this).trigger("click");
      }
    });
});
/*********** Drop Down Click Trigger On Cart End *************************/

/*********************Header Script Start ***************/

$("body").on("click", "#Details-menu-drawer-container", function (e) {
  if (window.innerWidth < 990) return;  
  e.preventDefault();
  if ($(this).hasClass('mouseleaving')) return;
  $(this).toggleClass("open");  
  $(".headerMegaMenu").toggleClass("open");
  setTimeout(function(){
    $('body').hasClass('overflow-hidden-tablet') ? 
      $('body').removeClass('overflow-hidden-tablet') : 
      null;  
  },150);
  $('body').toggleClass("overflow-hidden-megaMenu");
  $(this).find(".header__icon").attr("aria-expanded", "false");
});

$(".hasChild").click(function () {
  if ($(this).hasClass("active")) {
    $(".hasChild").removeClass("active");
    $(this).parents(".headerMegaMenu").removeClass("showMegaMenu");
  } else {
    $(this).siblings("li").removeClass("active");
    $(this).addClass("active");
    $(this).parents(".headerMegaMenu").addClass("showMegaMenu");
  }
});

$(".header__inline-menu ul li .hasMegaMenu").click(function (e) {
  e.preventDefault();
  var ClassName = $(this).parents("li").attr("data-num");
  if ($("." + ClassName).hasClass("active")) {
    $(".hasChild").removeClass("active");
    $(this).parents(".headerMegaMenu").removeClass("showMegaMenu");
    if ($(".headerMegaMenu").hasClass("open")) {
      $(".header.header--top-left header-drawer summary.header__icon").trigger(
        "click"
      );      
    }
  } else {
    $(".mainUl li").removeClass("active");
    $("." + ClassName).addClass("active");
    if (!$(".headerMegaMenu").hasClass("open")) {
      $(".header.header--top-left header-drawer summary.header__icon").trigger(
        "click"
      );    
      !$(".header.header--top-left header-drawer .menu-drawer-container").hasClass('menu-opening') ? $(".header.header--top-left header-drawer .menu-drawer-container").addClass('menu-opening') : null;
    }
    $(".headerMegaMenu").addClass("open showMegaMenu");
    $(this).parents(".headerMegaMenu").addClass("showMegaMenu");
  }
});
/*********************Header Script End ***************/



function productMediaGallery() {
  let thumbSwiper = document.querySelector('[data-desktop-layout="thumbnail_slider"] [data-thumbnail-slider]');
  let gallerySwiper = document.querySelector('[data-desktop-layout="thumbnail_slider"] [data-gallery-slider]');
  let slideEffect = 'fade';
  let breakPoints = window.matchMedia('(max-width: 750px)');
  if (breakPoints.matches) {
    slideEffect = 'fade';
    gallerySwiper = document.querySelector('[data-gallery-slider]'); // slider is default for mobile screen
  }
  let thumbSwiperInit;
  if(thumbSwiper){
    thumbSwiperInit = new Swiper(thumbSwiper, {
      spaceBetween: 10,
      slidesPerView: "auto",
      freeMode: false,
      watchSlidesProgress: true
    });
  }

  if(gallerySwiper){
    let gallerySwiperInit = new Swiper(gallerySwiper, {
      effect: slideEffect,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      thumbs: {
        swiper: thumbSwiperInit ? thumbSwiperInit : null,
      },
      on: {
        transitionStart: function(){
          const allVideos = [...document.querySelectorAll('[data-gallery-slider] video, [data-gallery-slider] iframe')];
          if(allVideos.length) window.pauseAllMedia();
        },
        
        transitionEnd: function(){
          const activeIndex = this.activeIndex;
          const activeSlide = document.querySelectorAll('[data-gallery-slider] .swiper-slide')[activeIndex];
          const activeSlideVideo = activeSlide.getElementsByTagName('video')[0];
          if(activeSlideVideo) activeSlideVideo.play();
          //for external video
          const activeSlideIframe = activeSlide.getElementsByTagName('iframe')[0];
          if(activeSlideIframe){
            let iframeSrc = activeSlideIframe.getAttribute('src');
            if(iframeSrc.includes('?autoplay=0')){
              let newSrc = iframeSrc.replace('?autoplay=0','?autoplay=1&muted=1');
              activeSlideIframe.setAttribute('src',newSrc);
            }
            if(iframeSrc.includes('vimeo.com')){
              activeSlideIframe.contentWindow.postMessage('{"method":"play"}', '*');
            }else{
              activeSlideIframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            }
          }
        }
      }
    });
  }
  
}
function productMediaModalSlider(){
  let productMediaModal = document.querySelector('[data-media-modal-slider]');
  if(productMediaModal){
    let mediaModalSliderInit = new Swiper(productMediaModal, {
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      on: {
        transitionStart: function(){
          const allVideos = [...document.querySelectorAll('[data-media-modal-slider] video, [data-media-modal-slider] iframe')];
          if(allVideos.length) window.pauseAllMedia();
        },
        
        transitionEnd: function(){
          const activeIndex = this.activeIndex;
          const activeSlide = document.querySelectorAll('[data-media-modal-slider] .swiper-slide')[activeIndex];
          const activeSlideVideo = activeSlide.getElementsByTagName('video')[0];
          if(activeSlideVideo) activeSlideVideo.play();
          //for external video
          const activeSlideIframe = activeSlide.getElementsByTagName('iframe')[0];
          if(activeSlideIframe){
            let iframeSrc = activeSlideIframe.getAttribute('src');
            if(iframeSrc.includes('?autoplay=0')){
              let newSrc = iframeSrc.replace('?autoplay=0','?autoplay=1&muted=1');
              activeSlideIframe.setAttribute('src',newSrc);
            }
            if(iframeSrc.includes('vimeo.com')){
              activeSlideIframe.contentWindow.postMessage('{"method":"play"}', '*');
            }else{
              activeSlideIframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            }
          }
        }
      }
    });
  }
}

productMediaGallery();
productMediaModalSlider();



/* Collection mobile drawer js */
function openPanel(e){
  if(e.classList.contains('filters-drawer-btn')){
    document.querySelector('.facets-left-filters').classList.add('active');
    document.querySelector('html').classList.add('facets-drawer-open');  
  }
  if(e.classList.contains('mobile-filters-close')){
    document.querySelector('.facets-left-filters').classList.remove('active');
    document.querySelector('html').classList.remove('facets-drawer-open');  
  }
}




/* ***This will only render in the theme editor / customiser***** */
if (Shopify.designMode) {
  document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("shopify:section:load", function () {
      // announcement-bar-section
      const announceSlider =
        event.target.closest(".announcement-bar-section") || null;
      if (announceSlider) {
        announcementBarSlider();
      }

      //promobar section
      const promotionBarSection = event.target.closest(".promotion-section");
      if (promotionBarSection) {
        promotionBarSlider();
      }
      
      // hero-section
      const heroSection = event.target.closest(".hero-section") || null;
      if (heroSection) {
        heroSectionSlider();
        newHeroLayout4();
      }

      //multi coloumn slider section
      const multicolumnSliderSection = event.target.closest(".multicolumn-slider") || null;
      if (multicolumnSliderSection) {
        multicolumnSlider();
      }

      //image-text-gallery section
      const imageTextGallerySliderSection = event.target.closest(".image-text-gallery") || null;
      if (imageTextGallerySliderSection) {
        imageTextGallerySlider();
      }
      

      // image-with-text-slider.liquid
      const imgTextSliderSec = event.target.closest(".image-text-slider") || null;
      if (imgTextSliderSec) {
        imgTextSlider();
      }

      // collections-tabs.liquid
      const collTabs = event.target.closest(".collections-tabs") || null;
      if (collTabs) {
        collectionTabs();
      }
      
      //product carousel slider section
      const productCarouselSliderSection = event.target.closest(".product--carousel") || null;
      if (productCarouselSliderSection) {
        productCarousel();
      }

      //multi coloumn slider section
      const shopCategoriesSection = event.target.closest(".shop-categories") || null;
      if (shopCategoriesSection) {
        shopCategoriesSlider();
      }

      //hotspot-img-text.liquid section
      const hotspotSliderEle = event.target.closest(".hotspot-img-text") || null;
      if (hotspotSliderEle) {
        hotspotSlider();
      }
      
    });
  });
}
