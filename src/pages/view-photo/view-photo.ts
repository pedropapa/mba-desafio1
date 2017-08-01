import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ViewPhotoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-photo',
  templateUrl: 'view-photo.html',
})
export class ViewPhotoPage {
  public image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.image = this.navParams.data.image;
  }

}
