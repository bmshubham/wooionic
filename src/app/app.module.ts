import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { MenuPage } from './../pages/menu/menu';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ProductsByCategoryPage } from '../pages/products-by-category/products-by-category';
import { ProductDetailsPage } from './../pages/product-details/product-details';
import { CartPage } from './../pages/cart/cart';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignupPage } from '../pages/signup/signup';
import { WoocommerceProvider } from '../providers/woocommerce/woocommerce';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MenuPage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MenuPage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WoocommerceProvider,
  ]
})
export class AppModule {}
