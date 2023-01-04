import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnotationSpaceComponent } from './components/anotation-space/anotation-space.component';
import { DatasetViewComponent } from './components/home-view/dataset-view.component';
import { DatasetAddComponent } from './components/dataset-add/dataset-add.component';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
//add anotation space component to the routes

const routes: Routes = [
  { path: '', component: AnotationSpaceComponent }, { path: 'dataset', component: DatasetViewComponent }, { path: 'dataset/add', component: DatasetAddComponent },
  { path: 'dataset/details', component: DatasetDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
