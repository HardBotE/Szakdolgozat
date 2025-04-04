import {Component, OnInit} from '@angular/core';
import {IUser} from '../../Utils/Types';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NgForOf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AnswerNotificationService} from '../../Utils/answer/answer-notification.service';
import {AnswerNotificationComponent} from '../../Utils/answer/answer-notification.component';

@Component({
  selector: 'app-coach-register',
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    AnswerNotificationComponent
  ],
  templateUrl: './coach-register.component.html',
  standalone: true,
  styleUrl: './coach-register.component.css'
})
export class CoachRegisterComponent implements OnInit {
  constructor(private router: Router,private http: HttpClient,private fb:FormBuilder,private answer:AnswerNotificationService)  {
  }
  categories: { _id: string; name: string; description: string; image?: string }[] = [];
  loggedInUser: IUser = { _id: '',sub_type:'', name: '', role: '', email: '', picture: '' };

  registerForm!:FormGroup;
  ngOnInit() {
    this.registerForm = this.fb.group({
      category:['', Validators.required],
      motto:['', Validators.required],
      description: ['', Validators.required],

    })
    this.fetchUser();
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get<{ message: string; data: { _id: string; name: string; description: string; image?: string }[] }>(
      'http://localhost:3000/api/categories'
    ).subscribe(res => {
      this.categories = res.data;
    });

  }
  registerCoach() {
    this.http.post(
      `http://localhost:3000/api/categories/${this.registerForm.value.category}/coaches`,
      this.registerForm.value,
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        this.answer.showSuccess('Successfully registered as a coach');
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err) => {
        this.answer.showError('Failed to register as a coach');
        console.error(err);
      }
    });
  }

  fetchUser() {
    this.http.get<{ user: IUser }>('http://localhost:3000/api/users/me', { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.loggedInUser = res.user;
        },
        error: (err) => {
          console.log('User not logged in', err.status);
        }
      });
  }
}
