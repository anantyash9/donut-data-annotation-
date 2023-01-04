import { Component, Inject, OnInit } from '@angular/core';
import { ObjectStoreService } from 'src/app/services/object-store.service';
import { DOCUMENT } from '@angular/common';
import { UploadServiceService } from 'src/app/services/upload-service.service';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-view',
  templateUrl: './upload-view.component.html',
  styleUrls: ['./upload-view.component.css']
})
export class UploadViewComponent implements OnInit {
  files: any[] = [];
  percentage = 0;
  filesUploaded = 0;
  totalFiles = 0;
  uploadListSubsciprtion: any;
  constructor(private objectStore: ObjectStoreService,@Inject(DOCUMENT) private document: Document,private uploadService: UploadServiceService) {
    //subscribe to the object if not already subscribed
    this.uploadListSubsciprtion=this.objectStore.getUploadFileList().subscribe((fileList: any) => {
      console.log(fileList);
      //update the view
      this.files = fileList;
      this.totalFiles = fileList.length;
      this.setImagePreview(this.files[0]);
      
      this.uploadService.uploadFiles(this.files, this.objectStore.getNewDatasetId()).subscribe(resp => {
        if (resp.type === HttpEventType.Response) {
          this.objectStore.sendUploadedImages(resp.body);
        }
        if (resp.type === HttpEventType.UploadProgress && resp.total) {
          this.percentage = Math.round(100 * resp.loaded / resp.total);
          
        }
      } )

    });
   }

  ngOnInit(): void {
  }
  setImagePreview(file: any)
  {
    //read the file from the file object as a data url and set the src of the image
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.document.getElementById('imagePreview')!.setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(file);
      
  }
  //unsubscribe from the object store when the component is destroyed
  ngOnDestroy() {
    console.log('destroying upload view');
    this.uploadListSubsciprtion.unsubscribe();
  }
  closeUploadView() {
    this.files = [];
  }
}
