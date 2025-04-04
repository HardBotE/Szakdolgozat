import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {IUser} from '../../Utils/Types';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AnswerNotificationService} from '../../Utils/answer/answer-notification.service';

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
  updatingType = '';
  formData: any = {
    name: '',
    prevPassword: '',
    password: '',
    passwordConfirm: '',
    currentPassword: '',
    email: '',
    photo: null // Fájlkezeléshez
  };

  constructor(private http: HttpClient, private router: Router,private answer:AnswerNotificationService) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/api/users/me', { withCredentials: true }).subscribe((res: any) => {
      this.loggedInUser = res.user;
      console.log(this.loggedInUser);
    });
  }

  showForm(updatingType: string, confidentiality: string) {
    this.isFormActive = true;
    this.isFormConfidential = confidentiality === 'confidential';
    this.updatingType = updatingType;
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.photo = input.files[0];
    }
  }

  sender(updateType: string) {
    const formDataToSend = new FormData();

    if (updateType === 'name') {
      formDataToSend.append('name', this.formData.name);
      this.http.patch(`http://localhost:3000/api/users/${this.loggedInUser?._id}`,
        { name: this.formData.name },
        { withCredentials: true }
      ).subscribe({
        next: () => {
          this.answer.showSuccess('Successfully changed name!');
          setTimeout(() => window.location.reload(), 1000);
        },
        error: (err) => {
          this.answer.showError('Failed to change name!');
          console.error(err);
        }
      });

    } else if (updateType === 'password') {
      formDataToSend.append('prevPassword', this.formData.prevPassword);
      formDataToSend.append('password', this.formData.password);
      formDataToSend.append('passwordConfirm', this.formData.passwordConfirm);

      this.http.post(`http://localhost:3000/api/users/passwordReset`, {
        password: this.formData.prevPassword,
        new_password: this.formData.password,
        passwordConfirm: this.formData.passwordConfirm
      }, { withCredentials: true }).subscribe({
        next: () => {
          this.answer.showSuccess('Successfully changed password!');
          setTimeout(() => window.location.reload(), 1000);
        },
        error: (err) => {
          this.answer.showError('Failed to change password!');
          console.error(err);
        }
      });

    } else if (updateType === 'email') {
      formDataToSend.append('currentPassword', this.formData.currentPassword);
      formDataToSend.append('email', this.formData.email);

      this.http.patch(`http://localhost:3000/api/users/${this.loggedInUser?._id}`,
        { email: this.formData.email },
        { withCredentials: true }
      ).subscribe({
        next: () => {
          this.answer.showSuccess('Successfully changed email!');
          setTimeout(() => window.location.reload(), 1000);
        },
        error: (err) => {
          this.answer.showError('Failed to change email!');
          console.error(err);
        }
      });

    } else if (updateType === 'photo' && this.formData.photo) {
      formDataToSend.append('file', this.formData.photo);

      this.http.post(`http://localhost:3000/api/uploads/profile_pictures/${this.loggedInUser?._id}`,
        formDataToSend,
        { withCredentials: true }
      ).subscribe({
        next: () => {
          this.answer.showSuccess('Successfully uploaded new profile photo!');
          setTimeout(() => window.location.reload(), 1000);
        },
        error: (err) => {
          this.answer.showError('Failed to upload profile photo!');
          console.error(err);
        }
      });
    }
  }


}
