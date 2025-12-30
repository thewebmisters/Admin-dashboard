import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.authService.authState$.pipe(
            take(1),
            map(authState => {
                if (authState.isAuthenticated && authState.role === 'admin') {
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    this.authService.handleApiError('Admin access required');
                    return false;
                }
            })
        );
    }
}