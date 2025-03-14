import { Routes } from '@angular/router';
import {CategoriesComponent} from './content/categories/categories.component';
import {LoginComponent} from './user-components/login/login.component';
import {RegisterComponent} from './user-components/register/register.component';
import {CoachesComponent} from './content/coaches/coaches.component';
import {ReserveComponent} from './content/reserve/reserve.component';
import {SessionsComponent} from './content/sessions/sessions.component';
import {PaymentSuccessComponent} from './content/sessions/payment-status/payment-status.component';
import {PaymentFailedComponent} from './content/sessions/payment-failed/payment-failed.component';

export const routes: Routes = [
  {path:'',component:CategoriesComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'sessions',component:SessionsComponent},
  {path:'payment_success',component:PaymentSuccessComponent},
  {path:'payment_failed',component:PaymentFailedComponent},
  {path:'coach/:id',component:ReserveComponent},
  {path:'categories/:id/coaches',component:CoachesComponent}
];
