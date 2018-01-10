import { Injectable } from '@angular/core';

import * as WC from 'woocommerce-api';

@Injectable()
export class WoocommerceProvider {
  wooCommerce: any;

  public loginUrl = 'http://localhost/wooionic/api/auth/generate_auth_cookie/?insecure=cool';
  
  constructor() {
    this.wooCommerce = WC({
      url: "http://localhost/wooionic",
      consumerKey: "ck_beb24c9e9ea77eb4ea1fd19725a75645dc36fc6d",
      consumerSecret: "cs_5226b937eea8bb306936d8d49fa59113478a79e9"
    });
  }

  init() {
    return this.wooCommerce;
  }

}
