// function productMediaGallery() {
//   let thumbSwiper = document.querySelector('[data-desktop-layout="thumbnail_slider"] [data-thumbnail-slider]');
//   let gallerySwiper = document.querySelector('[data-desktop-layout="thumbnail_slider"] [data-gallery-slider]');
//   let slideEffect = 'slide';
//   let breakPoints = window.matchMedia('(max-width: 750px)');
//   if (breakPoints.matches) {
//     slideEffect = 'fade';
//     gallerySwiper = document.querySelector('[data-gallery-slider]'); // slider is default for mobile screen
//   }
//   let thumbSwiperInit;
//   if(thumbSwiper){
//     thumbSwiperInit = new Swiper(thumbSwiper, {
//       spaceBetween: 10,
//       slidesPerView: 8.5,
//       freeMode: false,
//       watchSlidesProgress: true
//     });
//   }

//   if(gallerySwiper){
//     let gallerySwiperInit = new Swiper(gallerySwiper, {
//       effect: slideEffect,
//       navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev"
//       },
//       thumbs: {
//         swiper: thumbSwiperInit ? thumbSwiperInit : null,
//       },
//       on: {
//         transitionStart: function(){
//           const allVideos = [...document.querySelectorAll('[data-gallery-slider] video, [data-gallery-slider] iframe')];
//           if(allVideos.length) window.pauseAllMedia();
//         },
        
//         transitionEnd: function(){
//           const activeIndex = this.activeIndex;
//           const activeSlide = document.querySelectorAll('[data-gallery-slider] .swiper-slide')[activeIndex];
//           const activeSlideVideo = activeSlide.getElementsByTagName('video')[0];
//           if(activeSlideVideo) activeSlideVideo.play();
//           //for external video
//           const activeSlideIframe = activeSlide.getElementsByTagName('iframe')[0];
//           if(activeSlideIframe){
//             let iframeSrc = activeSlideIframe.getAttribute('src');
//             if(iframeSrc.includes('?autoplay=0')){
//               let newSrc = iframeSrc.replace('?autoplay=0','?autoplay=1');
//               activeSlideIframe.setAttribute('src',newSrc);
//             }
//             activeSlideIframe.contentWindow.postMessage('{"method":"play"}', '*');
//           }
//         }
//       }
//     });
//   }
  
// }
// function productMediaModalSlider(){
//   let productMediaModal = document.querySelector('[data-media-modal-slider]');
//   if(productMediaModal){
//     let mediaModalSliderInit = new Swiper(productMediaModal, {
//       navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev"
//       },
//       on: {
//         transitionStart: function(){
//           const allVideos = [...document.querySelectorAll('[data-media-modal-slider] video, [data-media-modal-slider] iframe')];
//           if(allVideos.length) window.pauseAllMedia();
//         },
        
//         transitionEnd: function(){
//           const activeIndex = this.activeIndex;
//           const activeSlide = document.querySelectorAll('[data-media-modal-slider] .swiper-slide')[activeIndex];
//           const activeSlideVideo = activeSlide.getElementsByTagName('video')[0];
//           if(activeSlideVideo) activeSlideVideo.play();
//           //for external video
//           const activeSlideIframe = activeSlide.getElementsByTagName('iframe')[0];
//           if(activeSlideIframe){
//             let iframeSrc = activeSlideIframe.getAttribute('src');
//             if(iframeSrc.includes('?autoplay=0')){
//               let newSrc = iframeSrc.replace('?autoplay=0','?autoplay=1');
//               activeSlideIframe.setAttribute('src',newSrc);
//             }
//             activeSlideIframe.contentWindow.postMessage('{"method":"play"}', '*');
//           }
//         }
//       }
//     });
//   }
// }
// productMediaGallery();
// productMediaModalSlider();



/******product page slider****************/

// var elem = document.querySelector('.carousel.product__image-slider');

// if ($(window).width() < 750) {
//   var flkty = new Flickity( elem, {
//     contain: true,
//     imagesLoaded: true,
//     lazyLoad: 1,
//     wrapAround: true,
//     pageDots: false,
//     prevNextButtons: true,
//     fade: true,
//     adaptiveHeight: true
//   });
// }
// else{
//   var flkty = new Flickity( elem, {
//     contain: true,
//     imagesLoaded: true,
//     lazyLoad: 1,
//     wrapAround: true,
//     pageDots: false,
//     prevNextButtons: true,
//     adaptiveHeight: true
//   });  
// }
// flkty.on( 'change', function( index ) {
//   $(".video-slider__cell-video").each(function(){
//    var GetIndex = $(this).attr("data-index");
//     var srcing = ($(this)[0].src);
//     srcing = srcing.replace("&autoplay=0","");
//     srcing = srcing.replace("&autoplay=1","");
//     if(GetIndex==index)
//     {
//       srcing = srcing.split("?");
//       srcing = srcing[0]+"?autoplay=1&"+srcing[1];
//       $(this)[0].src = srcing;
//       console.log($(this)[0].src);
//     }
//     else{
//       srcing = srcing.split("?");
//       srcing = srcing[0]+"?autoplay=0&"+srcing[1];
//       $(this)[0].src = srcing;
//       console.log($(this)[0].src);
//     }
    
//    })
// });
// var elemThumbnail = document.querySelector('.carousel.product__image-thumbnail');
// var mediaGet = $(".carousel.product__image-slider").attr("data-media");
// if(mediaGet < 5){
//   var flktyB = new Flickity( elemThumbnail, {
//     asNavFor: '.carousel.product__image-slider',
//     contain: true,
//     imagesLoaded: true,
//     wrapAround: false,
//     draggable: false,
//     lazyLoad: 4,
//     pageDots: false,
//     prevNextButtons: false
//   });    
// }
// else{
//   var flktyB = new Flickity( elemThumbnail, {
//     asNavFor: '.carousel.product__image-slider',
//     contain: true,
//     imagesLoaded: true,
//     wrapAround: true,
//     lazyLoad: 4,
//     pageDots: false,
//     prevNextButtons: true
//   });
// }

// // fancybox insilaze & options //
// $("[data-fancybox]").fancybox({
//   loop: true,
//   hash: true,
//   /* uncomment to get extra buttons */
//   buttons: [
//     "close"
//   ],
//   infobar: true,
//   transitionEffect: "slide",
//   thumbs: {
//     autoStart: false, // Display thumbnails on opening
//     hideOnClose: true, // Hide thumbnail grid when closing animation starts
//     parentEl: ".fancybox-container", // Container is injected into this element
//     axis: "y" // Vertical (y) or horizontal (x) scrolling
//   },

//   /* Change click to zoom - to click to next////////////////////
//   clickContent - i modify the deafult - now when you click on the image you go to the next image - i more like this approach than zoom on desktop (This idea was in the classic/first lightbox) */
//   clickContent: function(current, event) {
//     return current.type === "image" ? "next" : false;
//   },
//   beforeShow: function(instance, slide) {
//       // Reference to DOM element of the slide
//       $(".video-slider__cell-video").each(function(){
//             var srcing = ($(this)[0].src);
//             srcing = srcing.replace("&autoplay=0","");
//             srcing = srcing.replace("&autoplay=1","");
//             $(this)[0].src = srcing+"&autoplay=0";
//       })
//   },
//   //EVENT UPDATE Flickity index when you close fancybox3 zoom mode
//   beforeClose: function(instance, slide) {
//     // Reference to DOM element of the slide
//     flkty.select(this.index, false, true);
//   },
//   afterClose: function(instance, slide) {
//     // Reference to DOM element of the slide
//     var srcing = $(".carousel-cell.custom-video.is-selected .video-slider__cell-video")[0].src;
//     srcing = srcing.replace("&autoplay=0","");
//     srcing = srcing.replace("&autoplay=1","");
//     $(".carousel-cell.custom-video.is-selected .video-slider__cell-video")[0].src = srcing+"&autoplay=1";
//   }
// });
// $(window).ready(function() {
//   if($(".current-image").length > 0)
//   {
//   var GetIndexstart = $(".current-image img").attr("data-index");
//     flkty.select( GetIndexstart-1 );
//   }
//   $(".custom-wrapp").css("opacity","1");
// })

// $( document ).ready(function() {
//  $("select.protection_plan").val($('.prot-selected.prot_plan_text').text());
// });

// $(document).on("click",".protection_plan-main .protection_plan-global .prot-selected",function(){
//   $(this).siblings('ul').fadeToggle(300);
//   $("div.protection_plan-global").toggleClass("opened");
// });

/*********************** Select Protection Product on PDP Start*******************************/
// $(document).on("click",".protection_plan-main .protection_plan-list li",function(){
//   if($(this).hasClass("active")){
//     $(this).removeClass("active");
//   }else{
//     $(this).addClass("active");
//     $(this).siblings("li").removeClass("active");
//   }
// });
/*********************** Select Protection Product on PDP End*******************************/


/*********************** Add to cart on PDP Start*******************************/

// document.querySelector(".product-form__buttons .product-form__submit[name='add']").addEventListener("click", function (event) {
//   event.preventDefault();
//   var selected_plan = document.querySelector('.off-item.active').getAttribute('data-val');
//   var timestamp_chk = Date.now();
//   document.querySelector('.input_prop').value = timestamp_chk;

//   if(selected_plan == "2 year" || selected_plan == "4 year" || selected_plan == "yes" || selected_plan == "2 ans" || selected_plan == "4 ans" || selected_plan == "Oui"){
//     var dataVid = parseInt(document.querySelector('.off-item.active').getAttribute('data-vid'));
//     var sku_val = document.querySelector('.off-item.active').getAttribute('data-sku');
//     var Product_Name = document.querySelector('.off-item.active').getAttribute('data-prodHandle');
//     var time_string = timestamp_chk.toString();
//     var update_data = { 
//       'id': dataVid,
//       'quantity': 1,
//       'properties': {
//         'Warranty_product':'true',
//         'timestamp':time_string,
//         'Product_Name':Product_Name
//       }
//     }
//     var form_element = event.target.closest('form');
//     var form_variantId = event.target.closest('form').querySelector('[name="id"]').value;
//     var form_qty = event.target.closest('form').querySelector('[name="quantity"]') ? event.target.closest('form').querySelector('[name="quantity"]').value : 1;

//     const config = fetchConfig('javascript');
//     config.headers['X-Requested-With'] = 'XMLHttpRequest';
//     delete config.headers['Content-Type'];
//     const formData = new FormData(event.target.closest('form'));
    
//     if (event.target.closest('product-form').cart) {
//       formData.append('sections',event.target.closest('product-form').cart.getSectionsToRender().map((section) => section.id));
//       formData.append('sections_url', window.location.pathname);
//       event.target.closest('product-form').cart.setActiveElement(document.activeElement);
//     }
//     config.body = formData;

//     fetch(`${routes.cart_add_url}`, config)
//       .then((response) => response.json())
//       .then((response) => {
//         event.target.closest('product-form').cart.renderContents(response);
//       })
//       .catch((e) => {
//         console.error(e);
//       })
//       .finally(() => {
//         console.log('Done');
//       });
//   }
  
// });


// $(document).on('click','.product-form__buttons .product-form__submit[name="add"]',function(e){

//   if(selected_plan == "2 year" || selected_plan == "4 year" || selected_plan == "yes" || selected_plan == "2 ans" || selected_plan == "4 ans" || selected_plan == "Oui"){
      
    
      
//     $.ajax({
//       type: 'POST',
//       url: '/cart/add.js',
//       data: update_data,
//       dataType: 'json',
//       success:function(data) {
      
//         $('.protection_property').html("<input type='hidden' class='protection__plan' value='true' name='properties[Garantie_ajoutee]'>");
//         var dataSerialize = form_element.serialize();
        
//         $.ajax({
//           type: 'POST',
//           url: '/cart/add.js',
//           data: dataSerialize,
//           dataType: 'json',
//           success:function(data) { 
        
//             document.documentElement.dispatchEvent(new CustomEvent('product:added', {
//               bubbles: true,
//               detail: {
//                 variant:form_variantId,
//                 quantity: parseInt(form_qty)
//               }
//             }));
            
//             $.ajax({
//               type: "GET",
//               url: "/cart",
//               dataType: 'html',
//               success: function(data){
//                 var newLink = window.location.href;
//                 newLink = newLink+"?add";
//                 window.location.href = "/cart" ;
//               }
//             })
            
//           },
//           error:function(error){
//             console.log(error);
//           }
//         });
      
//       },
//       error:function(error){
//         console.log(error);
//       }
//     });
    
//   }
  
// })

// $(document).on("click", function (e) {
//    if ($(e.target).is(".prot_plan_text") === false) { 
//       if ($("div.protection_plan-global").hasClass("opened")  ) { 
//        $("div.protection_plan-global").removeClass('opened');                                                          
//       }
//     } 
// });
/*********************** Add to cart on PDP End*******************************/


/******************Slide Drawer on PDP Start *******************************************/

// $(".crossdiv").click(function(){
//   $(".overlayimg").fadeOut();
//   $(".inline-page").removeClass("is-active");
//   $('body').removeClass("is-active"); 
//   $('#overlay').removeClass("is-active");
// });

// $('body').on('click', '.cover-link', function(e){
//   e.preventDefault();
//   $(".inline-page").addClass("is-active");
//   $('#overlay').addClass("is-active");
//   $('body').addClass("is-active");       
// });

// $(".overlayimg").click(function(){
//   $(".overlayimg").fadeOut();
//   $('body').removeClass("is-active");
//   $('body').removeClass("is-active");
// });

// $('body').on('click', '.close-cart-img', function(e){
//   e.preventDefault();
//   $('body').removeClass("is-active");
//   $('body').removeClass("is-active");
// });

// $('body').on('click', '#overlay', function(){
//   $(this).removeClass("is-active");
//   $(".inline-page").removeClass("is-active");
//   $('body').removeClass("is-active");         
// }); 

/******************Slide Drawer on PDP End *******************************************/

