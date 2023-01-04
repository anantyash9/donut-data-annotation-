import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Dataset } from 'src/app/model/dataset';
import { ObjectStoreService } from 'src/app/services/object-store.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { Image } from 'src/app/model/image';
import { ImageTaggerComponent } from '../image-tagger/image-tagger.component';
import { TraningDataViewComponent } from '../traning-data-view/traning-data-view.component';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css']
})
export class DatasetDetailsComponent implements OnInit {
  files: any[] = [];
  uploadedImages: any[] = [];
  dataset: Dataset
  images: Image[] = [];
  uploadsub: any;
  constructor(private objectStore: ObjectStoreService, private dataProvider: DataProviderService, private dialog: MatDialog) {
    this.dataset = history.state.dataset;
    this.uploadsub=this.objectStore.getUploadedImages().subscribe((images: any) => {
      this.uploadedImages.push(...images.filenames);
    })
   }

  ngOnInit(): void {
    //load images from the dataset
    this.dataProvider.getDatasetImages(this.dataset.id).subscribe((images: Image[]) => {
      this.images = images;
    })
  }
  //file upload
  uploadFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.files = event.target.files;
      console.log("sending files to object store")
      this.objectStore.sendUploadFileList(event.target.files);
    }
   
  }
  setDatasetTitle(title: any) {
    this.objectStore.setNewDatasetTitle(title);
  }
  findImagesInDataset() {

  }
  ngOnDestroy() {
    this.uploadsub.unsubscribe();
  }
  // open the image tagger component as a popup
  openImageTagger(image: Image) {
    
    const dialogRef = this.dialog.open(ImageTaggerComponent, {
      width: '90vw',
      height: '90vh',
      data: {
        images: this.images, currentImage: image
        
      },
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openTrainingData() {
    const dialogRef = this.dialog.open(TraningDataViewComponent, {
      data: {
        images: this.images, dataset: this.dataset
        
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }
}
