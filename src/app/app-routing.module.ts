import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SurveyComponent} from "./survey/survey.component";

const routes: Routes = [
  {path:'', component: SurveyComponent},
  {path: 'admin', loadChildren: "./admin/admin.module#AdminModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
