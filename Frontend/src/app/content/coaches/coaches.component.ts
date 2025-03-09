import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Availability {
  day: string;
  reserved: boolean;
  _id: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  sub_type: string;
  id: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  __v: number;
}

interface Coach {
  _id: string;
  user_id: User;
  category_id: Category;
  description: string;
  price: number;
  rating: number;
  __v: number;
  availability: Availability[];
  id: string;
}

@Component({
  selector: 'app-coaches',
  imports: [CommonModule],
  templateUrl: './coaches.component.html',
  standalone: true,
  styleUrl: './coaches.component.css'
})
export class CoachesComponent implements OnInit {
  coaches: Coach[] = [];
  categoryId: string | null = null;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');

    if (this.categoryId) {
      this.http.get<Coach[]>(`http://localhost:3000/api/categories/${this.categoryId}/coaches`)
        .subscribe({
          next: (res) => {
            // @ts-ignore
            this.coaches = res.data;
            this.loading = false;
            console.log('Coaches loaded:', this.coaches);
          },
          error: (error) => {
            console.error('Error fetching coaches:', error);
            this.loading = false;
          }
        });
    }

    console.log('Current ID:', this.categoryId);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }
}
