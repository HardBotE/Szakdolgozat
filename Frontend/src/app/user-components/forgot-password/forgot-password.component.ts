import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AnswerNotificationService} from '../../Utils/answer/answer-notification.service';
import {AnswerNotificationComponent} from '../../Utils/answer/answer-notification.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    AnswerNotificationComponent
  ],
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  token=true;
  submitForm:FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient,private router : Router,private answer:AnswerNotificationService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.submitForm=this.fb.group({
      token:['', [Validators.required]],
      newPassword:['', [Validators.required]],
      passwordConfirmed:['', [Validators.required]]
    })
  }

  onSubmit(): void {
    console.log(this.resetForm.value.email);
      this.http.post('http://localhost:3000/api/users/forgot_password', { email:this.resetForm.value.email }).subscribe({
        next: (res: any) => {
          console.log(res);
          this.token=false;
        }
      });
    }
  onResetPassword(): void {
    console.log(this.submitForm.value);

    this.http.post('http://localhost:3000/api/users/reset_password', {
      token: this.submitForm.value.token,
      newPassword: this.submitForm.value.newPassword,
      passwordConfirm: this.submitForm.value.passwordConfirmed
    }).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.answer.showSuccess('Password has been reset successfully!');
          setTimeout(() => this.router.navigate(['/login']), 1000);
        } else {
          this.answer.showError('Something went wrong while resetting the password.');
        }
      },
      error: (err) => {
        this.answer.showError('Failed to reset password!');
        console.error(err);
      }
    });
  }



}
