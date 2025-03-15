import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../Utils/Types';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {formatTime} from '../../Utils/conversions';

interface IAvailability {
  day: string;
  startTime: Date;
  endTime: Date;
  reservation: {
    reserved:boolean;
    reservedBy:string;
  };
  coachId: string;
  price:string;
  description: string;
  meetingDetails: string;
  _id: string;
}

interface ICoach {
  _id: string;
  user_id: string;
  coachName?: string|'Unknown Coach';
  category_id: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
  description: string;
  price: number;
  rating: number;
}

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css'
})
export class ReserveComponent implements OnInit {
  isLoggedIn = false;
  loggedInUser: IUser = { _id: '', name: '', role: '', email: '', photo: '' };
  coach: ICoach | null = null;
  coachId: string | null = '';
  availabilities:IAvailability[]=[];
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Get logged in user
    this.http.get('http://localhost:3000/api/users/me', { withCredentials: true }).subscribe(
      (res) => {
        // @ts-ignore
        this.loggedInUser = res.user;
        this.isLoggedIn = true;
        console.log(this.loggedInUser);
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.isLoggedIn = false;
      }
    );

    // Get coach ID from route params
    if (this.route.snapshot.paramMap.get('id')) {
      this.coachId = this.route.snapshot.paramMap.get('id');
    }

    // Get coach data
    if (this.coachId) {
      this.http.get(`http://localhost:3000/api/coaches/${this.coachId}`, { withCredentials: true })
        .subscribe(
          (res: any) => {
            this.coach = res.data;
            // @ts-ignore
            this.coach.coachName=res.data.user_id.name;
            console.log(this.coach);

          });

      this.http.get(`http://localhost:3000/api/coaches/${this.coachId}/availability`, { withCredentials: true })
      .subscribe(
        (res: any) => {
          this.availabilities=res.data;
          console.log(this.availabilities);
        }
      )
    }
  }





  getDay(startDate:string|Date) {
    const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const day=new Date(startDate);
    return days[day.getDay()];

  }
  // Reserve a time slot
  reserveSlot(slotId: string): void {
    this.availabilities.forEach((item) => {
      if(item._id===slotId) {
        item.reservation.reserved = true;
      }
    });
    this.http.post(`http://localhost:3000/api/reservations/${slotId}/reserve`,{},{withCredentials:true}).subscribe(
      (res: any) => {
        console.log('Successfully reserved data');
        console.log(res);
      }
    )
  }


  protected readonly formatTime = formatTime;
}
