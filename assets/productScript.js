 $(document).ready(function(){
           function getHTMLData(){
    var page_handle = $(".page-custom-handlize").text();
    $.ajax({
      type: 'GET',
      url: page_handle,
      dataType: 'html',
      success: function(data) {
        var dataGet=$(data).filter('#MainContent').html();
        $('.pages-content-custom').html(dataGet);
      }
    });
  }
  if (Shopify.designMode) {
     document.addEventListener("DOMContentLoaded", function() {
      document.addEventListener('shopify:section:load', function(){
        getHTMLData();
      });
    });
  }
        var swatchjson_color = "";
        
        
        if(swatchjson_color != ""){
              var dataswatch = swatchjson_color;
      
              var main_title = '';
              if(dataswatch.length > 0){
                for(var i=0;i<dataswatch[0].Products.length;i++){
                  jQuery.getJSON('/products/'+dataswatch[0].Products[i]+'.js', function(product_obb) {
                      var chk_color_variant = false;
                      for(var x=0; x<product_obb.tags.length; x++){
                        if(product_obb.tags[x].indexOf('Color') != -1 || product_obb.tags[x].indexOf('Fr_Couleur_') != -1){
                            chk_color_variant = true;
                        }
                      }
                        if(chk_color_variant == true){
                          if(product_obb.handle == main_title){
                            
                            $('.Color_swatch .product_list').append('<li class="active"><a href="'+product_obb.url+'"><img src="'+product_obb.featured_image+'"></a></li>');
                            
                          }else{
                            
                            $('.Color_swatch .product_list').append('<li><a href="'+product_obb.url+'"><img src="'+product_obb.featured_image+'"></a></li>');
                            
                          }
                        }
                  });
                }
                

      if(dataswatch[0].Option == 'Size' || dataswatch[0].Option == 'Taille'){
                  for(var j=0;j<dataswatch[0].Products.length;j++){

                    
                    var link_url = '/products/'+dataswatch[0].Products[j]+'?view=metafields';
                    
      
                    $.get(link_url, function(data) {
                      var main_prod_obj = JSON.parse($(data).text());
                      var prod_data = main_prod_obj.product;
                      var meta_data = main_prod_obj.metafield.Values;
                      console.log(meta_data);
      
                      if(prod_data.handle == main_title){
                        for (var data1, i = 0; item = meta_data[i++];) {
                          if(item[1] == 'Size' || item[1] == 'Taille'){
                            
                              $('.Size_swatch .product_list').append('<li class="active"><a href="/products/'+prod_data.handle+'">'+item[2]+'</a></li>');
                            
                          }
                        }
                      }else{
                        for (var data1, i = 0; item = meta_data[i++];) {
                          if(item[1] == 'Size' || item[1] == 'Taille'){
                            
                            $('.Size_swatch .product_list').append('<li><a href="/products/'+prod_data.handle+'">'+item[2]+'</a></li>');
                            
                          }
                        }
                      }
                    });
                  }
                  if(dataswatch[0].Products.length > 0){
                    $('.Size_swatch').removeClass('hide');
                  }
                }else{
                  if(dataswatch[0].Products.length > 0){
                    $('.Color_swatch').removeClass('hide');
                  }
                }

      
                if(dataswatch.length > 1){
                  for(var j=0;j<dataswatch[1].Products.length;j++){
                    
                    
                    var link_url = '/products/'+dataswatch[1].Products[j]+'?view=metafields';
                    
      
                    $.get(link_url, function(data) {
                      var main_prod_obj = JSON.parse($(data).text());
                      var prod_data = main_prod_obj.product;
                      var meta_data = main_prod_obj.metafield.Values;
                      console.log(meta_data);
      
                      if(prod_data.handle == main_title){
                        for (var data1, i = 0; item = meta_data[i++];) {
                          if(item[1] == 'Size' || item[1] == 'Taille'){
                            
                              $('.Size_swatch .product_list').append('<li class="active"><a href="/products/'+prod_data.handle+'">'+item[2]+'</a></li>');
                            
                          }
                        }
                      }else{
                        for (var data1, i = 0; item = meta_data[i++];) {
                          if(item[1] == 'Size' || item[1] == 'Taille'){
                            
                            $('.Size_swatch .product_list').append('<li><a href="/products/'+prod_data.handle+'">'+item[2]+'</a></li>');
                            
                          }
                        }
                      }
                    });
                  }
                  if(dataswatch[1].Products.length > 0){
                    $('.Size_swatch').removeClass('hide');
                  }
                }
              }
        }
        })