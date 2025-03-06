
import { Component ,OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgForOf, NgStyle} from '@angular/common';
import * as stream from 'node:stream';
@Component({
  selector: 'app-categories',
  imports: [
    NgForOf,
    NgStyle
  ],
  templateUrl: './categories.component.html',
  standalone: true,
  styleUrl: './categories.component.css'
})

export class CategoriesComponent implements OnInit {
  constructor(private http: HttpClient) {}

  categories:{_id:string,name: string,description:string,image?:string}[]=[];


  ngOnInit() {
    const req= this.http.get<{message:string,data:{_id:string, name: string; description: string; image?: string;}[]}>('http://localhost:3000/api/categories')
      .subscribe((res)=>{
      this.categories=res.data;


    });




  }


}
