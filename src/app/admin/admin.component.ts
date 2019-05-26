import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from "../services/login.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.loginService.clearLogin()
  }

}
