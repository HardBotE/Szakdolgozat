import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgClass, NgForOf, UpperCasePipe,NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {formatTime} from '../../Utils/conversions';
import {IUser} from '../../Utils/Types';

interface ISession {
  _id: string;
  client_id: string;
  coach_id: string;
  coach_name?:string;
  session_location?:string;
  date:{
    day: string,
    startTime: Date,
    endTime:Date
  },
  status:string

}

@Component({
  selector: 'app-sessions',
  imports: [
    NgForOf,
    NgClass,
    UpperCasePipe,
    NgIf
  ],
  templateUrl: './sessions.component.html',
  standalone: true,
  styleUrl: './sessions.component.css'
})
export class SessionsComponent implements OnInit {
  loggedInUser: IUser | undefined;
  sessions:ISession[]=[];

  constructor(private http: HttpClient, private router:Router) {
  }
  ngOnInit() {
    this.http.get('http://localhost:3000/api/users/me',{withCredentials:true}).subscribe(
      (res) => {
        // @ts-ignore
        this.loggedInUser=res.user;
      }
    )
    this.http.get('http://localhost:3000/api/sessions',{withCredentials:true}).subscribe((res)=>{
      // @ts-ignore
      res.data.forEach((item:ISession) => {
        this.http.get(`http://localhost:3000/api/coaches/${item.coach_id}`).subscribe((res)=>{

          //@ts-ignore
          item.coach_name=res.data.user_id.name;
        })
        this.http.post(`http://localhost:3000/api/coaches/availability/getFiltered`,{day:item.date.day,startTime:item.date.startTime,endTime:item.date.endTime,coach_Id:item.coach_id}).subscribe((res)=>{
          //@ts-ignore
          item.session_location=res.data.meetingDetails;
        })
        this.sessions.push(item);
      })
    })
    console.log(this.sessions)
  }

   startPay(sessionId:string){
     this.http.post<{ url: string }>(`http://localhost:3000/api/sessions/${sessionId}/payment`,{},{withCredentials:true})
       .subscribe({
         next: (res) => {
           console.log(res);
             // @ts-ignore
           localStorage.setItem("transactionId", res.session.id);
           localStorage.setItem('paidSession',sessionId);
             // @ts-ignore
             window.location.href = res.paymentUrl;

         },
         error: (err) => console.error('Error:', err)
       });

   }

   cancelSession(sessionId:string){
     this.http.post(`http://localhost:3000/api/reservations/${sessionId}/cancel`,{},{withCredentials:true}).subscribe(
       (res: any) => {
         console.log(res);
       }
     )
   }


  protected readonly formatTime = formatTime;
}
