import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AnswerNotificationService} from '../../Utils/answer/answer-notification.service';
import {AnswerNotificationComponent} from '../../Utils/answer/answer-notification.component';


@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AnswerNotificationComponent,
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;


  constructor(private fb: FormBuilder, private http: HttpClient,private answer:AnswerNotificationService,private router:Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email:['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]]
    });
  }






  onSubmit(): void {
    this.http.post('http://localhost:3000/api/users/register', {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      passwordConfirm: this.registerForm.value.passwordConfirm
    }).subscribe({
      next: (res) => {
        this.answer.showSuccess('Successfully registered!');
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.answer.showError('Registration failed!');
        console.error(err);
      }
    });
  }


}
