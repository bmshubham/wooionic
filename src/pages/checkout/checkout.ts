import { HomePage } from './../home/home';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

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

  constructor(public storage: Storage, public WP: WoocommerceProvider, public navCtrl: NavController, public alertCtrl: AlertController, public payPal: PayPal) {
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
        // console.log(this.newOrder);
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
    // console.log(data);

    if(paymentData.method_id == 'paypal') {
      this.payPal.init({
        PayPalEnvironmentProduction: "YOUR_PRODUCTION_CLIENT_ID",
        PayPalEnvironmentSandbox: "AYkkS2ObeSpaObaCqA3bybQjRNRMKOw_2vNSha7gmxESpG4l4AhEyMfYwuzrUFKSbWGhCsN-Vhtl5FOG"
      }).then(() => {
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        })).then(() => {

          this.storage.get("cart").then((cart) => {

            let total = 0.00;
            cart.forEach((element, index) => {
              orderItems.push({ product_id: element.product.id, quantity: element.qty });
              total = total + (element.product.price * element.qty);
            });

            let payment = new PayPalPayment(total.toString(), 'USD', 'Description', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then((response) => {
              // Successfully paid
              alert(JSON.stringify(response));


              data.line_items = orderItems;
              //console.log(data);
              let orderData: any = {};

              orderData.order = data;

              this.wooCommerce.postAsync('orders', orderData).then((data) => {
                alert("Order placed successfully!");

                let response = (JSON.parse(data.body).order);

                this.alertCtrl.create({
                  title: "Order Placed Successfully",
                  message: "Your order has been placed successfully. Your order number is " + response.order_number,
                  buttons: [{
                    text: "OK",
                    handler: () => {
                      this.navCtrl.push(HomePage);
                    }
                  }]
                }).present();
              })

            })

          }, () => {
            // Error or render dialog closed without being successful
          });
        }, () => {
          // Error in configuration
        });
      }, () => {
        // Error in initialization, maybe PayPal isn't supported or something else
      });

    }      
    else {
      this.storage.get('cart').then( (cart) => {
        cart.forEach( (element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });
        data.line_items = orderItems;
        // console.log(data);

        let orderData: any = {};
        orderData.order = data;
        // console.log(orderData);
        this.wooCommerce.postAsync('orders', orderData).then( (data) => {
          // console.log(JSON.parse(data.body).order);
          let response = (JSON.parse(data.body).order);
          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been placed successfully. Your order number is " + response.order_number,
            buttons: [{
              text: "OK",
              handler: () => {
                this.navCtrl.setRoot(HomePage);
              }
            }]
          }).present();
        })
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

}
