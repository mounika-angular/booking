import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private router: Router) { }

  login(username:string,password:string):boolean{
if(username!='' && password === 'Password123'){
  this.isAuthenticated = true;
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('username', username);
  this.router.navigate(['/meeting-rooms']);
  return true;
}
return false;
}

logout(): void {
  this.isAuthenticated = false;
  localStorage.removeItem('isAuthenticated');
  this.router.navigate(['/login']);
}

isLoggedIn(): boolean {
  const authState = localStorage.getItem('isAuthenticated');
  this.isAuthenticated = authState === 'true';
  return this.isAuthenticated;
}
}
