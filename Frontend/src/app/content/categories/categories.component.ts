import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IUser } from '../../Utils/Types';
import { getPermittedFields } from '../../Utils/permitCrudFields';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [NgForOf, NgStyle, NgIf, RouterLink, FormsModule],
  templateUrl: './categories.component.html',
  standalone: true,
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: { _id: string; name: string; description: string; image?: string }[] = [];
  loggedInUser: IUser = { _id: '',sub_type:'', name: '', role: '', email: '', photo: '' };
  showModal = false;
  isEditing = false;
  formData = { name: '', description: '', image: '' };
  selectedCategoryId: string | null = null;

  constructor(private http: HttpClient) {}

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
    this.showModal = true;
  }

  editCategory(category: any) {
    this.isEditing = true;
    this.selectedCategoryId = category._id;
    this.formData = { name: category.name, description: category.description, image: category.image || '' };
    this.showModal = true;
  }

  deleteCategory(categoryId: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.http.delete(`http://localhost:3000/api/categories/${categoryId}`,{withCredentials:true})
        .subscribe(() => {
          this.categories = this.categories.filter(c => c._id !== categoryId);
        });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  submitCategory() {
    if (this.isEditing) {
      this.http.patch(`http://localhost:3000/api/categories/${this.selectedCategoryId}`, this.formData,{withCredentials:true})
        .subscribe(() => {
          this.fetchCategories();
          this.closeModal();
        });
    } else {
      this.http.post('http://localhost:3000/api/categories', this.formData,{withCredentials:true})
        .subscribe(() => {
          this.fetchCategories();
          this.closeModal();
        });
    }
  }
}
