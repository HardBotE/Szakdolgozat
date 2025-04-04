import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IUser } from '../../Utils/Types';
import { getPermittedFields } from '../../Utils/permitCrudFields';
import {FormsModule} from '@angular/forms';
import {AnswerNotificationComponent} from '../../Utils/answer/answer-notification.component';
import {AnswerNotificationService} from '../../Utils/answer/answer-notification.service';

@Component({
  selector: 'app-categories',
  imports: [NgForOf, NgStyle, NgIf, RouterLink, FormsModule],
  templateUrl: './categories.component.html',
  standalone: true,
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: { _id: string; name: string; description: string; background_image?: string }[] = [];
  loggedInUser: IUser = { _id: '', sub_type: '', name: '', role: '', email: '', picture: '' };
  showModal = false;
  isEditing = false;
  formData = { name: '', description: '', image: '' };
  selectedCategoryId: string | null = null;
  uploadFile: File | null = null; // Fájlfeltöltéshez

  constructor(private http: HttpClient, private answer:AnswerNotificationService ) {}

  ngOnInit() {
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

  showCreateCategoryModal() {
    this.isEditing = false;
    this.formData = { name: '', description: '', image: '' };
    this.uploadFile = null; // Reset fájl
    this.showModal = true;
  }

  editCategory(category: any) {
    this.isEditing = true;
    this.selectedCategoryId = category._id;
    this.formData = { name: category.name, description: category.description, image: category.image || '' };
    this.uploadFile = null; // Reset fájl
    this.showModal = true;
  }

  deleteCategory(categoryId: string) {
    if (confirm('Are you sure you want to delete this requestCategory?')) {
      this.http.delete(`http://localhost:3000/api/categories/${categoryId}`, { withCredentials: true })
        .subscribe(() => {
          this.categories = this.categories.filter(c => c._id !== categoryId);
          this.answer.showSuccess('Successfully deleted requestCategory');
        });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
    }
  }

  submitCategory() {
    if (this.isEditing) {
      this.http.patch(`http://localhost:3000/api/categories/${this.selectedCategoryId}`, this.formData, { withCredentials: true })
        .subscribe(() => {
          this.uploadImageIfNeeded();
          this.answer.showSuccess('Successfully updated requestCategory');
        });
    } else {
      this.http.post('http://localhost:3000/api/categories', this.formData, { withCredentials: true })
        .subscribe((res: any) => {
          this.selectedCategoryId = res.data._id; // Az új kategória ID-ja
          this.uploadImageIfNeeded();
          this.answer.showSuccess('Successfully created requestCategory');
        });
    }
  }

  uploadImageIfNeeded() {
    if (this.uploadFile && this.selectedCategoryId) {
      const formData = new FormData();
      formData.append('file', this.uploadFile);

      this.http.post(`http://localhost:3000/api/uploads/category_backgrounds/${this.selectedCategoryId}`, formData, { withCredentials: true })
        .subscribe(() => {
          this.fetchCategories(); // Frissítés feltöltés után
          this.closeModal();
        });
    } else {
      this.fetchCategories();
      this.closeModal();
    }
  }
}
