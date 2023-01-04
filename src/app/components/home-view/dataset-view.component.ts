import { Component, OnInit } from '@angular/core';
import { Dataset } from 'src/app/model/dataset';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { ObjectStoreService } from 'src/app/services/object-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.css']
})
export class DatasetViewComponent implements OnInit {
  albums: Dataset[] = [];
  constructor(private dataProvider: DataProviderService ,private objectStore: ObjectStoreService, private navigation: Router) {
   }

  ngOnInit(): void {
    this.loadDataset();

  }
  openAlbum(album: Dataset) {
    console.log(album);
  }
  openDialog() {
    console.log('open dialog');
  }
  addDataset() { 
    this.dataProvider.datasetCreate().subscribe((id: any) => {
      this.objectStore.setNewDatasetId(id.datasetId);
      //navigate to the add dataset page
      this.navigation.navigate(['/dataset/add']);

    });
  }
  loadDataset() {
    this.dataProvider.getAlldataset().subscribe((dataset: Dataset[]) => {
      this.albums=dataset;
    });
  }
  openDataset(dataset: Dataset) {
    //navigate to the dataset details page and pass the dataset via navigation
    this.navigation.navigate(['/dataset/details'],{state: {dataset: dataset},});
  }

}
