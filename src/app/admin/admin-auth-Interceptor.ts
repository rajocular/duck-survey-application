import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {LoginService} from "../services/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.loginService.getToken();
    console.log(req);
    if(token) {
      const authenticatedRequest = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token)
      });
      return next.handle(authenticatedRequest);
    }
    return next.handle(req);
  }
}
