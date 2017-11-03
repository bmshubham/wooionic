import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailsPage } from './../product-details/product-details';

import * as WC from 'woocommerce-api'

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  wooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = 1;
    this.category = this.navParams.get('category');

    this.wooCommerce = WC({
      url: "http://localhost/wooionic",
      consumerKey: "ck_ca082272b84a6c6be2f8303861002c41e6062229",
      consumerSecret: "cs_8e478a8ab1c621f66dac5fc30d15b37223e63ca0"
    });

    this.wooCommerce.getAsync("products?filter[category]=" + this.category.slug).then( (data) => {
      this.products = JSON.parse(data.body).products;
      console.log(this.products);
    }, (err) =>{
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event) {
    this.page++;
    console.log("Getting Page:" + this.page);
    this.wooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then( (data) => {
      this.products = this.products.concat(JSON.parse(data.body).products);
      console.log(this.products);
      event.complete();
      if(JSON.parse(data.body).products,length < 10)
        event.enavle(false);
    }, (err) =>{
      console.log(err);
    });
  }

  openProductPage(product) {
    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

}
