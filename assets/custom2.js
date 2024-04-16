$(function() {


  if(document.querySelector('#sort-by .title-with-icon')){
    document.querySelector('#sort-by .title-with-icon').addEventListener("click",function(event){
      event.target.closest('#sort-by').classList.toggle('active');
    });  
  }
  
  $(document).on("click",".protection_plan-main .protection_plan-global .prot-selected",function(){
    $(this).siblings('ul').fadeToggle(300);
    $("div.protection_plan-global").toggleClass("opened");
  });
  
  /*********************** Select Protection Product on PDP Start*******************************/
  
  var li_list = document.querySelectorAll('.protection_plan-main .protection_plan-list li');
  if(li_list.length > 0){
    li_list.forEach((list) => {
      list.addEventListener("click", function(event){ 
        if(list.classList.contains('active')){
          list.classList.remove('active');
        }else{
          if(document.querySelector('.protection_plan-main .protection_plan-list li.active')){
            document.querySelector('.protection_plan-main .protection_plan-list li.active').classList.remove('active');
          }
          list.classList.add('active');
        }
      });
    });  
  }
  /*********************** Select Protection Product on PDP End*******************************/
  
  /******************Slide Drawer on PDP Start *******************************************/
  
  $(".crossdiv").click(function(){
    $(".overlayimg").fadeOut();
    $(".inline-page").removeClass("is-active");
    $('body').removeClass("is-active"); 
    $('#overlay').removeClass("is-active");
  });
  
  $(".overlayimg").click(function(){
    $(".overlayimg").fadeOut();
    $('body').removeClass("is-active");
    $('body').removeClass("is-active");
  });
  
  var cover_links = document.querySelectorAll('.cover-link');
  if(cover_links.length){
    cover_links.forEach((link) => {
      link.addEventListener("click", function(event){ 
        event.preventDefault();
        if(document.querySelector('.inline-page')){
          document.querySelector('.inline-page').classList.add('is-active');
          document.querySelector('#overlay').classList.add('is-active');
          document.querySelector('body').classList.add('is-active');
        }
      });
    });  
  }
  
  var close_links = document.querySelectorAll('.close-cart-img');
  if(close_links.length){
    close_links.forEach((link) => {
      link.addEventListener("click", function(event){ 
        event.preventDefault();
        document.querySelector('.inline-page').classList.remove('is-active');
        document.querySelector('#overlay').classList.remove('is-active');
        document.querySelector('body').classList.remove('is-active');
      });
    });
  }
  
  if(document.querySelector('#overlay')){
    document.querySelector('#overlay').addEventListener('click', function(event){
      event.target.classList.remove('is-active');
      document.querySelector('.inline-page').classList.remove('is-active');
      document.querySelector('body').classList.remove('is-active');
    });
  }
  
  /******************Slide Drawer on PDP End *******************************************/
  
  
  /********************* see more description **********************/
  if(document.querySelector('.moredescription')){
    document.querySelector('.moredescription').addEventListener('click', function(){
      if(document.querySelector('.product__description').classList.contains('active')){
       document.querySelector('.product__description').classList.remove('active');
       document.querySelector('.product__description .more-des').style.height = '65px';
       document.querySelector('.moredescription').innerHTML = 'Read More';
      }else{
       document.querySelector('.product__description').classList.add('active');
       document.querySelector('.product__description .more-des').style.height = document.querySelector('.product__description .more-des .des-inner').scrollHeight + 'px';
       document.querySelector('.moredescription').innerHTML = 'Read Less';
      }
    });  
  }
  
  /********************* see more description End **********************/
  
  
  /************************** Close Button For mobile accordian drawer ******************/
  if(document.querySelector('.close-btn')){
    document.querySelector('.close-btn').addEventListener('click',function(){
      document.querySelector('.mobile-accordian').classList.remove('active');
      document.body.classList.remove('overlay-active');
    });
  }
  /************************** Close Button For mobile accordian drawer END ******************/

  
});



function toggleFilterAccordion(element) {
  const tabTitle = element.getAttribute('data-title');
  if(document.querySelector('.mobile-accordian')){
    document.querySelectorAll('.mobile-accordian .accordion-item').forEach((accordianMobile) => {accordianMobile.classList.add('hidden');});
    document.querySelector('.mobile-accordian .accordion-item .accordion-body[data-title="'+tabTitle+'"]').parentElement.classList.remove('hidden');
    document.querySelector('.mobile-accordian').classList.add('active');
    document.body.classList.add('overlay-active');
  }
}

