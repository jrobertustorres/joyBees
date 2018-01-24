import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm 	= this.formBuilder.group({
      // 'login': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'login': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'senha': ['', Validators.required]
   });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
