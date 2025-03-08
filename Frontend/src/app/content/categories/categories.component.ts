
import { Component ,OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {IUser} from '../../../Utils/Types';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [
    NgForOf,
    NgStyle,
    NgIf,
    RouterLink
  ],
  templateUrl: './categories.component.html',
  standalone: true,
  styleUrl: './categories.component.css'
})

export class CategoriesComponent implements OnInit {
  constructor(private http: HttpClient) {}
  categories:{_id:string,name: string,description:string,image?:string}[]=[];
  loggedInUser:IUser|undefined;

  ngOnInit() {
    const req= this.http.get<{message:string,data:{_id:string, name: string; description: string; image?: string;}[]}>('http://localhost:3000/api/categories')
      .subscribe((res)=>{
      this.categories=res.data;}

      );

      this.http.get('http://localhost:3000/api/users/me',{withCredentials:true}).subscribe(
        (res) => {
          // @ts-ignore
          this.loggedInUser=res.user;
          console.log(this.loggedInUser)
        }
      )
    }



  }



