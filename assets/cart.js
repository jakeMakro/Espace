class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    const debouncedOnChange = debounce((event) => {
      if(event.target.closest('protection-plan') || event.target.closest('services-box')){
        return;
      }
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener('change', debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'cart-items') {
        return;
      }
      this.onCartUpdate();
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  onChange(event) {
    if(event.target.closest('.has-protection-plan-added')){
      //check if product is protection plan added
      event.target.closest('.has-protection-plan-added').querySelector('multiple-item-remove-button').updateQuantity(event,event.target.value);
    }else{
      this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));  
    }
  }

  onCartUpdate() {
    fetch(`${routes.cart_url}?section_id=main-cart-items`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const sourceQty = html.querySelector('cart-items');
        this.innerHTML = sourceQty.innerHTML;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section',
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      },
    ];
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);
    document.dispatchEvent(new CustomEvent('loading:start'));

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        const quantityElement =
          document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
        const items = document.querySelectorAll('.cart-item');

        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute('value');
          this.updateLiveRegions(line, parsedState.errors);
          return;
        }

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        document.body.classList.toggle('cart-empty', parsedState.item_count === 0);
        
        const cartDrawerWrapper = document.querySelector('cart-drawer');
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
        if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

        const cartCountEle = document.querySelector('cart-items [data-cart-count]');
        if(cartCountEle) cartCountEle.textContent = `(${parsedState.item_count})`;

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );
        });
        const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
        let message = '';
        if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement.value)) {
          if (typeof updatedValue === 'undefined') {
            message = window.cartStrings.error;
          } else {
            message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
          }
        }
        this.updateLiveRegions(line, message);

        const lineItem =
          document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`))
            : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'));
        } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'));
        }

        warrantyProductCount(parsedState);
        
        //refresh zapiet widget
        if(window.Zapiet && window.ZapietCachedSettings){
          Zapiet.start(ZapietCachedSettings);
        }
              
        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items' });
        
      })
      .catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        document.dispatchEvent(new CustomEvent('loading:end'));
        this.disableLoading(line);
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) lineItemError.querySelector('.cart-item__error-text').innerHTML = message;

    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus =
      document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.remove('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

    cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
  }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
  customElements.define(
    'cart-note',
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          'change',
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
          }, ON_CHANGE_DEBOUNCE_TIMER)
        );
      }
    }
  );
}




if (!customElements.get('multiple-item-remove-button')) {
  customElements.define( 'multiple-item-remove-button', class CartMultipleRemoveButton extends HTMLElement {
    
      constructor() {
        super();
        
        this.addEventListener('click', (event) => {
          event.preventDefault();
          this.updateQuantity(event,0);
        });
      }

      updateQuantity(event,qty){
        document.dispatchEvent(new CustomEvent('loading:start'));
        let currentTimestamp = event.target.closest('[data-timestamp]').dataset.timestamp;
        if(currentTimestamp){
          let updateObj = {};
          let findMatchingTimeStamp = this.closest('#main-cart-items').querySelectorAll(`[data-timestamp="${currentTimestamp}"]`);
          findMatchingTimeStamp.forEach(e => {
            let eachItemKey = e.dataset.itemKey;
            if(eachItemKey) updateObj[eachItemKey]=qty;
          });
          
          let UPDATE_OBJ = {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ updates: updateObj, sections: this.closest('cart-items').getSectionsToRender().map((section) => section.section), sections_url: window.location.pathname })
          };
          console.log('%cUPDATE OBJECT >>','color: green; font-size: 15px; font-weight: 700', UPDATE_OBJ);
          async function updateOpration(){
            const response = await fetch(`${routes.cart_update_url}`, UPDATE_OBJ);
            if (!response.ok) {
              console.log('%cHTTP error! status:','color: red; font-size: 15px; font-weight: 700', response.status);
              console.log('%cSomething went wrong, please refresh the page and try again..!!','color: red; font-size: 15px; font-weight: 700');
              document.dispatchEvent(new CustomEvent('loading:end'));
              return;
            }
            const data = await response.json();
            console.log('%cMain item and protection plan update success >>','color: green; font-size: 15px; font-weight: 700', data);
            /*UPDATE CART HTML*/
            renderCartHTML(data);
            document.dispatchEvent(new CustomEvent('loading:end'));
          }
          updateOpration();
        }
      }
    
    }
  );
}


if (!customElements.get('protection-plan')) {
  customElements.define( 'protection-plan', class protectionPlan extends HTMLElement {
    
      constructor() {
        super();
        
        const debouncedOnChange = debounce((event) => {
          document.dispatchEvent(new CustomEvent('loading:start'));
          this.protectionPlanChange(event);
        }, ON_CHANGE_DEBOUNCE_TIMER);
        this.addEventListener('change', debouncedOnChange.bind(this));

        const protectionTooltipBtn = this.querySelector('[data-protection-content]');
        if(protectionTooltipBtn){
          protectionTooltipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const getCurrentURL = e.currentTarget.getAttribute('href');
            fetchProtectionPageHTML(getCurrentURL);
          });
        }
        
      }

      protectionPlanChange(event) {
        let target = event.target;
        const timestamp = (Math.random() + 1).toString(20).substring(6);
        const fetchTimeStamp = target.closest('[data-timestamp]').dataset.timestamp || timestamp;
        const service_type = target.dataset.serviceType;
        const targetObject = JSON.parse(target.closest('[data-object]').dataset.object || '{}');
        const mainItemProps = JSON.parse(target.closest('[data-props]').dataset.props);
        const mainItemKey = target.closest('[data-item-key]').dataset.itemKey || null;
        
        /*For protection plan add to cart object*/
        let addDataObj;
        if(Object.keys(targetObject).length){
          addDataObj = [{ id:targetObject.id, quantity:targetObject.qty, properties:{"_timestamp": fetchTimeStamp, "Warranty_product": 'true', "Type": service_type} }];
        } 

        /*For main item object*/
        let getMainItemProps;
        if(mainItemKey){
          getMainItemProps = {
            "_timestamp": fetchTimeStamp,
            "_Garantie_ajoutee": 'true'
          };
          if(mainItemProps.length){
            mainItemProps.forEach(arry => {
              getMainItemProps[arry[0]] = arry[1];
            });
          }
        } 
        
        if(addDataObj && getMainItemProps){
          let ADD_OBJ = {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ items: addDataObj })
          };
          let UPDATE_OBJ = {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ id: mainItemKey, quantity: targetObject.qty, properties: getMainItemProps, sections: this.closest('cart-items').getSectionsToRender().map((section) => section.section), sections_url: window.location.pathname })
          };
          this.reRenderCart(ADD_OBJ,UPDATE_OBJ);
        }
      }

      reRenderCart(addObj,updateObj){
        async function addUpdateOpration(){
          /*first we add protection plan product*/
          const addProductRespons = await fetch(`${routes.cart_add_url}`, addObj);
          if (!addProductRespons.ok) {
            console.log('%cHTTP error! status:','color: red; font-size: 15px; font-weight: 700', addProductRespons.status);
            console.log('%cSomething went wrong, please refresh the page and try again..!!','color: red; font-size: 15px; font-weight: 700');
            document.dispatchEvent(new CustomEvent('loading:end'));
            return;
          }
          const data = await addProductRespons.json();
          console.log('%cProtection plan added success >>','color: green; font-size: 15px; font-weight: 700', data);

          /*second we update main item properties*/
          const updateProductPropsResponse = await fetch(`${routes.cart_change_url}`, updateObj);
          if (!updateProductPropsResponse.ok) {
            console.log('%cHTTP error! status:','color: red; font-size: 15px; font-weight: 700', updateProductPropsResponse.status);
            console.log('%cSomething went wrong, please refresh the page and try again..!!','color: red; font-size: 15px; font-weight: 700');
            document.dispatchEvent(new CustomEvent('loading:end'));
            return;
          }
          const updateData = await updateProductPropsResponse.json();
          console.log('%cMain item properties update success >>','color: green; font-size: 15px; font-weight: 700', updateData);

          /*UPDATE CART HTML*/
          renderCartHTML(updateData);
          document.dispatchEvent(new CustomEvent('loading:end'));
        }
        addUpdateOpration();
      }
    }
  );
}


if (!customElements.get('protection-plan-remove-button')) {
  customElements.define( 'protection-plan-remove-button', class protectionPlanRemove extends HTMLElement {
      constructor() {
        super();
        
        this.addEventListener('click', (event) => {
          event.preventDefault();
          this.removePlanProduct(event);
        });
      }

      removePlanProduct(event){
        let target = event.target;
        const currentItemKey = target.closest('[data-key]').dataset.key;
        const mainItemProps = JSON.parse(target.closest('[data-props]').dataset.props);
        const mainItemKey = target.closest('[data-item-key]').dataset.itemKey || null;
        const mainItemqty = target.closest('[data-item-key]').dataset.qty || null;

        /*For main item object*/
        let getMainItemProps = {};
        if(mainItemKey){
          if(mainItemProps.length){
            mainItemProps.forEach(arry => {
              getMainItemProps[arry[0]] = arry[1];
            });
          }
        } 
        if(Object.keys(getMainItemProps).length && currentItemKey){
          document.dispatchEvent(new CustomEvent('loading:start'));
          delete getMainItemProps['_Garantie_ajoutee'];
          let UPDATE_OBJ = {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ id: mainItemKey, quantity: mainItemqty, properties: getMainItemProps, sections: this.closest('cart-items').getSectionsToRender().map((section) => section.section), sections_url: window.location.pathname })
          };
          let REMOVE_OBJ = {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ id: currentItemKey, quantity: 0 })
          };
          this.reRenderCart(REMOVE_OBJ,UPDATE_OBJ);
        }
      }

      reRenderCart(removeObj,updateObj){
        async function updateOpration(){
          /*first we delete protection plan product*/
          const addProductRespons = await fetch(`${routes.cart_change_url}`, removeObj);
          if (!addProductRespons.ok) {
            console.log('%cHTTP error! status:','color: red; font-size: 15px; font-weight: 700', addProductRespons.status);
            console.log('%cSomething went wrong, please refresh the page and try again..!!','color: red; font-size: 15px; font-weight: 700');
            document.dispatchEvent(new CustomEvent('loading:end'));
            return;
          }
          const data = await addProductRespons.json();
          console.log('%cProtection plan remove success >>','color: green; font-size: 15px; font-weight: 700', data);

          /*second we update main item properties*/
          const updateProductPropsResponse = await fetch(`${routes.cart_change_url}`, updateObj);
          if (!updateProductPropsResponse.ok) {
            console.log('%cHTTP error! status:','color: red; font-size: 15px; font-weight: 700', updateProductPropsResponse.status);
            console.log('%cSomething went wrong, please refresh the page and try again..!!','color: red; font-size: 15px; font-weight: 700');
            document.dispatchEvent(new CustomEvent('loading:end'));
            return;
          }
          const updateData = await updateProductPropsResponse.json();
          console.log('%cMain item properties update success >>','color: green; font-size: 15px; font-weight: 700', updateData);

          /*UPDATE CART HTML*/
          renderCartHTML(updateData);
          document.dispatchEvent(new CustomEvent('loading:end'));
        }
        updateOpration();
      }
    
    
    }
  );
}


if (!customElements.get('services-box')) {
  customElements.define( 'services-box', class serviceBox extends HTMLElement {
    
      constructor() {
        super();
        
        //this.addEventListener('change', this.serviceInputChange.bind(this));

        this.addEventListener('change',(e) => {
          let isOtherServiceBoxCliked = this.classList.contains('other-services-box');
          let popupEle = this.querySelector('[data-other-service-popup]');
          if(isOtherServiceBoxCliked && popupEle){
            //this is for removal service
            let mainInputEle = e.target;
            mainInputEle.checked = false;
            this.classList.add('popup-active');
            popupEle.querySelector('input').addEventListener('change',(e) => {
              e.target.checked = true;
              mainInputEle.checked = true;
              this.serviceInputChange();
            });
          }else{
            // this is for BBQ service
            this.serviceInputChange();
          }
        });
        
      }

      serviceInputChange(event) {
        document.dispatchEvent(new CustomEvent('loading:start'));
        let target = this.querySelector('input');
        const mainItemProps = JSON.parse(this.closest('[data-props]').dataset.props);
        const mainItemKey = this.closest('[data-item-key]').dataset.itemKey || null;
        const newAddProps = this.querySelector('[data-set-props]').dataset.setProps;

        /*For main item object*/
        let getMainItemProps;
        if(mainItemKey){
          getMainItemProps = {
            [newAddProps]: 'Yes',
          };
          if(mainItemProps.length){
            mainItemProps.forEach(arry => {
              getMainItemProps[arry[0]] = arry[1];
            });
          }
        } 
        if(getMainItemProps){
          if (!target.checked) {
            /*if checkbox unchecked we delete the propertie*/
            delete getMainItemProps[newAddProps];
          }
          let UPDATE_OBJ = {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ id: mainItemKey, properties: getMainItemProps, sections: this.closest('cart-items').getSectionsToRender().map((section) => section.section), sections_url: window.location.pathname })
          };
          this.updateItemProps(UPDATE_OBJ);
        }
      }

      updateItemProps(updateObj){
        async function updateOpration(){
          /*update main item properties*/
          const response = await fetch(`${routes.cart_change_url}`, updateObj);
          if (!response.ok) {
            console.log('%cHTTP error! status:','color: red; font-size: 15px; font-weight: 700', response.status);
            console.log('%cSomething went wrong, please refresh the page and try again..!!','color: red; font-size: 15px; font-weight: 700');
            document.dispatchEvent(new CustomEvent('loading:end'));
            return;
          }
          const data = await response.json();
          console.log('%cMain item properties update success >>','color: green; font-size: 15px; font-weight: 700', data);
          /*UPDATE CART HTML*/
          renderCartHTML(data);
          document.dispatchEvent(new CustomEvent('loading:end'));
        }
        updateOpration();
      }
    
    }
  );
}


function renderCartHTML(data){
  if(!data) return;
  const cartItems = document.querySelector('cart-items') || document.querySelector('cart-drawer-items');
  cartItems.classList.toggle('is-empty', data.item_count === 0);
  document.body.classList.toggle('cart-empty', data.item_count === 0);
  const cartDrawerWrapper = document.querySelector('cart-drawer');
  const cartFooter = document.getElementById('main-cart-footer');
  if (cartFooter) cartFooter.classList.toggle('is-empty', data.item_count === 0);
  if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', data.item_count === 0);

  cartItems.getSectionsToRender().forEach((section) => {
    const elementToReplace =
      document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
    elementToReplace.innerHTML = cartItems.getSectionInnerHTML(
      data.sections[section.section],
      section.selector
    );
  });
  warrantyProductCount(data);
  //refresh zapiet widget
  if(window.Zapiet && window.ZapietCachedSettings){
    Zapiet.start(ZapietCachedSettings);
  }
}

function warrantyProductCount(cart){
  /* ACCEPT - @ param {boject} --> cart json object  */
  let warrantyProductIds = [7663731212513,7663793701089,7663807398113];
  let count = 0, cart_count = Number(cart.item_count);
  
  for(let i=0; i<cart.items.length; i++){
    let lineItem = cart.items[i];
    let productId = lineItem.product_id;
    if(warrantyProductIds.includes(productId)){
      count += lineItem.quantity;
    }
  } 
  const headerCartCountEle = document.querySelector('header .cart-count-bubble > span');
  const cartPageCountEle = document.querySelector('cart-items [data-cart-count]');
  if(headerCartCountEle) headerCartCountEle.textContent = cart_count-count;
  if(cartPageCountEle) cartPageCountEle.textContent = `(${cart_count-count})`;
}



const memoizePromiseAPI = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    cache.set(
      key,
      fn(...args).catch((error) => {
        cache.delete(key);
        return Promise.reject(error); 
      })
    );
    return cache.get(key);
  };
};

let cachedUrlData = memoizePromiseAPI(fetchProtectionPageURL);
function fetchProtectionPageURL(url) {
  return fetch(url)
  .then((response) => response.text())
  .then((text) => {
    return text;
  });
}

function fetchProtectionPageHTML(url){
  document.dispatchEvent(new CustomEvent('loading:start'));
  cachedUrlData(url)
  .then((result) => {
    const html = new DOMParser().parseFromString(result, 'text/html');
    const divEle = document.createElement('div');
    divEle.classList.add('main-content--wrap');
    const mainContentEle = document.getElementById('MainContent');
    const mainSections = html.querySelector('.main-content--wrap');
    if(mainSections){
      const divEleWrap = document.createElement('div');
      divEleWrap.classList.add('protection-plan--overlay');
      divEleWrap.innerHTML = `<div class="protection-plan-drawer-wrap">
                                <button class="protection_drawer__close" type="button" aria-label="Close" data-drawer-close>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="icon icon-close">
                                    <path d="M17 1L9 9M9 9L1 17M9 9L17 17M9 9L1 1" stroke="currentColor" stroke-width="2.5"></path>
                                  </svg>
                                </button>
                              </div>`;
      divEle.innerHTML = mainSections.innerHTML;
      divEleWrap.querySelector('.protection-plan-drawer-wrap').appendChild(divEle);
      
      if(mainContentEle.querySelector('.protection-plan--overlay')){
        mainContentEle.querySelector('.protection-plan--overlay').innerHTML = divEleWrap.innerHTML;
      }else{
       mainContentEle.appendChild(divEleWrap); 
      }
      addPadingToBody();
      document.body.classList.add('drawer--active');
    }
    document.dispatchEvent(new CustomEvent('loading:end'));
  })
  .catch((error) => {
    document.dispatchEvent(new CustomEvent('loading:end'));
    console.log('%cCould not fetch the request, please refresh the page and try again..!!','color: red; font-size: 14px; font-weight: 700', error);
  });
}

function addPadingToBody() {
  //add padding right only windows and linux device when drawer open for smooth transition
  let isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if(!isIOSDevice && window.matchMedia('(min-width: 990px)').matches){
    const scrollbarWidth = window.outerWidth-document.body.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

