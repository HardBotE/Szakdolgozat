import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  hidePassword = true;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/api/users/login', {email:this.loginForm.value.email,password:this.loginForm.value.password}, {withCredentials: true})
        .subscribe(() => {
          console.log('Successfully logged in!');
          this.router.navigate(['/']).then(() => {
            setTimeout(() => window.location.reload(), 50);
          });
        });
    } else {
      console.log('Error logging in!');
    }
  }
}
