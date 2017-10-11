import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as WC from 'woocommerce-api'

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  wooCommerce: any;
  products: any[];
  page: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = 1;

    this.wooCommerce = WC({
      url: "http://localhost/wooionic",
      consumerKey: "ck_ca082272b84a6c6be2f8303861002c41e6062229",
      consumerSecret: "cs_8e478a8ab1c621f66dac5fc30d15b37223e63ca0"
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

}
