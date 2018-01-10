import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { HomePage } from './../home/home';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { CartPage } from './../cart/cart';
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
  loggedIn: boolean;
  user: any;
  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams, public WP: WoocommerceProvider, public storage: Storage, public modalCtrl: ModalController) {
    this.homePage = HomePage;
    this.categories = [];
    this.user = {};
    
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

  ionViewDidEnter() {
    this.storage.ready().then( () => {
      this.storage.get('userData').then( (userData) => {
        if(userData != null) {
          this.user = userData.user;
          this.loggedIn = true;
        } else {
          this.user = {};
          this.loggedIn = false;
        }
      })
    })
  }

  openCategoryPage(category) {
    this.childNavCtrl.setRoot(ProductsByCategoryPage, { "category": category })
  }

  openPage(pageName: string) {
    if(pageName == 'signup')
      this.navCtrl.push(SignupPage);
    if(pageName == 'login')
      this.navCtrl.push(LoginPage);
    if(pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
    if(pageName == 'logout') {
      this.storage.remove('userData').then( () => {
        this.user = '';
        this.loggedIn = false;
      })
    }
  }
}