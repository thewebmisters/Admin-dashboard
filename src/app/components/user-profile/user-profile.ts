import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User, AuthState } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-user-profile',
    imports: [CommonModule],
    template: `
    <div class="container mt-4" *ngIf="authState$ | async as authState">
      <div class="card">
        <div class="card-header">
          <h3>User Profile</h3>
        </div>
        <div class="card-body" *ngIf="authState.user">
          <div class="row">
            <div class="col-md-4">
              <img [src]="authState.user.profile_photo" 
                   [alt]="authState.user.name" 
                   class="img-fluid rounded-circle mb-3"
                   style="max-width: 200px;">
            </div>
            <div class="col-md-8">
              <h4>{{ authState.user.name }}</h4>
              <p><strong>Email:</strong> {{ authState.user.email }}</p>
              <p><strong>Role:</strong> 
                <span class="badge" 
                      [class]="getRoleBadgeClass(authState.role)">
                  {{ authState.role | titlecase }}
                </span>
              </p>
              <p><strong>Phone:</strong> {{ authState.user.phone }}</p>
              <p><strong>Country:</strong> {{ authState.user.country }}</p>
              <p><strong>City:</strong> {{ authState.user.city }}</p>
              <p><strong>Age:</strong> {{ authState.user.age }}</p>
              <p><strong>Bio:</strong> {{ authState.user.bio }}</p>
              <p><strong>Interests:</strong> 
                <span *ngFor="let interest of authState.user.interests; let last = last">
                  {{ interest }}<span *ngIf="!last">, </span>
                </span>
              </p>
              <p><strong>Verification Status:</strong> 
                <span class="badge" 
                      [class]="getVerificationBadgeClass(authState.user.verification_status)">
                  {{ authState.user.verification_status | titlecase }}
                </span>
              </p>
              <p><strong>Account Status:</strong> 
                <span class="badge" 
                      [class]="authState.user.is_active ? 'bg-success' : 'bg-danger'">
                  {{ authState.user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
    authState$: Observable<AuthState>;

    constructor(private authService: AuthService) {
        this.authState$ = this.authService.authState$;
    }

    ngOnInit(): void { }

    getRoleBadgeClass(role: string | null): string {
        switch (role) {
            case 'admin': return 'bg-danger';
            case 'writer': return 'bg-warning';
            case 'user': return 'bg-primary';
            default: return 'bg-secondary';
        }
    }

    getVerificationBadgeClass(status: string): string {
        switch (status) {
            case 'verified': return 'bg-success';
            case 'pending': return 'bg-warning';
            case 'rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }
}