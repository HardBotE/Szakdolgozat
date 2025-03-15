import {Component, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../../Utils/Types';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgOptimizedImage,

  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  isLoggedIn: boolean = false;
  loggedInUser: IUser | undefined;
  constructor(private router:Router,private http:HttpClient) {
  }
  goToHomePage() {
    this.router.navigate(['/']); // Az útvonalat itt állítsd be a megfelelő home oldalra
  }

  onLogout() {
    this.http.post('http://localhost:3000/api/users/logout',{},{withCredentials:true}).subscribe(
      (res) => {
        console.log('Logged out user...');

      })
    new Promise(resolve => {
      setTimeout(resolve,1500);
    })
    window.location.reload();

  }

  ngOnInit() {
    this.http.get('http://localhost:3000/api/users/me',{withCredentials:true}).subscribe(
      (res) => {
        // @ts-ignore
        this.loggedInUser=res.user;
        this.isLoggedIn=true;
        console.log(this.loggedInUser)
      }
    )
  }

}
