import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isMobileMenuOpen: boolean = false;
  currentRoute: string = '';
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();

    // Track current route for active navigation highlighting
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url.substring(1); // Remove leading slash
      });

    // Set initial route
    this.currentRoute = this.router.url.substring(1);
  }

  onNavigate(route: string): void {
    this.router.navigate([`/${route}`]);
    // Close mobile menu after navigation
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onLogout(): void {
    this.authService.logout();
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route;
  }

  // Check if user has access to a specific route
  hasAccess(route: string): boolean {
    const adminOnlyRoutes = ['users', 'profiles', 'payouts', 'reports', 'configurations'];
    if (adminOnlyRoutes.includes(route)) {
      return this.userRole === 'admin';
    }
    return true;
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
