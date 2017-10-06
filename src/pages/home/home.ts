import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {
    this.page = 2;

    // this.wooCommerce = WC({
    //   url: "http://abdesk.in/smartshahula",
    //   consumerKey: "ck_4bf52c5c084e595334ae966c4049487ec7f2026b",
    //   consumerSecret: "cs_1d3253f973c25bb1106946f75b1f64e3dd9a8c2f"
    // });

    this.wooCommerce = WC({
      url: "http://localhost/wooionic",
      consumerKey: "ck_ca082272b84a6c6be2f8303861002c41e6062229",
      consumerSecret: "cs_8e478a8ab1c621f66dac5fc30d15b37223e63ca0"
    });

    this.loadMoreProducts(null);

    this.wooCommerce.getAsync("products").then( (data) => {
      this.products = JSON.parse(data.body).products;
      console.log(this.products);
    }, (err) =>{
      console.log(err);
    });
  }

  ionViewDidLoad() {
    setInterval(() => {
      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
        this.productSlides.slideTo(0);
      this.productSlides.slideNext();
    }, 3000)
  }

  loadMoreProducts(event) {
    if(event == null) { this.page = 2; this.moreProducts = []; }
    else this.page++;

    this.wooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);
      // console.log(this.moreProducts);

      if( event != null ) event.complete();
      
      if(JSON.parse(data.body).products.length < 10){
        event.enable(false);
        this.toastCtrl.create({
          message: "No More Products!",
          duration: 5000
        }).present();
      }
    }, (err) =>{
      console.log(err);
    });
  }

}
