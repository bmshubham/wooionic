import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from './../home/home';
import { ProductsByCategoryPage } from './../products-by-category/products-by-category';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // homePage: Component;
  homePage: any;
  wooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams, public WP: WoocommerceProvider) {
    this.homePage = HomePage;
    this.categories = [];
    
    this.wooCommerce = WP.init();

    this.wooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);
      let cat: any[] = JSON.parse(data.body).product_categories;
      for(let i=0; i<cat.length; i++) {
        if(cat[i].parent == 0) {
          if(cat[i].slug == "clothing" ) cat[i].icon = "shirt";
          if(cat[i].slug == "music" ) cat[i].icon = "musical-notes";
          if(cat[i].slug == "posters" ) cat[i].icon = "images";
          this.categories.push(cat[i]);
        }
      }
    }, (err) => {
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openCategoryPage(category) {
    this.childNavCtrl.setRoot(ProductsByCategoryPage, { "category": category })
  }
}