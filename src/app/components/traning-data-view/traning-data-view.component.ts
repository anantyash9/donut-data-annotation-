import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image } from 'src/app/model/image';
import { Dataset } from 'src/app/model/dataset';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { ObjectStoreService } from 'src/app/services/object-store.service';


@Component({
  selector: 'app-traning-data-view',
  templateUrl: './traning-data-view.component.html',
  styleUrls: ['./traning-data-view.component.css']
})
export class TraningDataViewComponent implements OnInit {
  dataset: Dataset;
  images: Image[] = [];
  generatedDataUrl: string = '';
  numberOfSamples = 10;
  train = 60
  test = 20
  validation = 20
  traningData: any;

  constructor(public dialogRef: MatDialogRef<TraningDataViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataProvider: DataProviderService,
    public objectStore: ObjectStoreService,
    //@Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.dataset = data.dataset;
    this.images = data.images;
    }

  ngOnInit(): void {
    //check if the dataset has been generated
    this.loadTraningData();


    
  }
  generateTraningData() {
    this.dataProvider.saveTrainingData(this.dataset.id, { split: { train: this.train, test: this.test, validation: this.validation }, numberOfSamples: this.numberOfSamples, percentage: 0 }).subscribe((data: any) => {
      console.log(data);
     })
  }
  loadTraningData() {
    this.dataProvider.getTrainingData(this.dataset.id).subscribe((data: any) => {
      if (data) {
        this.traningData = data;
        console.log(data);
      }
     })
   }
  onInputChangeTrain(event: any) {
    this.train = event.value;
    if (this.train + this.test + this.validation != 100) {
      let diff = this.train + this.test + this.validation - 100;
      this.validation = Math.floor(this.validation - diff / 2);
      this.test = Math.ceil(this.test - diff / 2);
    }
  }
  onInputChangeTest(event: any) {
    console.log(event.value)
    this.test = event.value;
    if (this.train + this.test + this.validation != 100) {
      let diff = this.train + this.test + this.validation - 100;
      this.validation = Math.floor(this.validation - diff / 2);
      this.train = Math.ceil(this.train - diff / 2);
    }
  }
  onInputChangeValidation(event: any) {
    this.validation = event.value;
    if (this.train + this.test + this.validation != 100) {
      let diff = this.train + this.test + this.validation - 100;
      this.test = Math.floor(this.test - diff / 2);
      this.train = Math.ceil(this.train - diff / 2);
    }
  }
  copyLink(input: any) {
    console.log('copy link');
  }
  deleteTraningData() {
  }

}
