import { Routes } from '@angular/router';
import {CategoriesComponent} from './content/categories/categories.component';
import {LoginComponent} from './user-components/login/login.component';
import {RegisterComponent} from './user-components/register/register.component';
import {CoachesComponent} from './content/coaches/coaches.component';
import {ReserveComponent} from './content/reserve/reserve.component';
import {SessionsComponent} from './content/sessions/sessions.component';
import {PaymentSuccessComponent} from './content/sessions/payment-status/payment-status.component';
import {PaymentFailedComponent} from './content/sessions/payment-failed/payment-failed.component';
import {CoachRegisterComponent} from './user-components/coach-register/coach-register.component';
import {ProfileComponent} from './content/profile/profile.component';
import {ForgotPasswordComponent} from './user-components/forgot-password/forgot-password.component';
import {MessagingComponent} from './content/messaging/messaging.component';

export const routes: Routes = [
  {path:'',component:CategoriesComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'sessions',component:SessionsComponent},
  {path:'payment_success',component:PaymentSuccessComponent},
  {path:'coachRegister',component:CoachRegisterComponent},
  {path:'profile',component:ProfileComponent},
  {path:'forgot_password',component:ForgotPasswordComponent},
  {path:'payment_failed',component:PaymentFailedComponent},
  {path:'coach/:id',component:ReserveComponent},
  {path:'messages',component:MessagingComponent},
  {path:'categories/:id/coaches',component:CoachesComponent}
];
