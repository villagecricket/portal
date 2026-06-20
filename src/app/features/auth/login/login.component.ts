import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';
import { SettingsService } from '@core/services/settings.service';
import { environment } from '@environments/environment';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private settingsService = inject(SettingsService);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  loading = false;
  errorMessage = '';
  hidePassword = true;

  appSettings: any = {
    appName: 'EPL Admin Portal',
    logoUrl: null
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.getAppSettings().subscribe((res: any) => {
      if (res.success && res.data?.settings) {
        const s = res.data.settings;
        this.appSettings = {
          appName: s.AppName || 'EPL Admin Portal',
          logoUrl: s.AppLogoURL ? environment.apiUrl + s.AppLogoURL : null
        };
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const loginPayload = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

this.auth.login(loginPayload).subscribe({
      next: (res: any) => {
        this.loading = false;
        const user = this.auth.getUser();
        if (user?.role === 'owner') {
          this.router.navigate(['/owner-dashboard']);
        } else {
          this.router.navigate(['/kkk/players-list']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Login failed. Please try again.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 4000 });
      },
    });
  }
}
