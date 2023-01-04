import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ObjectStoreService } from './object-store.service';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(private http:HttpClient, private objectStore: ObjectStoreService) { }
  uploadEndpoint = 'http://localhost:8000/uploadfiles';
  //multiple file upload
  uploadFiles(files: any, datasetId: string) {
    console.log(datasetId);
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    //add the dataset name to the form data
    formData.append('datasetId', datasetId);
    //send the form data to the server and show the upload progress
    return this.http.post(this.uploadEndpoint, formData, {
      reportProgress: true,
      observe: 'events'
    })

    // return fetch(this.uploadEndpoint, {
    //   method: 'POST',
    //   body: formData
    // });
  }
}
