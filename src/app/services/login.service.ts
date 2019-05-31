import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../models/user.model";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class LoginService {
  private url = "http://localhost:3000";
  private token: string;
  private isAuthenticated = false;
  private authUpdated = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return localStorage.getItem('token');
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthUpdateListener() {
    return this.authUpdated.asObservable();
  }

  login({username, password}){
    this.http.post<{user: User, token: string}>(this.url+"/admin", {username, password}).subscribe((result)=>{
      if(result.token){
        this.token = result.token;
        this.rememberLogin(result.token);
        this.isAuthenticated = true;
        this.authUpdated.next(true);
        this.router.navigate(['/admin/home']);
      }
    }, ()=>{
      this.isAuthenticated = false;
      this.authUpdated.next(false);
    });
  }

  rememberLogin(token) {
    localStorage.setItem('token', token);
  }

  clearLogin() {
    localStorage.removeItem('token');
  }

  checkLogin() {
    const token = localStorage.getItem('token');
    if(token){
      this.token = token;
      this.isAuthenticated = true;
      this.authUpdated.next(true);
    }
  }

  logout() {
    this.http.post(this.url+ "/admin/logout", '').subscribe(()=>{
      this.clearLogin();
      this.token = null;
      this.isAuthenticated = false;
      this.authUpdated.next(false);
      this.router.navigate(['/'])
    });
  }

  register({username, password, confirmpass}) {
    this.http.post(this.url+"/admin/register", {username, password}).subscribe(success=>{
      this.router.navigate(['/admin'])
    }, data=>{
      alert(data.error.message)
    })
  }

}
