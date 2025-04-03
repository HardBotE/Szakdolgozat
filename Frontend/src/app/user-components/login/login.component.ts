import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { jwtDecode } from "jwt-decode";
import {AnswerNotificationService} from '../../Utils/answer/answer-notification.service';
import {AnswerNotificationComponent} from '../../Utils/answer/answer-notification.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AnswerNotificationComponent,
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  hidePassword = true;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private answer:AnswerNotificationService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/api/users/login', {email:this.loginForm.value.email,password:this.loginForm.value.password}, {withCredentials: true})
        .subscribe((res) => {
          //@ts-ignore
          localStorage.setItem("jwt", res.token);
          //@ts-ignore
          const token=jwtDecode(res.token);
          //@ts-ignore
          localStorage.setItem('userId',token.id);

          this.answer.showSuccess('Successfully logged in!');
            setTimeout(() => {
              this.router.navigate(['/']).then(() => {
                setTimeout(() => window.location.reload(), 500);
              });
            }, 1000);

          },
          (error)=>{
            console.log('baj van')
            this.answer.showError(error.message);
          }
        );
    }
    else {
      this.answer.showError('Unknown error');
    }
  }
}
