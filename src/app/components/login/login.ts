import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  passwordVisible = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Debug: Check if MessageService is properly injected
    console.log('MessageService injected:', this.messageService);
  }

  ngOnInit(): void { }
  /**
     * Toggles the visibility of a password field.
     * @param field The field to toggle ('password' or 'confirmPassword')
     */
  toggleVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    }
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const formValues = this.loginForm.value;
      const payload = {
        identifier: formValues.email,
        password: formValues.password
      }
      this.authService.login(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirect based on user role
          const userRole = this.authService.getUserRole();
          if (response.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.authService.handleErrors('You are not authorized!');
          }
          return;
        },
        error: (err) => {
          this.isLoading = false;
          this.authService.handleApiError(err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}