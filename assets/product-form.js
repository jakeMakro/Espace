if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
       
      }

      onSubmitHandler(evt) {
        evt.preventDefault();

        const mutipleProdData = [];
        const timestamp = (Math.random() + 1).toString(20).substring(6);
        let ADDTOCART_OBJECT;
        
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        ADDTOCART_OBJECT = config;            
        let mainProductQty = this.closest('.buy-btns-wrapper').querySelector('[name="quantity"]') ? Number(this.closest('.buy-btns-wrapper').querySelector('[name="quantity"]').value) :
          this.form.querySelector('.product-variant-qty') ? Number( this.form.querySelector('.product-variant-qty').value ) : 1;        
        
        /* Push protection plan & main product varinat id's and properties */
        const protectionPlanEle = document.querySelector('[data-protection-plan]');
        if(protectionPlanEle){
          const activeEle = protectionPlanEle.querySelector('li.active');
          if(activeEle){
            
            const CART_SECTION = this.cart ? this.cart.getSectionsToRender().map((section) => section.id) : null;
            
            //for protection product
            let protctionPlanId = activeEle.dataset.vid;
            let productName = activeEle.dataset.prodhandle;
            let protectionPlanQty = Number(mainProductQty || 1);
            
            let protctionPlanProps = {
              '_timestamp': timestamp,
              'Warranty_product': 'true',
              'Product_Name': productName
            };
            mutipleProdData.push({id:protctionPlanId, quantity:protectionPlanQty, properties:protctionPlanProps });

            //for main product
            let mainProductId = this.form.querySelector('[name=id]').value;
            
            let mainProductProps = this.form.querySelectorAll('[name^=properties]');
            let mainProductPropsObj = {};
            if(mainProductProps.length){
              mainProductProps.forEach((input) => {
                let mainProductPropsName = input.getAttribute('name').replace('properties[','').replace(']','').trim();
                let mainProductPropsVal = input.value.trim();
                mainProductPropsObj[mainProductPropsName] = mainProductPropsVal
              });
            }
            mainProductPropsObj['_timestamp'] = timestamp;
            mainProductPropsObj['_Garantie_ajoutee'] = 'true';
            
            mutipleProdData.push({id:mainProductId, quantity:mainProductQty, properties: mainProductPropsObj });           
            
            ADDTOCART_OBJECT = {
              method: 'POST',
              headers: { "Accept": "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({ items: mutipleProdData, sections: CART_SECTION, sections_url: window.location.pathname })
            };
          }else{
            formData.append("quantity", mainProductQty);
            config.body = formData;            
          }
        }else{
          formData.append("quantity", mainProductQty);
          config.body = formData;
        }
        
        // for (const pair of formData.entries()) {
        //   console.log(`${pair[0]}, ${pair[1]}`);
        // }
        
        //console.log('ADDTOCART_OBJECT >>',ADDTOCART_OBJECT);
       /* Push protection plan & main product varinat id's and properties */

        

        fetch(`${routes.cart_add_url}`, ADDTOCART_OBJECT)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButton.querySelector('span').classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, { source: 'product-form', productVariantId: formData.get('id') });
            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              this.cart.renderContents(response);
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading-overlay__spinner').classList.add('hidden');
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}
