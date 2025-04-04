import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { IUser } from '../../Utils/Types';
import {AnswerNotificationService} from '../../Utils/answer/answer-notification.service';

@Component({
  selector: 'app-request-category',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './requestCategory.component.html',
  styleUrl: './requestCategory.component.css'
})
export class RequestCategoryComponent implements OnInit {
  loggedInUser!: IUser;
  categoryForm!: FormGroup;
  requests: any[] = [];
  isAdmin = false;

  constructor(private http: HttpClient, private fb: FormBuilder,private answer:AnswerNotificationService) {}

  ngOnInit(): void {
    this.http.get<{ user: IUser }>('http://localhost:3000/api/users/me', { withCredentials: true })
      .subscribe((res) => {
        console.log(res);
        this.loggedInUser = res.user;
        this.isAdmin = this.loggedInUser.role === 'admin';

        if (this.isAdmin) {
          this.fetchRequests();
        }
      });

    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required],
      category_description: ['', Validators.required],
      further_details: ['']
    });
  }

  fetchRequests() {
    this.http.get<any[]>('http://localhost:3000/api/requestCategory', { withCredentials: true })
      .subscribe((res) => {
        console.log(res);
        //@ts-ignore
        this.requests = res.data;
      });
  }

  submitRequest() {
    if (this.loggedInUser?.role !== 'coach') {
      alert('Only coaches can submit category requests.');
      return;
    }

    if (this.categoryForm.invalid) return;

    const requestData = {
      ...this.categoryForm.value,
      user_id: this.loggedInUser._id
    };



    this.http.post('http://localhost:3000/api/requestCategory',requestData,{ withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.categoryForm.reset();
          this.answer.showSuccess('Successfully sent category Request for admin!')
        },
        error: (err) => {
          this.answer.showSuccess(err);
        }
      });
  }
}
