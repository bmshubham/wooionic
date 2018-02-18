import { SearchPage } from './../search/search';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import { ProductDetailsPage } from './../product-details/product-details';

import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;
  searchQuery: string = "";

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public WP: WoocommerceProvider) {
    this.page = 2;
    
    this.wooCommerce = WP.init();

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

  onSearch(event) {
    if(this.searchQuery.length > 0)
      this.navCtrl.push(SearchPage, {"searchQuery": this.searchQuery});
  }

  openProductPage(product) {
    this.navCtrl.push(ProductDetailsPage, {"product": product});
  }

}
