import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';

import { WoocommerceProvider } from './../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  newOrder: any;
  wooCommerce: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userData: any;

  constructor(public storage: Storage, public WP: WoocommerceProvider) {
    this.wooCommerce = WP.init();
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      { method_id: 'bacs', method_title: 'Direct Bank Transfer' },
      { method_id: 'cheque', method_title: 'Cheque Payment' },
      { method_id: 'cod', method_title: 'Cash On Delivery' },
      { method_id: 'paypal', method_title: 'PayPal' }
    ];

    this.storage.get('userData').then( (data) => {
      this.userData = data.user;
      let email = data.user.email;

      this.wooCommerce.getAsync('customers/email/'+email).then( (data) => {
        this.newOrder = JSON.parse(data.body).customer;
        console.log(this.newOrder);
      })
    })
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
    if(this.billing_shipping_same)
      this.newOrder.shipping_address = this.newOrder.billing_address;
  }

  placeOrder() {
    let orderItems: any[] = [];
    let data: any = {};
    let paymentData: any = {};
    this.paymentMethods.forEach((element, index) => {
      if(element.method_id = this.paymentMethod)
      paymentData = element;
    });

    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true
      },
      billing_address: this.newOrder.billing_address,
      shipping_address: this.newOrder.shipping_address,
      customer_id: this.userData.id || '',
      line_items: orderItems
    };

    if(paymentData.method_id == 'paypal')
      console.log(paymentData);
    else {
      this.storage.get('cart').then( (data) => {
        data.forEach( (element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });
        data.line_items = orderItems;

        let orderData: any = {};
        orderData.order = data;
        this.wooCommerce.postAsync('orders', orderData).then( (data) => {
          console.log(JSON.parse(data.body).order);
        })
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

}
