import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  adminForm: FormGroup;
  isAuthenticated = true;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.adminForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
    this.loginService.getAuthUpdateListener().subscribe(isAuthenticated=>{
      this.isAuthenticated = isAuthenticated;
    });
  }

  loginCheck() {
    this.loginService.login(this.adminForm.value);
  }

}
