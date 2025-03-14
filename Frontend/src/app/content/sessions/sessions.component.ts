import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgClass, NgForOf, UpperCasePipe,NgIf} from '@angular/common';
import {Router} from '@angular/router';

interface ISession {
  _id: string;
  client_id: string;
  coach_id: string;
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

  sessions:ISession[]=[];

  constructor(private http: HttpClient, private router:Router) {
  }
  ngOnInit() {

    this.http.get('http://localhost:3000/api/sessions',{withCredentials:true}).subscribe((res)=>{
      // @ts-ignore
      res.data.forEach((item:ISession) => {
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
}
