// answer-notification.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnswerNotificationService, AnswerMessage } from './answer-notification.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-answer-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-notification.component.html',
  styleUrls: ['./answer-notification.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(50px)' }))
      ])
    ])
  ]
})
export class AnswerNotificationComponent implements OnInit {
  answerMessages: AnswerMessage[] = [];

  constructor(private answerService: AnswerNotificationService) {}

  ngOnInit(): void {
    this.answerService.answerMessages$.subscribe(messages => {
      this.answerMessages = messages;
    });
  }

  closeAnswer(id: number): void {
    this.answerService.closeAnswer(id);
  }
}
