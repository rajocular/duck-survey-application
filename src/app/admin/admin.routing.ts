import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {AdminLoginComponent} from "./admin-login/admin-login.component";
import {AdminFoodComponent} from "./admin-food/admin-food.component";
import {AuthGuard} from "../authentication/auth-guard";
import {AdminRegisterComponent} from "./admin-register/admin-register.component";

const adminRoutes: Routes = [
  {path: '', component: AdminComponent, children:[
      {path: '', component: AdminLoginComponent},
      {path: 'register', component: AdminRegisterComponent},
      {path: 'home', component: AdminHomeComponent, canActivate: [AuthGuard]},
      {path: 'food', component: AdminFoodComponent, canActivate: [AuthGuard]},
      {path: '**', redirectTo: '', pathMatch: 'full'}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AdminRoutingModule {}
