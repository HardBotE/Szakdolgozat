import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-success',
  template: `<p>Verifying payment...</p>`,
  standalone: true
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log('Payment Check')
    // @ts-ignore
    const session_Id = (localStorage.getItem('paidSession'));
    console.log(session_Id);
    // @ts-ignore
    const transactionId = (localStorage.getItem('transactionId'));
    console.log(transactionId);
    if (session_Id) {
      this.http.post(`http://localhost:3000/api/sessions/${session_Id}/check_payment`,{sessionId:transactionId},{withCredentials:true})
        .subscribe((res)=>{
          //@ts-ignore
          if(res.message==='Payment completed successfully'){
            this.router.navigate(['/sessions']);
          }
        });
    }
  }
}
