const searchClient = algoliasearch(
  "IPKKKG6FI8",
  "26840b6f423ed2caaec3540ce8d4c101"
);

// const tempClient = algoliasearch(
//   "IPKKKG6FI8",
//   "26840b6f423ed2caaec3540ce8d4c101"
// );

const baseIndex = "shopify_espace-67-masterproductsproducts"; //ALSO USED FOR 'RELEVANCE'
const newestIndex = "shopify_espace-67-masterproductsproducts_published_at_desc";
const oldestIndex = "shopify_espace-67-masterproductsproducts_published_at_asc";
const lowToHighIndex = ""; //STILL NEED ADDED TO ALGOLIA
const HighToLowIndex = ""; //STILL NEED ADDED TO ALGOLIA

const {
  refinementList,
  dynamicWidgets,
  menu,
  hierarchicalMenu,
  searchBox,
  hits,
  pagination,
  configure,
  currentRefinements,
  clearRefinements,
} = instantsearch.widgets;
const {
  connectSortBy,
  connectSearchBox,
  connectStats,
  connectRange,
  connectCurrentRefinements,
} = instantsearch.connectors;

let filters_string = algolia_customs.rebates_only
  ? "product_type:Rebate"
  : "NOT product_type:Rebate";
if (algolia_customs.collection) {
  filters_string =
    "collections:" + algolia_customs.handle + " AND " + filters_string;
}

function runSearch(){

const renderSortBy1 = (renderOptions1, isFirstRender1) => {
  const { options, currentRefinement, refine, widgetParams, canRefine } =
    renderOptions1;

  if (isFirstRender1) {
    const select = document.createElement("ul");

    widgetParams.container.appendChild(select);

    const select2 = widgetParams.container.querySelector("ul");

    select2.classList.add("sort-options");

    select2.disabled = !canRefine;

    select2.innerHTML = `${options
      .map(
        (option) =>
          `<li data-value="${option.value}" ${
            option.value === currentRefinement ? "class=selected" : ""
          }>${option.label}</li>`
      )
      .join("")}`;

    select.querySelectorAll("li").forEach(function (e) {
      e.addEventListener("click", (event) => {
        refine(event.target.dataset.value);
      });
    });

    document.querySelectorAll('.custom-select .sort-options li').forEach((li) => {
      li.addEventListener("click", function(event){
          event.target.closest('.custom-select').querySelector('.selected-sort').textContent = event.target.textContent;
          event.target.closest('.custom-select').querySelector('.selected-sort').classList.remove('active');
      })
    })
  }
};

const renderSortBy2 = (renderOptions2, isFirstRender2) => {
  const { options, currentRefinement, refine, widgetParams, canRefine } =
    renderOptions2;

  if (isFirstRender2) {
    const select = document.createElement("ul");

    widgetParams.container.appendChild(select);

    const select2 = widgetParams.container.querySelector("ul");

    select2.classList.add("ais-RefinementList-list");

    select2.disabled = !canRefine;

    select2.innerHTML = `${options
      .map(
        (option) =>
          `<li data-value="${option.value}" class="ais-RefinementList-item ${
            option.value === currentRefinement ? "selected" : ""
          }">${option.label}</li>`
      )
      .join("")}`;

    select.querySelectorAll("li").forEach(function (e) {
      e.addEventListener("click", (event) => {
        refine(event.target.dataset.value);
      });
    });

    document.querySelectorAll('.custom-select .sort-options li').forEach((li) => {
      li.addEventListener("click", function(event){
          event.target.closest('.custom-select').querySelector('.selected-sort').textContent = event.target.textContent;
          event.target.closest('.custom-select').querySelector('.selected-sort').classList.remove('active');
      })
    })
  }
};

const renderRangeSlider = (renderOptions, isFirstRender) => {
  const { start, range, refine, widgetParams } = renderOptions;
  if (isFirstRender) {
    const inputTo = document.createElement("input");
    const inputFrom = document.createElement("input");
    const inputs = document.createElement("div");

    inputTo.type = "range";
    inputTo.min = 0;
    inputTo.max = Math.ceil(range.max / 5) * 5;
    inputTo.value = Number.isFinite(start[1])
      ? start[1]
      : Math.ceil(range.max / 5) * 5;
    inputTo.step = 5;
    inputTo.id = "toPrice";

    inputFrom.type = "range";
    inputFrom.min = 0;
    inputFrom.max = Math.ceil(range.max / 5) * 5;
    inputFrom.value = 0;
    inputFrom.value = Number.isFinite(start[0]) ? start[0] : "0";
    inputFrom.step = 5;
    inputFrom.id = "fromPrice";

    inputs.id = "priceLabels";

    widgetParams.container.appendChild(inputFrom);
    widgetParams.container.appendChild(inputTo);
    widgetParams.container.parentNode.appendChild(inputs);

    const fromSlider = widgetParams.container.querySelector("#fromPrice");
    const toSlider = widgetParams.container.querySelector("#toPrice");

    toSlider.addEventListener("change", (event) => {
      const changeFrom = document.querySelector("#fromPrice");
      const changeTo = document.querySelector("#toPrice");
      if (parseFloat(changeTo.value) < parseFloat(changeFrom.value)) {
        changeFrom.value = 0;
      }
      refine([
        parseFloat(changeFrom.value),
        parseFloat(event.currentTarget.value),
      ]);
      fillSlider(changeFrom, changeTo, "#F1F1F1", "#000", changeTo);
    });

    fromSlider.addEventListener("change", (event) => {
      const changeFrom = document.querySelector("#fromPrice");
      const changeTo = document.querySelector("#toPrice");

      if (parseFloat(changeTo.value) < parseFloat(changeFrom.value)) {
        changeTo.value = changeFrom.max;
      }

      refine([
        parseFloat(event.currentTarget.value),
        parseFloat(changeTo.value),
      ]);
      fillSlider(changeFrom, changeTo, "#F1F1F1", "#000", changeTo);
    });

    fillSlider(fromSlider, toSlider, "#F1F1F1", "#000", toSlider);
  }

  const inputTo = widgetParams.container.querySelector("#toPrice");
  const inputFrom = widgetParams.container.querySelector("#fromPrice");

  inputTo.min = 0;
  inputTo.max = Math.ceil(range.max / 5) * 5;
  inputFrom.max = Math.ceil(range.max / 5) * 5;

  inputFrom.value = Number.isFinite(start[0]) ? start[0] : "0";
  inputTo.value = Number.isFinite(start[1])
    ? start[1]
    : Math.ceil(range.max / 5) * 5;

  widgetParams.container.parentNode.querySelector("#priceLabels").innerHTML = `
    <span>${start[0] == -Infinity ? 0 : start[0]}</span>
    <span>${
      start[1] == Infinity ? Math.ceil(range.max / 5) * 5 : start[1]
    }</span>
  `;

  fillSlider(inputFrom, inputTo, "#F1F1F1", "#000", inputTo);
};

const renderCurrentRefinements = (renderOptions, isFirstRender) => {
  const { items, canRefine, refine, createURL, widgetParams } = renderOptions;

  if (isFirstRender) {
    // Do some initial rendering and bind events
  }

  document.querySelector("#current-refinements").innerHTML = `
    <div class="ais-CurrentRefinements-list">
      ${items.map(renderListItem).join("")}
    </div>
  `;

  const clear_buttons = document.querySelectorAll(".selected-filter-btn");

  clear_buttons.forEach((element) => {
    element.addEventListener("click", (event) => {
      //console.log('click');
      const item = Object.keys(event.currentTarget.dataset).reduce(
        (acc, key) => ({
          ...acc,
          [key]: event.currentTarget.dataset[key],
        }),
        {}
      );

      refine(item);

      if (item.attribute == "price") {
        const current_refs = document.querySelectorAll(
          ".selected-filter-btn"
        );

        current_refs.forEach((ref) => {
          const ref_data = ref.dataset;
          if (ref_data.attribute == "price") {
            const item2 = Object.keys(ref.dataset).reduce(
              (acc, key) => ({
                ...acc,
                [key]: ref.dataset[key],
              }),
              {}
            );
            refine(item2);
          }
        });

        reset_price();
      }
    });
  });

  if (
    $(".selected-filter-btn[data-attribute='price']").length <= 0
  ) {
    reset_price();
  }
};

const renderSearchBox = (renderOptions, isFirstRender) => {
  const { query, refine, clear } = renderOptions;

  const container = document.querySelector("#searchbox");

  if (isFirstRender) {
    const box = document.createElement("div");
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");

    box.classList.add("ais-SearchBox");

    //form.setAttribute("role", "search");
    //button.innerHTML = `<svg class="ais-SearchBox-resetIcon" viewBox="0 0 20 20" width="10" height="10"><path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path></svg>`;
    button.setAttribute("type", "submit");
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11.8439 11.7201L16.9939 16.8801M13.5639 7.40012C13.5639 10.8685 10.7523 13.6801 7.28391 13.6801C3.81556 13.6801 1.00391 10.8685 1.00391 7.40012C1.00391 3.93177 3.81556 1.12012 7.28391 1.12012C10.7523 1.12012 13.5639 3.93177 13.5639 7.40012Z" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

    input.addEventListener("input", (event) => {
      refine(event.target.value);
    });

    // input.setAttribute("type", "text");
    // input.setAttribute("placeholder", "Search In Refrigerators");
    // input.setAttribute("name", "search");
    input.setAttribute("type", "text");
    input.placeholder = `Search In ${algolia_customs["title"]}`;
    input.setAttribute("name", "search");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("autocorrect", "off");

    // button.addEventListener('click', () => {
    //   clear();
    // });

    form.appendChild(button);
    form.appendChild(input);
    box.appendChild(form);
    container.appendChild(form);
  }

  container.querySelector("input").value = query;
};

const renderStats = (renderOptions, isFirstRender) => {
  const {
    nbHits,
    areHitsSorted,
    nbSortedHits,
    processingTimeMS,
    query,
    widgetParams,
  } = renderOptions;

  let hiders = document.querySelectorAll(".accordion-box");
  hiders.forEach((facet) => {
    if (facet.getElementsByClassName("ais-RefinementList--noRefinement")[0]) {
      facet.classList.add("facet-hide");
    } else {
      facet.classList.remove("facet-hide");
    }
  });

  if (isFirstRender) {
    return;
  }

  let count = "";
  let resultsText = "Résultats de recherche";
  if (window.routes.rootUrlWithoutSlash == "/en") {
    resultsText = "Search results";
  }

  if (areHitsSorted) {
    if (nbSortedHits > 1) {
      count = `${nbSortedHits} relevant results`;
    } else if (nbSortedHits === 1) {
      count = "1 relevant result";
    } else {
      count = "No relevant result";
    }
    count += ` sorted out of ${nbHits}`;
  } else {
    if (nbHits > 1) {
      count += `${nbHits}`;
    } else if (nbHits === 1) {
      count += "1";
    } else {
      count += "no result";
    }
  }
  if (query == " " || query == "") {
    widgetParams.container.innerHTML = `
    ${resultsText} (${count})
  `;
  } else {
    widgetParams.container.innerHTML = `
    ${resultsText} ${query ? `for "${query}"` : ""} (${count}):
  `;
  }

  if ($("#facets-brand .ais-RefinementList-item.ais-RefinementList-item--selected").length == 0) {
    $(".shopby-tab-brand-slider .col.active").removeClass("active");
  }

  $(".shopby-tab-brand-slider .col.active").removeClass("active");
  $("#facets-brand .ais-RefinementList-item.ais-RefinementList-item--selected").each(function (e) {
    var BrandsFilter = $(this)
      .children("div")
      .children("label")
      .children(".ais-RefinementList-checkbox")
      .val();
    BrandsFilter = BrandsFilter.toLowerCase();
    $(".shopby-tab-brand-slider .col").each(function () {
      var Brandtabs = $(this).children("a.box").children(".width-title").text();
      Brandtabs = Brandtabs.toLowerCase();
      if (BrandsFilter == Brandtabs) {
        $(this).addClass("active");
      }
    });
  });

  $("#hits .ais-Hits-list .ais-Hits-item").each(function () {
    var get_hgt = $(this).find(".pro-description .des-text").height();

    if ($(window).width() > 640) {
      if (get_hgt >= 70) {
        $(this).attr("data-height", get_hgt);
        $(this).find(".pro-description .des-text").css("height", "66px");
      } else {
        $(this).find(".see-more").hide();
      }
    } else {
      if (get_hgt >= 80) {
        $(this).attr("data-height", get_hgt);
        $(this).find(".pro-description .des-text").css("height", "76px");
      } else {
        $(this).find(".see-more").hide();
      }
    }
  });
};

const customStats = connectStats(renderStats);

const customSortBy1 = connectSortBy(renderSortBy1);

const customSortBy2 = connectSortBy(renderSortBy2);

const customRangeSlider = connectRange(renderRangeSlider);

const customCurrentRefinements = connectCurrentRefinements(renderCurrentRefinements);

const customSearchBox = connectSearchBox(renderSearchBox);

const createDataAttribtues = (refinement) =>
  Object.keys(refinement)
    .map((key) => `data-${key}="${refinement[key]}"`)
    .join(" ");

const renderListItem = (item) =>
  `<div class="selected-filter">${format_current_refined(
    item
  )}</div>`;

const format_current_refined = (item) => {
  if (item.attribute == "price") {
    return `<a href="#" class="selected-filter-btn" style="display:none" ${createDataAttribtues(
      item.refinements[0]
    )}></a><a href="#" class="selected-filter-btn" ${createDataAttribtues(
      item.refinements[1]
    )}>
      $${item.refinements[0].value} - $${item.refinements[1].value}
    </a>`;
  } else {
    return item.refinements
      .map(
        (refinement) =>
          `<button class="selected-filter-btn" ${createDataAttribtues(
            refinement
          )}>
          <span class="selected-filter-btn-inner">${item.attribute
            .replace("meta.algolia.english.", "")
            .replace("meta.algolia.french.", "")}: ${refinement.label}</span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M13 7H1" stroke="currentcolor" stroke-width="1.5" stroke-linecap="square"></path></svg>
        </button>`
      )
      .join("");
  }
};

// const index = tempClient.initIndex("shopify_espace-67-masterproducts");
const index = searchClient.initIndex(baseIndex);

const reset_price = () => {
  $("#fromPrice").val(0);
  $("#toPrice").val($("#toPrice").attr("max"));
};

index
  .search("", {
    facets: ["meta.algolia.*"],
    maxValuesPerFacet: 3,
  })
  .then((res) => {
    let english = [];
    let french = [];
    let refinements = [];
    let facet_container = document.querySelector(".facets-wrapper .facets-left-filters .facets-accordion-box");

    const search = instantsearch({
      indexName: baseIndex,
      searchClient,
      numberLocale: "en",
      initialUiState: {
        [baseIndex]: {
          query: algolia_customs.initial_query,
          page: 1,
        },
      },
      routing: true,
      searchFunction(helper) {
        document.querySelectorAll(".custom-select").forEach((labels) => {
          if (labels.querySelector(".sort-options")) {
            labels.querySelector(".selected-sort").innerHTML =
              labels.querySelector(".sort-options li.selected").innerHTML;
          }
        });
        $(".mobile-sort .curr-val").html(
          $("ul.sort-by-dropdown .selected").html()
        );
        if (window.routes.rootUrlWithoutSlash == "/en") {
          $(".desktop-sort-label").html("Filters");
          $(".mobile-sort-label").html("Filters");
          $(".filter-bar-mobile-wrapper .filter-btn-item span").html("Filters");
        } else {
          $(".desktop-sort-label").html("Filtres");
          $(".mobile-sort-label").html("Filtres");
          $(".filter-bar-mobile-wrapper .filter-btn-item span").html("Filtres");
        }
        if (helper.state.query) {
          helper.search();
        }
      },
    });

    for (const [key, value] of Object.entries(res.facets)) {
      if (key.includes("english")) {
        if (
          Object.keys(res.facets[key]).length > 1 &&
          !algolia_settings.facet_omits.includes(
            key.replace("meta.algolia.english.", "")
          )
        ) {
          english.push(key.replace("meta.algolia.english.", ""));
        }
      } else if (key.includes("french")) {
        if (
          Object.keys(res.facets[key]).length > 1 &&
          !algolia_settings.facet_omits.includes(
            key.replace("meta.algolia.french.", "")
          )
        ) {
          french.push(key.replace("meta.algolia.french.", ""));
        }
      }
    }

    if (window.routes.rootUrlWithoutSlash == "/en") {
      if (english.includes("Brand")) {
        facet_container.innerHTML += `
          <div class="accordion-box">
              <a href="JavaScript:Void(0);" class="accordion-title">Brand <span class="accordion-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M13 7H1" stroke="currentcolor" stroke-width="1.5" stroke-linecap="square"></path></svg></span></a>
              <div class="panel" style="display: none;" id="facets-brand"></div>
          </div>
          `;

        refinements.push({
          container: "#facets-brand",
          attribute: "meta.algolia.english.Brand",
        });
      }
      facet_container.innerHTML += `
          <div class="accordion-box">
              <a href="JavaScript:Void(0);" class="accordion-title price_facet">Price</a>
              <div id="range-slider"><div class="sliders_control"></div></div>
          </div>
          `;
      english.forEach((facet) => {
        if (!facet.includes("Brand")) {
          facet_container.innerHTML += `
              <div class="accordion-box">
                  <a href="JavaScript:Void(0);" class="accordion-title">${facet} <span class="accordion-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M13 7H1" stroke="currentcolor" stroke-width="1.5" stroke-linecap="square"></path></svg></span></a>
                  
                  <div class="panel" id="facets-${facet
                    .replace(/\W+/g, "-")
                    .toLowerCase()}" style="display: none;"></div>
              </div>
              `;
          refinements.push({
            container: "#facets-" + facet.replace(/\W+/g, "-").toLowerCase(),
            attribute: "meta.algolia.english." + facet,
          });
        }
      });
    } else {
      if (english.includes("Brand")) {
        facet_container.innerHTML += `
          <div class="accordion-box">
              <a href="JavaScript:Void(0);" class="accordion-title">Marque <span class="accordion-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M13 7H1" stroke="currentcolor" stroke-width="1.5" stroke-linecap="square"></path></svg></span></a>
              <div class="panel" style="display: none;" id="facets-brand"></div>
          </div>
          `;
        refinements.push({
          container: "#facets-brand",
          attribute: "meta.algolia.english.Brand",
        });
      }
      facet_container.innerHTML += `
      <div class="accordion-box">
          <a href="JavaScript:Void(0);" class="accordion-title price_facet">Prix</a>
          <div id="range-slider"><div class="sliders_control"></div></div>
      </div>
      `;
      french.forEach((facet) => {
        if (!facet.includes("Brand")) {
          facet_container.innerHTML += `
              <div class="accordion-box">
                  <a href="JavaScript:Void(0);" class="accordion-title">${facet} <span class="accordion-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M13 7H1" stroke="currentcolor" stroke-width="1.5" stroke-linecap="square"></path></svg></span></a>
                  <div class="panel" id="facets-${facet
                    .normalize("NFKD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\W+/g, "-")
                    .toLowerCase()}" style="display: none;"></div>
              </div>
              `;
          refinements.push({
            container:
              "#facets-" +
              facet
                .normalize("NFKD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\W+/g, "-")
                .toLowerCase(),
            attribute: "meta.algolia.french." + facet,
          });
        }
      });
    }

    search.addWidgets([
      customRangeSlider({
        container: document.querySelector(".sliders_control"),
        attribute: "price",
      }),
    ]);

    search.addWidgets([
      customSearchBox({
        container: "#searchbox",
        placeholder: document
          .getElementById("searchbox")
          .getAttribute("data-query"),
        queryHook(query, search) {
          let searching = query;
          if (searching !== "") {
            search(searching);
          } else {
            search(" ");
          }
        },
      }),
      customCurrentRefinements({
        container: "#current-refinements",
      }),
      clearRefinements({
        container: "#clear-refinements",
        templates: {
          resetLabel({ hasRefinements }, { html }) {
            if (window.routes.rootUrlWithoutSlash == "/en") {
              return html`<span class="selected-filter-button-wrapper"><span class="selected-filter-button-remove"><span>${ hasRefinements ? "Clear all" : "Clear all" }</span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M13 7H1" stroke="currentcolor" stroke-width="1.5" stroke-linecap="square"></path></svg></span></span>`;
            } else {
              return html`<span class="selected-filter-button-wrapper"><span class="selected-filter-button-remove"><span>${ hasRefinements ? "Supprimer" : "Supprimer" }</span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M13 7H1" stroke="currentcolor" stroke-width="1.5" stroke-linecap="square"></path></svg></span></span>`;
            }
          },
        },
      }),
      configure({
        hitsPerPage: 45,
        filters: filters_string,
        optionalFacetFilters: ["inventory_available:true"]
      }),
      hits({
        container: "#hits",
        templates: {
          item(hit, { html, components }) {
            let compare_at = "",ptr_tag = "",inventory_tag = "",noImg = "",rebate_end_date = "",wishlist_tag = "",des = "",meta_RebateCollection = "",meta_RebateDocument = "",brand_label = "",brand_logos = "";
            let title = hit.title;
            let image = `<a href="${window.routes.rootUrlWithoutSlash}/products/${hit.handle}" class="product-item__image-wrapper product-item__image-wrapper--with-secondary"></a>`;
            let price = `${formatMoney(hit.price * 100,window.Shopify.money_format)}`;
            let show_stock = true,active_in_stock='',active_on_sale='';

            
            if (hit.tags.indexOf("Disponiblité_Nonx") > -1) {
              show_stock = false;
              inventory_tag = `<div class="pro-card-stock out-stock _small-hide">Magasin seulement</div>`;
            } else if (hit.tags.indexOf("StartingAT") > -1 || hit.price == 0) {
              show_stock = false;
              inventory_tag = "";
            } else {
              if (hit.inventory_quantity > 0) {
                inventory_tag = `<div class="pro-card-stock _small-hide">En inventaire</div>`;
                // if (hit.tags.includes("Fr_En Inventaire_Oui")) {
                //   if (!hit.tags.includes("Fr_En Inventaire_Non")) {
                //     inventory_tag = `<div class="pro-card-stock small-hide">En inventaire</div>`;
                //   }else{
                //     show_stock = false;
                //   }
                // }else{
                //   show_stock = false;
                // }
              } else if (hit.inventory_policy == "continue") {
                if ($(".show-outofstock-label").val() == "true") {
                  inventory_tag = `<div class="pro-card-stock _small-hide">Sur commande</div>`;
                } else {
                  show_stock = false;
                  inventory_tag = "";
                }
              } else {
                show_stock = false;
                inventory_tag = `<div class="pro-card-stock out-stock _small-hide">Magasin seulement</div>`;
              }
            }

            if(show_stock == true){
              active_in_stock = 'in-stock';
            }

            if (hit.price == 0) {
              price = "";
            } else {
              if (hit.compare_at_price && hit.compare_at_price > 0) {
                active_on_sale = 'on-sale';
                price = `<div class="price price--on-sale"><div class="price__container"><div class="price__regular"><span class="visually-hidden visually-hidden--inline">Regular price</span><span class="price-item price-item--regular">${price}</span></div><div class="price__sale"><span class="visually-hidden visually-hidden--inline">Regular price</span><span><s class="price-item price-item--regular">${formatMoney(
                  hit.compare_at_price * 100,
                  window.Shopify.money_format
                )}</s></span><span class="visually-hidden visually-hidden--inline">Sale price</span><span class="price-item price-item--sale price-item--last">${formatMoney(
                  hit.price * 100,
                  window.Shopify.money_format
                )}</span></div><small class="unit-price caption hidden"><span class="visually-hidden">Unit price</span><span class="price-item price-item--last"><span></span><span aria-hidden="true">/</span><span class="visually-hidden">&nbsp;per&nbsp;</span><span></span></span></small></div></div>`;
              } else {
                price = `<div class="price"><div class="price__container"><div class="price__regular"><span class="visually-hidden visually-hidden--inline">Regular price</span><span class="price-item price-item--regular">${price}</span></div><div class="price__sale"><span class="visually-hidden visually-hidden--inline">Regular price</span><span><s class="price-item price-item--regular"></s></span><span class="visually-hidden visually-hidden--inline">Sale price</span><span class="price-item price-item--sale price-item--last">${compare_at}</span></div><small class="unit-price caption hidden"><span class="visually-hidden">Unit price</span><span class="price-item price-item--last"><span></span><span aria-hidden="true">/</span><span class="visually-hidden">&nbsp;per&nbsp;</span><span></span></span></small></div></div>`;
              }
            }
            
            if (hit.product_image) {
              var sizes = [165, 360, 533, 720, 940, 1066];
              var tempImg = '';
              sizes.forEach((s, index) => {
                tempImg = tempImg + `${ hit.product_image }&width=${s} ${s}w`;
                if( (sizes.length - 1) != index ){
                  tempImg = tempImg + `,`;  
                }                
              });              
              image = `<img srcset="${ tempImg }" src="${hit.product_image}&width=533" alt="${title}" class="algolia_img" width="auto" loading="lazy" height="auto" sizes="(min-width: 750px) calc((100vw - 11.42856rem) / 3), calc((100vw - 35px) / 2)" />`;
            } else {
              image = `${wishlist_tag}${inventory_tag}<img src="https://cdn.shopify.com/s/files/1/0576/7803/7155/files/no_image.jpg" alt="${title}" class="algolia_img no-img-algolia" />`;
            }

            if (hit.compare_at_price && hit.compare_at_price > 0) {
              active_on_sale = 'on-sale';
              compare_at = `<div class="hit-cprice">${formatMoney(
                hit.compare_at_price * 100,
                window.Shopify.money_format
              )}</div>`;
            }

            if (window.routes.rootUrlWithoutSlash == "/en" && hit.meta.algolia && hit.meta.algolia.translation) {
              hit.meta.algolia.translation.forEach((element) => {
                if (element.hasOwnProperty("title")) {
                  title = element["title"];
                }
                if (element.hasOwnProperty("description")) {
                  des = element["description"];
                }
              });
            } else {
              des = hit.body_html_safe;
            }

            let hideVendor = typeof hideBrand != 'undefined' && hideBrand.indexOf(hit.vendor.toLowerCase()) > -1 ? 'hidden' : '';
            

            if (hit.tags && hit.tags.length > 0) {
              var counter_brand = 0;
              for (var i = 0; i < hit.tags.length; i++) {
                var tag = hit.tags[i];
                
                /*if (tag.indexOf("PTR_") !== -1) {
                  if ($(".show-ptr").val() == "true") {
                    ptr_tag = `<span class="ptr-val">PTR ${
                      tag.split("PTR_")[1]
                    }</span>`;
                  } else {
                    ptr_tag = `<span class="ptr-val hide">PTR ${
                      tag.split("PTR_")[1]
                    }</span>`;
                  }
                }*/

                if (tag.indexOf("RebateEndDate_") !== -1) {
                  var split_var = hit.tags[i].split("-");
                  var year = split_var[0].replace("RebateEndDate_", "");
                  var month = split_var[1];
                  var date = split_var[2];
                  var url_curr = window.location.href;
                  if (url_curr.indexOf("/en") > -1) {
                    rebate_end_date =
                      "<div class='valid-date'><span class='gridenddate'><span class='valid-tag'>Valid until:</span> <span class='v-date'>" +
                      year +
                      "." +
                      month +
                      "." +
                      date +
                      "</span></div>";
                  } else {
                    rebate_end_date =
                      "<div class='valid-date'><span class='gridenddate'><span class='valid-tag'>Valide jusqu'au:</span> <span class='v-date'>" +
                      date +
                      "." +
                      month +
                      "." +
                      year +
                      "</span></div>";
                  }
                }

                if (tag.indexOf("Brand_") !== -1) {
                  if (tag.split("Brand_")[1].toLowerCase() !== hit.vendor.toLowerCase()) {
                    if (counter_brand == 0) {
                      brand_label = `<span class="tag-item">${
                        tag.split("Brand_")[1]
                      }</span>`;
                      counter_brand = counter_brand + 1;
                    } else {
                      brand_label += `<span class="tag-item">${
                        tag.split("Brand_")[1]
                      }</span>`;
                    }
                  }
                }
              }
            }

            ptr_tag = `<span class="ptr-val">PTR ${hit.sku}</span>`

            if (hit.tags.includes("Type_Rebate")) {
              if (hit.product_image) {
                image = `<div class="item-img-box"><a href="${window.routes.rootUrlWithoutSlash}/products/${hit.handle}"><img src="${hit.product_image}" alt="${title}"></a></div>`;
              } else {
                image = "";
                noImg = "no-img";
              }

              if (hit.body_html_safe != null) {
                des = `<div class="des-text">${des}</div>`;
                if (hit.body_html_safe.length > 250) {
                  if (window.routes.rootUrl == "/en") {
                    des +=
                      '<a href="javascript:void(0);" class="see-more">Read more</a><a href="javascript:void(0);" class="see-less">Read Less</a>';
                  } else {
                    des +=
                      '<a href="javascript:void(0);" class="see-more">En savoir plus</a><a href="javascript:void(0);" class="see-less">Lire moins</a>';
                  }
                } else {
                  des += "";
                }
              }

              let count = 0;
              // shopmetafields object ( defined in theme.liquid )
              shop_metaJCP.rebate_logotag.forEach((tag, index) => {
                if (hit.tags.includes(tag.trim())) {
                  if (count == 0) {
                    var thumbUrl = shop_metaJCP.logo_rebate[index];
                    brand_logos = `<img src='${thumbUrl}' alt='${title}' />`;
                    count = 1;
                  } else {
                    // get previous ImgURL and replace with new imgURL
                    var thumbUrl = shop_metaJCP.logo_rebate[index];
                    brand_logos += `<img src='${thumbUrl}' alt='${title}' />`;
                  }
                }
              });

              if (hit.meta.tbsfy_Rebate.RebateDocument != null) {
                if (window.routes.rootUrl == "/en") {
                  var temp_data = `${hit.meta.tbsfy_Rebate.RebateDocument}`;
                  meta_RebateDocument =
                    `<a href="` +
                    temp_data.replace("&lang=fr", "") +
                    `" target="_blank" class="download-pdf-btn">Download PDF <i class="down-icon"><svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.21 9.42499L8.5 13.135M8.5 13.135L4.79 9.42499M8.5 13.135L8.5 1.05499M4.56 4.94498H2C1.17 4.94498 0.5 5.61498 0.5 6.44498L0.5 15.445C0.5 16.275 1.17 16.945 2 16.945H15C15.83 16.945 16.5 16.275 16.5 15.445V6.44498C16.5 5.61498 15.83 4.94498 15 4.94498H12.44" stroke="#3C3C3C" stroke-linecap="round" stroke-linejoin="round"/></svg></i></a>`;
                } else {
                  meta_RebateDocument = `<a href="${hit.meta.tbsfy_Rebate.RebateDocument}" target="_blank" class="download-pdf-btn">Télécharger le PDF <i class="down-icon"><svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.21 9.42499L8.5 13.135M8.5 13.135L4.79 9.42499M8.5 13.135L8.5 1.05499M4.56 4.94498H2C1.17 4.94498 0.5 5.61498 0.5 6.44498L0.5 15.445C0.5 16.275 1.17 16.945 2 16.945H15C15.83 16.945 16.5 16.275 16.5 15.445V6.44498C16.5 5.61498 15.83 4.94498 15 4.94498H12.44" stroke="#3C3C3C" stroke-linecap="round" stroke-linejoin="round"/></svg></i></a>`;
                }
              }

              if (hit.meta.tbsfy_Rebate.RebateCollection != null) {
                if (window.routes.rootUrl == "/en") {
                  meta_RebateCollection = `<a href="/en/collections/${hit.meta.tbsfy_Rebate.RebateCollection}" target="_black" class="view-qly-pro">View Qualifying Products <i><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H11M11 1V11M11 1L1 11" stroke="#D82329" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></i></a>`;
                } else {
                  meta_RebateCollection = `<a href="/collections/${hit.meta.tbsfy_Rebate.RebateCollection}" target="_black" class="view-qly-pro">Voir les produits éligibles <i><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H11M11 1V11M11 1L1 11" stroke="#D82329" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></i></a>`;
                }
              }

              return `
              <div class="mobile-brand-logo">${brand_logos}</div>
              <div class="item-info-wrapper ${noImg}">
                <div class="item-contents">
                  <div class="tag-box">
                    ${brand_label}
                  </div>
                  <div class="contain-wrapper">
                    <h3 class="pro-title"><a href="${window.routes.rootUrlWithoutSlash}/collections/${hit.handle}">${title}</a></h3>
                    <div class="pro-description">${des}</div>
                  </div>
                  ${meta_RebateCollection}
                </div>${image}
              </div>
              <div class="item-bott-part">
                <div class="brand-logos">
                  ${brand_logos}
                </div>
                <div class="btns-wrapper">
                  ${rebate_end_date}
                  ${meta_RebateDocument}
                </div>
              </div>
            `;
            } else {
              return `
              <div class="card-wrapper product-card-wrapper underline-links-hover ${active_in_stock} ${active_on_sale}">
                <div class="card card--standard card--media" style="--ratio-percent: 125.0%;">
                  <div class="card__inner color-background-2 gradient ratio" style="--ratio-percent: 125.0%;">
                    <div class="card__media">
                      <div class="media media--transparent media--hover-effect">${image}</div>
                    </div>
                    <div class="card__content">
                      <div class="card__information">
                        <h3 class="card__heading">
                          <a href="${window.routes.rootUrlWithoutSlash}/products/${hit.handle}" class="full-unstyled-link">
                            ${title}${ptr_tag}
                          </a>
                        </h3>
                      </div>
                      <div class="card__badge bottom left"></div>
                    </div>
                    ${inventory_tag}
                  </div>
                  <div class="card__content">
                    <div class="card__information">
                      <h3 class="card__heading h5">
                        <a href="${window.routes.rootUrlWithoutSlash}/products/${hit.handle}" class="full-unstyled-link">
                          <span class="pro-vendor ${ hideVendor }">
                            ${hit.vendor}
                          </span>
                          ${title}${ptr_tag}
                        </a>
                      </h3>
                      <div class="card-information">
                        <span class="visually-hidden">Vendor:</span>
                        <div class="caption-with-letter-spacing light hidden">${hit.vendor}</div>
                        <span class="caption-large light"></span>
                        ${price}
                      </div>
                    </div>
                    <div class="card__badge bottom left"></div>
                  </div>
                </div>
              </div>
            `;
            }
            
          },
        },
        cssClasses: {
          item: "grid__item",
          list: [
            "grid",
            "product-grid",
            "grid--2-col-tablet-down",
            "grid--3-col-desktop",
            ""
          ],
        },
      }),
      pagination({
        container: "#pagination",
        showFirst: false,
        showLast: false,
        cssClasses: {
          list: 'pagination__list list-unstyled',
          link : 'pagination__item light',
          selectedItem : 'pagination__item--current',
        },
      }),
    ]);

    refinements.forEach((ref) => {
      search.addWidgets([
        refinementList({
          container: ref.container,
          attribute: ref.attribute,
          showMore: true,
          showMoreLimit: 100,
          limit: 7,
          templates: {
            showMoreText(data, { html }) {
              let moreText = "Montrer Plus "+ref.attribute.split('.')[3]+'s'+" <span>(+"+(ref.attribute.length - 7)+")</span>";
              let lessText = "Montrer Moins";
              let curr_url = window.location.href;
              if (curr_url.indexOf("/en") > -1) {
                moreText = "Show More "+ref.attribute.split('.')[3]+'s'+" <span>(+"+(ref.attribute.length - 7)+")</span>";
                lessText = "Show Less";
              }
              return html`${data.isShowingMore ? lessText : moreText}`;
            },
          },
          cssClasses: {
            root: 'panel-list',
            list: [
              'panel-list-ul',
            ],
            item: 'panel-list-li',
            label: 'checkbox-label',
            labelText: 'label-text',
            showMore: 'panel-list-li link-btn',
          },
          transformItems(items) {
            if (items.length > 1) {
              let facet_options = items.map((item) => ({
                ...item,
              }));
              if (ref.attribute == "meta.algolia.english.Brand") {
                facet_options = facet_options.filter(function (item) {
                  return !algolia_settings["brand_omits"].includes(item.value);
                });
              }
              return facet_options;
            } else {
              return [];
            }
          },
        }),
      ]);
    });

    if (window.routes.rootUrlWithoutSlash == "/en") {
      search.addWidgets([
        customSortBy1({
          container: document.querySelector("#sort-by"),
          items: [
            { label: "Relevance", value: baseIndex },
            {
              label: "Newest",
              value: newestIndex,
            },
            {
              label: "Oldest",
              value: oldestIndex,
            },
            { label: "Price ↑", value: lowToHighIndex },
            { label: "Price ↓", value: HighToLowIndex },
          ],
        }),
      ]);

      search.addWidgets([
        customSortBy2({
          container: document.querySelector("#sort-by2"),
          items: [
            { label: "RELEVANCE", value: baseIndex },
            {
              label: "NEWEST",
              value: newestIndex,
            },
            {
              label: "OLDEST",
              value: oldestIndex,
            },
            { label: "PRICE ↑", value: lowToHighIndex },
            { label: "PRICE ↓", value: HighToLowIndex },
          ],
        }),
      ]);
    } else {
      search.addWidgets([
        customSortBy1({
          container: document.querySelector("#sort-by"),
          items: [
            { label: "Pertinence", value: baseIndex },
            {
              label: "Le plus récent",
              value: newestIndex,
            },
            {
              label: "Le plus ancien",
              value: oldestIndex,
            },
            { label: "Prix croissant ↑", value: lowToHighIndex },
            {
              label: "Prix décroissant ↓",
              value: HighToLowIndex,
            },
          ],
        }),
      ]);

      search.addWidgets([
        customSortBy2({
          container: document.querySelector("#sort-by2"),
          items: [
            { label: "Pertinence", value: baseIndex },
            {
              label: "Le plus récent",
              value: newestIndex,
            },
            {
              label: "Le plus ancien",
              value: oldestIndex,
            },
            { label: "Prix croissant ↑", value: lowToHighIndex },
            {
              label: "Prix décroissant ↓",
              value: HighToLowIndex,
            },
          ],
        }),
      ]);
    }

    search.addWidgets([
      customStats({
        container: document.querySelector("#stats"),
      }),
    ]);
    
    // $("#MainContent").css("visibility", "visible");
    search.start();
    // console.log(search.renderState);

    document.querySelector('#in-stock input').addEventListener('change',function(e){
      if(this.checked){
        document.querySelector('.product-grid').classList.add('in-stock-wrap');
      }else{
        document.querySelector('.product-grid').classList.remove('in-stock-wrap');  
      }
    })
    
    document.querySelector('#on-sale input').addEventListener('change',function(e){
      if(this.checked){
        document.querySelector('.product-grid').classList.add('on-sale-wrap');
      }else{
        document.querySelector('.product-grid').classList.remove('on-sale-wrap');
      }
    })
    
    if (document.querySelectorAll(".selected-sort").length > 0) {
      document.querySelectorAll(".selected-sort").forEach((ul) => {
        ul.addEventListener("click", function () {
          ul.classList.toggle("active");
        });
      });
    }

    let facet_toggles = $(".accordion-title");

    facet_toggles.click(function () {
      if (!$(this).hasClass("price_facet")) {
        $(this).next().slideToggle(500);
        $(this).toggleClass("active");
      }
    });
  });

}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
  const rangeDistance = to.max - to.min;
  const fromPosition = from.value - to.min;
  const toPosition = to.value - to.min;
  controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector("#toPrice");
  if (Number(currentTarget.value) <= 0) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

if(algolia_customs.collection && window.routes.rootUrlWithoutSlash == "/en"){
  
  $.ajax({
    type: "GET",
    url: algolia_customs.french_handle,
    dataType: "JSON"
  }).done(function(data){
    
    algolia_customs["handle"] = data.collection.handle;
    filters_string = algolia_customs.rebates_only
      ? "product_type:Rebate"
      : "NOT product_type:Rebate";
    
    filters_string =
        "collections:" + algolia_customs.handle + " AND " + filters_string;

    runSearch();
    
  });
}else{
  runSearch();
}


