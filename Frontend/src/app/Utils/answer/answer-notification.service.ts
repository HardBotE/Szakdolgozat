// answer-notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AnswerMessage {
  id: number;
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AnswerNotificationService {
  private currentId = 0;
  private answerMessagesSubject = new BehaviorSubject<AnswerMessage[]>([]);

  public answerMessages$: Observable<AnswerMessage[]> = this.answerMessagesSubject.asObservable();

  constructor() {}

  showSuccess(message: string): void {
    this.addAnswer('success', message);
  }

  showError(message: string): void {
    this.addAnswer('error', message);
  }

  closeAnswer(id: number): void {
    const currentAnswers = this.answerMessagesSubject.getValue();
    const updatedAnswers = currentAnswers.map(answer =>
      answer.id === id ? { ...answer, visible: false } : answer
    );
    this.answerMessagesSubject.next(updatedAnswers);

    // Távolítsa el a rejtett értesítéseket az állapotból kis késleltetéssel
    setTimeout(() => {
      const activeAnswers = this.answerMessagesSubject.getValue().filter(answer => answer.id !== id);
      this.answerMessagesSubject.next(activeAnswers);
    }, 300);
  }

  private addAnswer(type: 'success' | 'error', message: string): void {
    const id = this.getNextId();
    const currentAnswers = this.answerMessagesSubject.getValue();

    const newAnswer: AnswerMessage = {
      id,
      type,
      message,
      visible: true
    };

    this.answerMessagesSubject.next([...currentAnswers, newAnswer]);
  }

  private getNextId(): number {
    return ++this.currentId;
  }
}
