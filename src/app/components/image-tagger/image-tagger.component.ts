import { AfterViewChecked, Component, Inject, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image } from 'src/app/model/image';
import { DOCUMENT } from '@angular/common';
import * as markerjs2 from 'markerjs2';
import { base64ToFile } from 'ngx-image-cropper';
import { fromBlob } from 'image-resize-compress';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { DataProviderService } from 'src/app/services/data-provider.service';
@Component({
  selector: 'app-image-tagger',
  templateUrl: './image-tagger.component.html',
  styleUrls: ['./image-tagger.component.css']
})
export class ImageTaggerComponent implements OnInit ,AfterViewChecked{
  markerArea:markerjs2.MarkerArea | undefined;
  intrinsicHeight: number | undefined;
  intrinsicWidth: number | undefined;
  image: any;
//images and current selected image are taken as inputs to the component
  images: Image[] = [];
  currentImage: Image;
  newFieldForm: any;
  newFieldFormVisible = false;
  fieldList: any[] = [];
  temp: any;

  state:any
  
  constructor(public dialogRef: MatDialogRef<ImageTaggerComponent>, @Inject(MAT_DIALOG_DATA) public data: any, @Inject(DOCUMENT) private document: Document, private dataProvider: DataProviderService) {
    this.images = data.images;
    this.currentImage = data.currentImage;

   }

  ngOnInit(): void {
    // get the image element
    let imageElement = this.document.getElementById('image');
    // set the image source
    // null check
    if (imageElement) {
      imageElement.setAttribute('src', "http://localhost:9099/test/"+this.currentImage.id+'.'+this.currentImage.fileExtension);
    }
    this.showMarkerArea();
    this.loadTags()

    

  }
  ngAfterViewChecked() {
  {
      const img = document.getElementById('image') as HTMLImageElement;

      if (img?.naturalHeight !== 0 || img?.naturalWidth !== 0) {
        this.intrinsicHeight = img?.naturalHeight;
        this.intrinsicWidth = img?.naturalWidth;
      }
    }
  }
  addField() {
    this.newFieldFormVisible = true
    this.initialize()
  }
  nextImage() {
    // get the index of the current image
    let index = this.images.indexOf(this.currentImage);
    // if the index is not the last image in the array
    if (index < this.images.length - 1) {
      // set the current image to the next image in the array
      this.currentImage = this.images[index + 1];
      // get the image element
      let imageElement = this.document.getElementById('image');
      // set the image source
      // null check
      if (imageElement) {
        imageElement.setAttribute('src', "http://localhost:9099/test/"+this.currentImage.id+'.'+this.currentImage.fileExtension);
      }
      this.loadTags()
    }
  }
  previousImage() {
    // get the index of the current image
    let index = this.images.indexOf(this.currentImage);
    // if the index is not the first image in the array
    if (index > 0) {
      // set the current image to the previous image in the array
      this.currentImage = this.images[index - 1];
      // get the image element
      let imageElement = this.document.getElementById('image');
      // set the image source
      // null check
      if (imageElement) {
        imageElement.setAttribute('src', "http://localhost:9099/test/"+this.currentImage.id+'.'+this.currentImage.fileExtension);
      }
      this.loadTags()
    }
  }
  showMarkerArea() {
    {
      const img = document.getElementById('image') as HTMLImageElement;

      if (img?.naturalHeight !== 0 || img?.naturalWidth !== 0) {
        this.intrinsicHeight = img?.naturalHeight;
        this.intrinsicWidth = img?.naturalWidth;
      }
    }
    console.log("height",this.intrinsicHeight);
    this.markerArea = new markerjs2.MarkerArea(
      document.getElementById('image') as HTMLImageElement
    );
    this.markerArea.renderAtNaturalSize = false;
    this.markerArea.renderImageQuality = 1;
    //make the z index of the marker area higher than the image
    this.markerArea.uiStyleSettings.zIndex = "1000";
    //set toolbox invisible
    this.markerArea.uiStyleSettings.hideToolbox = true;
    //set the marker toolbar overlay on the image
    this.markerArea.availableMarkerTypes = [
      markerjs2.FrameMarker,
    ];
    this.markerArea.addEventListener('markerselect', (event: any) => {
      console.log(event);
    });
    this.markerArea.addEventListener('render', (event: { dataUrl: any; state: any; }) => { 
      console.log("mystate",event.state);
    });
    this.markerArea.addEventListener('markerchange', (event: any) => { 
      console.log(event);
    });
    // this.markerArea.addCloseEventListener(() => { });
    this.markerArea.addEventListener("markercreate", (event:any) => {
      //log the dimentions of the marker
      console.log(event.marker.width, event.marker.height, event.marker.left, event.marker.top);
      //log the dimentions of the image
      console.log(event.markerArea.imageHeight, event.markerArea.imageWidth);
      this.temp = { imageDimentions: { height: event.markerArea.imageHeight, width: event.markerArea.imageWidth }, markerDimentions: { height: event.marker.height, width: event.marker.width, left: event.marker.left, top: event.marker.top } }
      this.addField()
      this.state=this.markerArea?.getState();
    });
    this.markerArea.show();
  }
  // get the height of current image
  autoHeight() {
    const imageUrl = "http://localhost:9099/test/" + this.currentImage.id + '.' + this.currentImage.fileExtension;
    const img = new Image();
    img.src = imageUrl;
    return img.height < img.width;
  }
  saveField() {

    this.fieldList.push({ key: this.newFieldForm.value.key, value_type: this.newFieldForm.value.value_type, length: this.newFieldForm.value.length, coordinates: this.temp })
    console.log(this.fieldList)
    this.dataProvider.saveTags(this.currentImage.id, this.fieldList,this.state).subscribe((data: any) => {
      this.newFieldFormVisible = false
      this.initialize()
    });
    

  }
  initialize() {
    this.newFieldForm=new FormGroup({
      key: new FormControl(),
      value_type: new FormControl(),
      length: new FormControl(),
      coordinate:new FormControl()

  });
  }
  loadTags() {
    this.clearMarkers()
    this.dataProvider.getTags(this.currentImage.id).subscribe((data: any) => {
      // if data is null
      if (data == null) {
        // set the field list to an empty array
        this.fieldList = [];
      }
      // else set the field list to the data
      else {
        this.fieldList = data.fields;
        // loop through the field list and add the markers
        this.state = data.state;
        this.markerArea?.restoreState(this.state);
        }
    });
  }
  clearMarkers() {
    this.markerArea?.clear()
  }

}
