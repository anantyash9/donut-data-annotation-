import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dataset } from '../model/dataset';
import { Image } from '../model/image';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  getDatasetImages(id: string): Observable<Image[]> {
    return this.http.get<Image[]>(this.dataSetEndpoint + '/' + id + '/images');
  }
  dataSetEndpoint = 'http://localhost:8000/dataset';
  tagEndpoint = 'http://localhost:8000/tag';
  trainingDataEndpoint = 'http://localhost:8000/trainingdata';
  constructor(private http: HttpClient) { 
  }
  // create empty dataset
  datasetCreate() {
    return this.http.post(this.dataSetEndpoint, {});
  }
  datasetSave(id: string, title: string,coverImage:string) {
    //expect a json response from the server
    console.log("this is id",id);
    return this.http.put(this.dataSetEndpoint, {title: title,id:id,coverImage:coverImage}, {responseType: 'json'});
  }
  getAlldataset(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(this.dataSetEndpoint);
  }
  getTags(id: string): Observable<any> {
    return this.http.get<any>(this.tagEndpoint + '/' + id);
  }
  saveTags(id: string, tags: any[],state:any) {
    return this.http.post(this.tagEndpoint, { fields:tags, imageId: id , state:state });
  }
  saveTrainingData(datasetId: string,state:any) {
    return this.http.post(this.trainingDataEndpoint, { datasetId: datasetId,state:state });
  }
  getTrainingData(datasetId: string) {
    return this.http.get(this.trainingDataEndpoint + '/' + datasetId);
  }
  
}
