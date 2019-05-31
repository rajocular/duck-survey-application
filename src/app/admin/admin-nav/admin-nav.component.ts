import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit, OnDestroy {
  authenticated;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.authenticated = this.loginService.getIsAuthenticated();
    this.loginService.getAuthUpdateListener().subscribe(isAuth=>{
      this.authenticated = isAuth;
    })
  }

  ngOnDestroy(): void {
    this.loginService.clearLogin()
  }

  logout() {
    this.loginService.logout();
  }

}
