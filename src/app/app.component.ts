import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage
  ) {
    /**
     * If the user is already loged in set the root to the home page
     * if it's not set to the login page
     */
    this.storage.get('user_pizza_app')
    .then((user) => {
      if (user) this.rootPage = 'TabsPage';
      else this.rootPage = 'LoginPage';
    });
    
    platform.ready().then(() => {
      setTimeout(() => {
        splashScreen.hide();
      });
      statusBar.styleDefault();
    });
  }
}

