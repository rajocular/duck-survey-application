import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent implements OnInit {
  adminForm: FormGroup;
  error;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.adminForm = new FormGroup({
      username: new FormControl('', {validators: [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z0-9 ]*$")]}),
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(8)]}),
      confirmPassword: new FormControl('', Validators.required)
    })
  }

  checkPassword() {
    let password = this.adminForm.controls.password.value;
    let confirmPassword = this.adminForm.controls.confirmPassword.value;
    this.error = password !== confirmPassword;
  }

  register() {
    this.loginService.register(this.adminForm.value);
  }

}
