$("header .search-modal__form").append("<div id='header_autocomplete'></div>");

const headerClient = algoliasearch(
    "IPKKKG6FI8",
    "26840b6f423ed2caaec3540ce8d4c101"
  ).initIndex("shopify_espace-67-masterproductsproducts");
let autocompleteContainer = $("#header_autocomplete");
let searchInput = $('header .search__input');

searchInput.attr("autocorrect", "off").attr("autocapitalize", "off").attr("autocomplete", "off").attr("spellcheck", "false");

$('header .search-modal__form .reset__button').on('click', function(){
    autocompleteContainer.html("");
    autocompleteContainer.hide();
});

searchInput.on("input", function() {
  if($(this).val().length > 2){
    headerClient
        .search($(this).val(), {
            hitsPerPage: 4,
            facets: ['meta.algolia.translation'],
            filters: "NOT product_type:Rebate"
          })
        .then(({ hits }) => {
            let autolist = $(`<ul class="autocomplete_results"></ul>`);
            hits.forEach((hit) => {
                let prod_image = "https://cdn.shopify.com/s/files/1/0576/7803/7155/files/imageless.jpg";
                let prod_title = hit.title;
                if(window.routes.rootUrlWithoutSlash == "/en"){
                    if(hit.meta.algolia && hit.meta.algolia.translation){
                        hit.meta.algolia.translation.forEach(function (trans, index) {
                            if(trans.title){
                                prod_title = trans.title
                            }
                        });  
                    }
                }
                if(hit.image){
                    prod_image = hit.image;
                }
                autolist.append(`
                <li class="autocomplete_result">
                    <a href="${window.routes.rootUrlWithoutSlash}/products/${hit.handle}">
                        <img src="${prod_image}" class="autocomplete_image" /><div class="autocomplete_text"><div class="autocomplete_title">${prod_title}</div><div class="autocomplete_vendor">${hit.vendor}</div></div>
                    </a>
                </li>`);
            });
            autocompleteContainer.html(`<div class="autocomplete_label">Suggestions...</div>`);
            if(hits.length > 0){
                autocompleteContainer.append(autolist);
            }else{
                autocompleteContainer.append(`<div class="autocomplete_noresults">No Results Found</div>`);
            }
            autocompleteContainer.show();
        })
        .catch(err => {
            console.log(err);
        });
  }else{
    autocompleteContainer.html("");
    autocompleteContainer.hide();
  }
});