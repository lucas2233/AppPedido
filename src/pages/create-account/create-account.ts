import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { AuthProvider } from "../../providers/auth";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { FirebaseProvider } from "../../providers/firebase";
import { LoadingProvider } from "../../providers/loading";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-create-account",
  templateUrl: "create-account.html"
})
export class CreateAccountPage {
  form: FormGroup;
  uid;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private firebaseProvider: FirebaseProvider,
    private loadingProvider: LoadingProvider,
    public alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      pass: ["", Validators.required]
    });
  }

  register() {
    this.loadingProvider.present().then(() =>{
      let data = this.form.value;
      this.authProvider
        .register(data)
        //Success
        .then(res => {
          this.uid = res.user.uid;
          this.createUserOnFirestore();
        })
        //Error
        .catch(() => {
          this.loadingProvider.dismiss();
          this.alertCtrl.create({
            title: "Ops",
            subTitle: "Algo deu errado. Por favor, tente mais uma vez.",
            buttons: ["Ok"]
          }).present();
        });
    });
  }

  createUserOnFirestore = () => {
    const data = {
      name: this.form.value.name,
      email: this.form.value.email,
      uid: this.uid
    };

    this.firebaseProvider.postUser(data).then(res => {
      this.getAndSaveCurrentUser();
    });
  }

  getAndSaveCurrentUser = () => {
    this.firebaseProvider.getCurrentUser(this.uid).subscribe(res => {
      this.loadingProvider.dismiss();
      const user = res[0];
      this.storage.set("user_pizza_app", user).then(() => {
        this.navCtrl.setRoot("TabsPage");
      });
    });
  }

  /**
   * Set the root back to login page
   */
  haveAccount = () => this.navCtrl.pop();
}
