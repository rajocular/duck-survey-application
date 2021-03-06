import {NgModule} from "@angular/core";
import { AdminHomeComponent } from './admin-home/admin-home.component';
import {AdminRoutingModule} from "./admin.routing";
import {CommonModule} from "@angular/common";
import {AdminComponent} from "./admin.component";
import {
  MatButtonModule, MatChipsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule, MatListModule, MatProgressSpinnerModule,
  MatSelectModule
} from "@angular/material";
import {ReactiveFormsModule} from "@angular/forms";
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { AdminFoodComponent } from './admin-food/admin-food.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminLoginComponent,
    AdminNavComponent,
    AdminFoodComponent,
    AdminRegisterComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class  AdminModule{}
