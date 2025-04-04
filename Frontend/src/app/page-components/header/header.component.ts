import {Component, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../../Utils/Types';
import {AnswerNotificationComponent} from '../../Utils/answer/answer-notification.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgOptimizedImage,
    AnswerNotificationComponent,

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

  async ngOnInit(): Promise<void> {
    try {
      // Get user data
      const userResponse = await this.http.get<any>(
        'http://localhost:3000/api/users/me',
        { withCredentials: true }
      ).toPromise();

      this.loggedInUser = userResponse.user;
      this.isLoggedIn = true;
      console.log('User:', this.loggedInUser);

      // Check if user is a coach and fetch coach data
      if (this.loggedInUser?.role === 'coach' && this.loggedInUser._id) {
        // Small delay to ensure user_id is available (though this might not be necessary)
        await new Promise(resolve => setTimeout(resolve, 300));

        const coachResponse = await this.http.post<any>(
          'http://localhost:3000/api/coaches/getCoachByUserid/',
          { user_id: this.loggedInUser._id },
          { withCredentials: true }
        ).toPromise();
        console.log(coachResponse);
        // Assign coachId safely
        if (coachResponse?.data[0]?._id) {
          this.loggedInUser.coachId = coachResponse.data[0]._id;
          console.log('Coach ID:', this.loggedInUser);
        } else {
          console.warn('Coach data not found in response');
        }
      }
    } catch (error) {
      this.isLoggedIn = false;
      console.error('Initialization error:', error);
      // @ts-ignore
      this.loggedInUser = null;
    }
  }


}
