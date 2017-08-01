import {Component, NgZone} from "@angular/core";
import {NavController, Platform, ToastController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Storage} from "@ionic/storage";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {ViewPhotoPage} from "../view-photo/view-photo";
import {DomSanitizer} from "@angular/platform-browser";
import {FilePath} from "@ionic-native/file-path";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public imagesGallery: Array<string> = [];

  constructor(public plt: Platform, public filePath: FilePath, public sanitizer: DomSanitizer, public navController: NavController, public toastCtrl: ToastController, public camera: Camera, public storage: Storage, public imagePicker: ImagePicker, public ngzone: NgZone) {
    storage.get('gallery').then((gallery) => {
      if (gallery) {
        console.log(gallery);
        this.imagesGallery = gallery;
      }
    });
  }

  addFromCamera = () => {
    const options: CameraOptions = {
      quality: 100,
      // destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      // saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      this.addImageToGallery(imageData);
    }, (err) => {
      if (err == 'cordova_not_available') {
        return this.toastMessage("Disponível apenas em dispositivos reais");
      }

      this.toastMessage(err);
    });
  };

  viewImage = (image: string): void => {
    this.navController.push(ViewPhotoPage, {image: image})
  }

  addFromGallery = () => {
    const options: ImagePickerOptions = {
      quality: 100
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (let x in results) {
        this.addImageToGallery(results[x]);
      }
    }, (err) => {
      if (err == 'cordova_not_available') {
        return this.toastMessage("Disponível apenas em dispositivos reais");
      }

      this.toastMessage(err);
    });
  };

  toastMessage = (message: string) => {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).present();
  }

  addImageToGallery = (img: string) => {
    console.log('>>>>>');
    if (this.plt.is('android')) {
      console.log('aaaa');
      this.filePath.resolveNativePath(img)
        .then(filePath => {
          // img = filePath;
          // console.log(img);

          this.imagesGallery.push(img);
          this.storage.set('gallery', this.imagesGallery);
        });
    } else {
      this.imagesGallery.push(img);
      this.storage.set('gallery', this.imagesGallery);
    }
  };
}
