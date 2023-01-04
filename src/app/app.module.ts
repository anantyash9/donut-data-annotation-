import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnotationSpaceComponent } from './components/anotation-space/anotation-space.component';
import {MaterialExampleModule} from '../material.module';
import { DatasetViewComponent } from './components/home-view/dataset-view.component';
import { DatasetAddComponent } from './components/dataset-add/dataset-add.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressComponent } from './components/progress/progress.component';
import { UploadViewComponent } from './components/upload-view/upload-view.component';
import { HttpClientModule } from '@angular/common/http';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { ImageTaggerComponent } from './components/image-tagger/image-tagger.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TraningDataViewComponent } from './components/traning-data-view/traning-data-view.component';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    AnotationSpaceComponent,
    DatasetViewComponent,
    DatasetAddComponent,
    ProgressComponent,
    UploadViewComponent,
    DatasetDetailsComponent,
    ImageTaggerComponent,
    TraningDataViewComponent
  ],
  entryComponents: [
    ImageTaggerComponent
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialExampleModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
