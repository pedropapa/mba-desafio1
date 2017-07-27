import {Component, NgZone} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Storage} from "@ionic/storage";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public imagesGallery: Array<SafeUrl> = [];

  constructor(public toastCtrl: ToastController, public camera: Camera, public storage: Storage, public imagePicker: ImagePicker, public ngzone: NgZone) {
    storage.get('gallery').then((gallery) => {
      console.log('>>>>>> ', gallery);
      if(gallery) {
        this.imagesGallery = gallery;
      }
    });
  }

  addFromCamera = () => {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 90,
      targetHeight: 90,
      saveToPhotoAlbum: false
    };

    this.ngzone.run(() => {
      this.camera.getPicture(options).then((imageData) => {
        console.log(imageData);
        this.addImageToGallery(imageData);
      }, (err) => {
        if (err == 'cordova_not_available') {
          return this.toastMessage("Disponível apenas em dispositivos reais");
        }

        this.toastMessage(err);
      });
    })
  };

  addFromGallery = () => {
    const options: ImagePickerOptions = {
      quality: 100,
      outputType: this.camera.DestinationType.DATA_URL
    };

    this.imagePicker.getPictures(options).then((results) => {
      for(let x in results) {
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
      this.imagesGallery.push('data:image/jpeg;base64,' + img);
      this.storage.set('gallery', this.imagesGallery);
  };
}
