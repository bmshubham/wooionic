import { Component } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';

import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  wooCommerce: any;
  newUser: any = {};
  billing_shipping_same: boolean;

  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController, public WP: WoocommerceProvider) {
    this.wooCommerce = WP.init();

    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false;
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  checkEmail() {
    let validEmail = false;
    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(this.newUser.email)) {
      this.wooCommerce.getAsync('customers/email/' + this.newUser.value).then( (data) => {
        let res = JSON.parse(data.body);
        if(res.errors) {
          validEmail = true;
          this.toastCtrl.create({
            message: "Email available!",
            duration: 3000
          }).present();
        }
        else {
          validEmail = false;
          this.toastCtrl.create({
            message: "Email already registered, please login to continue!",
            showCloseButton: true
          }).present();
        }
      })
    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: "Invalid email!",
        showCloseButton: true
      }).present();
    }
  }

  signUp() {
    let customerData = {
      customer: {}
    }
    customerData.customer = {
      "email": this.newUser.email,
      "first_name": this.newUser.first_name,
      "last_name": this.newUser.last_name,
      "username": this.newUser.username,
      "password": this.newUser.password,
      "billing_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.billing_address.address_1,
        "address_2": this.newUser.billing_address.address_2,
        "city": this.newUser.billing_address.city,
        "state": this.newUser.billing_address.state,
        "postcode": this.newUser.billing_address.postcode,
        "country": this.newUser.billing_address.country,
        "email": this.newUser.email,
        "phone": this.newUser.billing_address.phone
      },
      "shipping_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.shipping_address.address_1,
        "address_2": this.newUser.shipping_address.address_2,
        "city": this.newUser.shipping_address.city,
        "state": this.newUser.shipping_address.state,
        "postcode": this.newUser.shipping_address.postcode,
        "country": this.newUser.shipping_address.country
      }
    }
    if(this.billing_shipping_same)
      this.newUser.shipping_address = this.newUser.billing_address;
    
    this.wooCommerce.postAsync('customers', customerData).then( (data) => {
      let response = JSON.parse(data.body);
      if(response.customer) {
        this.alertCtrl.create({
          title: "Account Created",
          message: "Your account created successfully, please login to continue!",
          buttons: [{
            text: "Login",
            handler:()=> {}
          }]
        }).present();
      } else if(response.errors) {
        this.toastCtrl.create({
          message: response.errors[0].message,
          showCloseButton: true
        }).present();
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

}
