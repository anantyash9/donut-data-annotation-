import { Component, OnInit } from '@angular/core';
import { Dataset } from 'src/app/model/dataset';
import { ObjectStoreService } from 'src/app/services/object-store.service';
import { DataProviderService } from 'src/app/services/data-provider.service';

@Component({
  selector: 'app-dataset-add',
  templateUrl: './dataset-add.component.html',
  styleUrls: ['./dataset-add.component.css']
})
export class DatasetAddComponent implements OnInit {
  title = '';
  files: any[] = [];
  uploadedImages: any[] = [];
  dataset: Dataset
  images: any[] = [];
  uploadsub: any;
  constructor(private objectStore: ObjectStoreService, private dataProvider: DataProviderService) {
    this.dataset = { id: this.objectStore.getNewDatasetId(), title: '', coverPhotoBaseUrl: '' };
    console.log(this.dataset);
    this.uploadsub=this.objectStore.getUploadedImages().subscribe((images: any) => {
      this.uploadedImages.push(...images.filenames);
    })
   }

  ngOnInit(): void {
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
  saveDataset() {
    console.log(this.objectStore.getNewDatasetId());
    this.dataProvider.datasetSave(this.objectStore.getNewDatasetId(),this.title,this.uploadedImages[0]).subscribe((mod:any) => {
      console.log(mod);
    });
   }
}
