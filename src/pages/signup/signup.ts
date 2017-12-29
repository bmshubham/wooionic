import { Component } from '@angular/core';
import { } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  newUser: any = {};
  billing_shipping_same: boolean;

  constructor() {
    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
     this.billing_shipping_same = false;
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

}
