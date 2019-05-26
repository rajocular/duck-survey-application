import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {AdminLoginComponent} from "./admin-login/admin-login.component";
import {AdminFoodComponent} from "./admin-food/admin-food.component";

const adminRoutes: Routes = [
  {path: '', component: AdminComponent, children:[
      {path: '', component: AdminLoginComponent},
      {path: 'home', component: AdminHomeComponent},
      {path: 'food', component: AdminFoodComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
