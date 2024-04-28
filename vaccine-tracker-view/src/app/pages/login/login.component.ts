import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, pipe } from 'rxjs';
import { User } from '../../model/User.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: User = {
    username: '',
    password: ''
  }

  passwordVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  private storeCookie(cookie: string) {
    // Here you can store the cookie in a service or local storage
    // For example, storing it in local storage:
    localStorage.setItem('authCookie', cookie);
  }
  login() {
    this.authService.login(this.credentials)
     .subscribe(
        res =>{
          console.log(res);

          if(res.message == "Login successful"){
            console.log("Login succesfull");
            this.router.navigate(['dashboard']);
          }
        }
      )


  }
}
