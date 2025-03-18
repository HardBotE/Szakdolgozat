import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email:['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]]
    });
  }






  onSubmit(): void {



      this.http.post('http://localhost:3000/api/users/register',
        {
          name:this.registerForm.value.name,
          email:this.registerForm.value.email,
          password:this.registerForm.value.password,
          passwordConfirm:this.registerForm.value.passwordConfirm
        }).subscribe(
        (res) => {
          console.log(res);
        })

    }

}
