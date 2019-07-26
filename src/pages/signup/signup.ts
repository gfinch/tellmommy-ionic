import { Component } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { LoginPage } from '../login/login';
import { ConfirmSignUpPage } from '../confirmSignUp/confirmSignUp';

import md5 from 'md5';

const logger = new Logger('SignUp');

export class UserDetails {
    username: string;
    email: string;
    password: string;
    secondPassword: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {

  public userDetails: UserDetails;

  error: any;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController) {
   this.userDetails = new UserDetails();
  }

  signup() {
    if (inputIsValid()) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();

      let details = this.userDetails;
      details.username = md5(details.email)
      this.error = null;

      Auth.signUp(details.username, details.password, details.email)
        .then(user => {
          this.navCtrl.push(ConfirmSignUpPage, { username: details.username })
        })
        .catch(err => { this.error = err; })
        .then(() => loading.dismiss())
    }
  }

  inputIsValid() {
    let details = this.userDetails;
    console.log(details);
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(details.email).toLowerCase())) {
      this.error = "Enter a valid email address.";
      return false;
    } else if (details.password != details.secondPassword) {
      this.error = "The passwords do not match.";
      return false;
    } else if (details.password.length < 6) {
      this.error = "Choose a password that is at least 6 characters long.";
      return false;
    } else {
      return true;
    }
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

}
