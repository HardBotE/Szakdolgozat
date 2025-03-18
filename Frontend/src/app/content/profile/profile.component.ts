import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {IUser} from '../../Utils/Types';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  loggedInUser: IUser | undefined;
  isFormActive = false;
  isFormConfidential = false;
  updatingType='';
  formData: any = {
    name: '',
    prevPassword: '',
    password: '',
    passwordConfirm: '',
    currentPassword: '',
    email: '',
    photo: null
  };
  constructor(private http: HttpClient, private router: Router) {
  }
  ngOnInit() {
    this.http.get('http://localhost:3000/api/users/me',{withCredentials:true}).subscribe(
      (res) => {
        // @ts-ignore
        this.loggedInUser=res.user;
        console.log(this.loggedInUser)
      }
    )
  }

  showForm(updatingType:string,confidentiality:string){
    if(confidentiality == 'not-confidential'){
      this.isFormActive=true;
      this.isFormConfidential=false;
      this.updatingType=updatingType;
    }
    if(confidentiality == 'confidential'){
      this.isFormConfidential=true;
      this.isFormActive=true;
      this.updatingType=updatingType;
    }

  }

  sender(updateType: string) {
    const formDataToSend = new FormData();

    if (updateType === 'name') {
      formDataToSend.append('name', this.formData.name);
      this.http.patch(`http://localhost:3000/api/users/${this.loggedInUser?._id}`,{name:this.formData.name},{
        withCredentials:true}).subscribe(
        (res)=>{
          console.log(res);
        }
      );
    } else if (updateType === 'password') {
      formDataToSend.append('prevPassword', this.formData.prevPassword);
      formDataToSend.append('password', this.formData.password);
      formDataToSend.append('passwordConfirm', this.formData.passwordConfirm);
      this.http.post  (`http://localhost:3000/api/users/passwordReset`, {password:this.formData.prevPassword,new_password:this.formData.password,passwordConfirm:this.formData.passwordConfirm},{withCredentials:true}).subscribe(
        (res)=>{
          console.log(res);
        }
      );
    } else if (updateType === 'email') {
      formDataToSend.append('currentPassword', this.formData.currentPassword);
      formDataToSend.append('email', this.formData.email);
      this.http.patch(`http://localhost:3000/api/users/${this.loggedInUser?._id}`, {email:this.formData.email},{withCredentials:true}).subscribe(
        (res)=>{
          console.log(res);
        }
      );
    } else if (updateType === 'photo' && this.formData.photo) {
      formDataToSend.append('photo', this.formData.photo);
      this.http.post('http://localhost:3000/api/uploads/profile_pictures',formDataToSend,{withCredentials:true}).subscribe(
        (res)=>{
          console.log(res);
        }
      )
    }


  }

  onFileSelected(){
    console.log('hihi');
  }
}
