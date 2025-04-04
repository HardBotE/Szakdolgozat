import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgClass, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {Router} from '@angular/router';
import {IUser} from '../../Utils/Types';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

interface ISession {
  _id: string;
  client_id: string;
  coach_id: string;
  coach_user_id: string;
  description: string | 'No description provided';
  coach_name?: string;
  session_location?: string;
  date: {
    day: string,
    startTime: Date,
    endTime: Date
  },
  status: string
}

@Component({
  selector: 'app-sessions',
  imports: [
    NgForOf,
    NgClass,
    UpperCasePipe,
    NgIf,
    FormsModule
  ],
  templateUrl: './sessions.component.html',
  standalone: true,
  styleUrl: './sessions.component.css'
})
export class SessionsComponent implements OnInit {
  loggedInUser: IUser | undefined;
  sessions: ISession[] = [];
  editingSessionId: string | null = null;
  editSessionData: {
    startTime: Date;
    endTime: Date;
  } = {
    startTime: new Date(),
    endTime: new Date(),
  };

  constructor(private http: HttpClient, private router: Router) {
  }

  async ngOnInit() {
    try {
      // Get logged in user
      const userResponse = await firstValueFrom(
        this.http.get('http://localhost:3000/api/users/me', {withCredentials: true})
      );
      // @ts-ignore
      this.loggedInUser = userResponse.user;

      // Get sessions
      const sessionResponse = await firstValueFrom(
        this.http.get<{ data: ISession[] }>('http://localhost:3000/api/sessions', {withCredentials: true})
      );

      // @ts-ignore
      this.sessions = sessionResponse.data || [];

      // Enrich sessions with additional data
      if (this.sessions.length > 0) {
        await this.enrichSessions(this.sessions);
      }
    } catch (err) {
      console.log('Error in initialization:', err);
    }
  }

  async enrichSessions(sessions: ISession[]) {
    // Use Promise.all to wait for all enrichment operations to complete
    await Promise.all(sessions.map(async (item) => {
      try {
        // Get coach data
        const coachResponse = await firstValueFrom(
          this.http.get(`http://localhost:3000/api/coaches/${item.coach_id}`)
        );

        // Check if coachResponse.data and coachResponse.data.user_id exist before accessing
        // @ts-ignore
        if (coachResponse?.data?.user_id) {
          // @ts-ignore
          item.coach_name = coachResponse.data.user_id.name;
          // @ts-ignore
          item.coach_user_id = coachResponse.data.user_id._id;
        } else {
          item.coach_name = 'Unknown Coach';
          item.coach_user_id = '';
        }

        // Get availability data
        const availabilityResponse = await firstValueFrom(
          this.http.post(`http://localhost:3000/api/coaches/availability/getFiltered`, {
            day: item.date.day,
            startTime: item.date.startTime,
            endTime: item.date.endTime,
            coach_Id: item.coach_id
          })
        );

        // Check if availabilityResponse.data exists before accessing
        // @ts-ignore
        if (availabilityResponse?.data) {
          // @ts-ignore
          item.description = availabilityResponse.data.description || 'No description provided';
          // @ts-ignore
          item.session_location = availabilityResponse.data.meetingDetails || 'Location not specified';
        } else {
          item.description = 'No description provided';
          item.session_location = 'Location not specified';
        }

        return item;
      } catch (error) {
        console.error(`Error enriching session ${item._id}:`, error);
        // Set default values in case of error
        if (!item.coach_name) item.coach_name = 'Unknown Coach';
        if (!item.description) item.description = 'No description provided';
        if (!item.session_location) item.session_location = 'Location not specified';
        return item;
      }
    }));

    console.log('All sessions enriched:', sessions);
  }

  async loadSessions() {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: ISession[] }>('http://localhost:3000/api/sessions', { withCredentials: true })
      );

      // @ts-ignore
      this.sessions = response.data || [];

      if (this.sessions.length > 0) {
        await this.enrichSessions(this.sessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }

  startPay(sessionId: string) {
    this.http.post<{ url: string }>(`http://localhost:3000/api/sessions/${sessionId}/payment`, {}, {withCredentials: true})
      .subscribe({
        next: (res) => {
          console.log(res);
          // @ts-ignore
          localStorage.setItem("transactionId", res.session.id);
          localStorage.setItem('paidSession', sessionId);
          // @ts-ignore
          window.location.href = res.paymentUrl;
        },
        error: (err) => console.error('Error:', err)
      });
  }

  cancelSession(sessionId: string) {
    this.http.post(`http://localhost:3000/api/reservations/${sessionId}/cancel`, {}, {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.loadSessions(); // Reload sessions after cancellation
        },
        error: (err) => console.error('Error cancelling session:', err)
      });
  }

  contactCoach(sessionId: string, coachId: string) {
    this.http.post(`http://localhost:3000/api/coaches/${sessionId}/message`, {id: coachId}, {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          console.log(res);
          window.location.replace('http://localhost:4200/messages');
        },
        error: (err) => console.error('Error contacting coach:', err)
      });
  }

  formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleString();
  }

  formatDateTimeForInput(timeString: Date): Date {
    return new Date(timeString);
  }

  initiateEdit(sessionId: string, startTime: Date, endTime: Date): void {
    this.editingSessionId = sessionId;
    this.editSessionData.startTime = this.formatDateTimeForInput(startTime);
    this.editSessionData.endTime = this.formatDateTimeForInput(endTime);
  }

  cancelEdit(): void {
    this.editingSessionId = null;
  }

  saveSessionEdit(sessionId: string): void {
    this.http.patch(
      `http://localhost:3000/api/sessions/${sessionId}`,
      {
        startTime: new Date(this.editSessionData.startTime).toISOString(),
        endTime: new Date(this.editSessionData.endTime).toISOString()
      },
      {withCredentials: true}
    ).subscribe({
      next: (response) => {
        console.log('Session updated successfully', response);
        this.editingSessionId = null;
        this.loadSessions();
      },
      error: (error) => {
        console.error('Error updating session', error);
        alert('Failed to update session. Please try again.');
      }
    });
  }

  protected readonly alert = alert;
}
