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
    

    this.wooCommerce = WC({
      url: "http://localhost/wooionic",    
      consumerKey: "ck_beb24c9e9ea77eb4ea1fd19725a75645dc36fc6d",
      consumerSecret: "cs_5226b937eea8bb306936d8d49fa59113478a79e9"
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
