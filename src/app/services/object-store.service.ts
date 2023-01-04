import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectStoreService {
  private newDatasetTitle: string = '';
  private newDatasetId: string = '';
  //the object that will be shared
  private UploadFileList_topic = new Subject<any>(); //the Subject is a type of Observable
  private uploadedImages_topic = new Subject<any>(); //the Subject is a type of Observable


  //let components save and subcribe to the same object
  sendUploadFileList(fileList: any) { //the component that wants to update something, calls this fn
    this.UploadFileList_topic.next(fileList); //next() will feed the value in Subject
  }
  getUploadFileList(): Observable<any> { //the component that wants to subscribe, calls this fn
    return this.UploadFileList_topic.asObservable(); //return the Subject
  }
  sendUploadedImages(images: any) { //the component that wants to update something, calls this fn
    this.uploadedImages_topic.next(images); //next() will feed the value in Subject
  }
  getUploadedImages(): Observable<any> { //the component that wants to subscribe, calls this fn
    return this.uploadedImages_topic.asObservable(); //return the Subject
  }

  //getter and setter for the new dataset title
  getNewDatasetTitle(): string {
    return this.newDatasetTitle;
  }
  setNewDatasetTitle(title: string) {
    this.newDatasetTitle = title;
  }
  //getter and setter for the new dataset id
  getNewDatasetId(): string {
    return this.newDatasetId;
  }
  setNewDatasetId(id: string) {
    this.newDatasetId = id;
  }

  constructor() { }

}
