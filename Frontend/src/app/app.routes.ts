import { Routes } from '@angular/router';
import {CategoriesComponent} from './content/categories/categories.component';
import {LoginComponent} from './user-components/login/login.component';
import {RegisterComponent} from './user-components/register/register.component';
import {CoachesComponent} from './content/coaches/coaches.component';

export const routes: Routes = [
  {path:'',component:CategoriesComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'categories/:id/coaches',component:CoachesComponent}
];
