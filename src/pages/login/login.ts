import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ToastController, AlertController, NavParams, NavController } from 'ionic-angular';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string;
  password: string;
  redirect: any;

  constructor(public http: Http, public WP: WoocommerceProvider, public alertCtrl: AlertController, public toastCtrl: ToastController, public storage: Storage, public navParams: NavParams, public navCtrl: NavController) {
    this.username = '';
    this.password = '';
    this.redirect = this.navParams.get('next');
  }

  login() {
    this.http.get(this.WP.loginUrl+"&username="+this.username+"&password="+this.password)
    .subscribe( (data) => {
      let response = JSON.parse(data['_body']);
      if(response.status == "error") {
        this.toastCtrl.create({
          message: response.error,
          duration: 5000
        }).present();
        return;
      }

      this.storage.set('userData', response).then( (data) => {
        this.alertCtrl.create({
          title: "Login successfull",
          message: "You have logged in successfully",
          buttons: [{
            text: "OK",
            handler: () => {
              if(this.redirect) {
                this.navCtrl.push(this.redirect);
              }
              else this.navCtrl.pop();
            }
          }]
        }).present();
      })
    });
  }

}
