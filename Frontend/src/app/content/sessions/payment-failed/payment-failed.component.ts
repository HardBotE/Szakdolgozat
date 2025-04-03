// payment-failed.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {
  errorMessage: string = 'A fizetési folyamat során hiba történt.';
  errorCode: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Ha van error code a URL paraméterben, akkor kiolvassuk
    this.route.queryParams.subscribe(params => {
      if (params['error_code']) {
        this.errorCode = params['error_code'];
      }
    });
  }

  navigateToCheckout(): void {
    // Visszairányítás a fizetési oldalra
    this.router.navigate(['/sessions']);
  }

  navigateToHome(): void {
    // Visszairányítás a főoldalra
    this.router.navigate(['/']);
  }
}
