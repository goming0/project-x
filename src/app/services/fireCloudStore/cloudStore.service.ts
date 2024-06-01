import { Injectable } from '@angular/core';
import { Storage, UploadTask, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class CloudStoreService {
  promiseArr: Promise<string>[] = [];

  constructor(private storage: Storage) {}

  async uploadFile(files: File[], categoryFolder: string, productNameFolder: string) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const storageRef = ref(
          this.storage,
          `shoesProducts/shoesByCategories/${categoryFolder}/${productNameFolder}/${file.name}`,
        );
        const uploadTask = uploadBytesResumable(storageRef, file);
        const promise = new Promise<string>((response, reject) => {
          this.uploadListener(uploadTask, response, reject);
        });
        this.promiseArr.push(promise);
      }
    }
    return Promise.all(this.promiseArr);
  }

  uploadListener(uploadTask: UploadTask, response: any, reject: any) {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            reject("User doesn't have permission to access the object");
            break;
          case 'storage/canceled':
            // User canceled the upload
            console.log('User canceled the upload');
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            reject('Unknown error occurred, inspect error.serverResponse');
            break;
          default:
            reject(error, error.code);
            break;
        }
      },
      () =>
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          response(downloadURL);
        }),
    );
  }
}
