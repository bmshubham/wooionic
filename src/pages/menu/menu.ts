import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from './../home/home';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // homePage: Component;
  homePage: any;
  wooCommerce: any;
  categories: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;
    this.categories = [];
    
    this.wooCommerce = WC({
      url: "http://localhost/wooionic",
      consumerKey: "ck_ca082272b84a6c6be2f8303861002c41e6062229",
      consumerSecret: "cs_8e478a8ab1c621f66dac5fc30d15b37223e63ca0"
    });

    this.wooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);
      let cat: any[] = JSON.parse(data.body).product_categories;
      for(let i=0; i<cat.length; i++) {
        if(cat[i].parent == 0) this.categories.push(cat[i]);
      }
    }, (err) => {
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }
}