import { Injectable } from '@angular/core'
import {  ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs';
import { MeetingRoomsComponent } from '../components/meeting-rooms/meeting-rooms.component';
import { AuthService } from './AuthService/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {
    constructor(private router: Router, private readonly authService: AuthService,) { }
    canActivate(
      next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean> {
        if (this.authService.isLoggedIn()) {
            return of(true);
        }
        else {
            alert("please login to book meeting room")
            this.router.navigate(['/login']);
            return of(false);
        }
    }

}