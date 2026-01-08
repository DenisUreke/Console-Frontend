import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TriviaPhase } from '../Enums/Trivia';
import { PossibleMovesData } from '../Enums/Trivia';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {

  private currentQuestionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentQuestion$: Observable<any> = this.currentQuestionSubject.asObservable();

  private currentAnswersListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public currentAnswersList$: Observable<any[]> = this.currentAnswersListSubject.asObservable();

  private possilbeMovesDataSubject: BehaviorSubject<PossibleMovesData | null> = new BehaviorSubject<PossibleMovesData | null>(null);
  public possibleMovesData$: Observable<PossibleMovesData | null> = this.possilbeMovesDataSubject.asObservable();

  // 1 Internal State holder (BehaviorSubject = "always has a current value")
  private phaseSubject: BehaviorSubject<TriviaPhase> = new BehaviorSubject<TriviaPhase>(TriviaPhase.IDLE);
  // 2) Public stream that components can subscribe to
  public phase$: Observable<TriviaPhase> = this.phaseSubject.asObservable();

  constructor() { }

  // 3) Simple setter (called by orchestrator)
  setPhase(phase: TriviaPhase): void {
    this.phaseSubject.next(phase);
  }

  // 4) Synchronous getter
  getPhase(): TriviaPhase {
    return this.phaseSubject.value;
  }

  handleTriviaMessage(data: any): void {
  const phase = data?.phase;
  const topic = data?.topic;
  const payloadKeys = data?.payload ? Object.keys(data.payload) : []; // for testing

  switch (phase) {
    case TriviaPhase.CHOOSE_MOVE:
      if (topic === 'possible_moves' && data?.payload) {
      this.setPossibleMovesData(data.payload as PossibleMovesData);
      }
      break;
    case TriviaPhase.QUESTION:
      console.log('Received QUESTION phase with payload keys:', data.payload);
      this.assignQuestionData(data.payload);
      break;
    }

  this.setPhaseAcorrdingToMessage(phase);
}

setPossibleMovesData(movesData: PossibleMovesData): void {
  this.possilbeMovesDataSubject.next(movesData);
}

getPossibleMovesData(): PossibleMovesData | null {
  return this.possilbeMovesDataSubject.value;
}

setPhaseAcorrdingToMessage(phase: string): void {
  switch (phase) {
    case 'IDLE':
      this.setPhase(TriviaPhase.IDLE);
      break;
    case 'CHOOSE_MOVE':
      this.setPhase(TriviaPhase.CHOOSE_MOVE);
      break;
    case 'QUESTION':
      this.setPhase(TriviaPhase.QUESTION);
      break;
  }
}

assignQuestionData(payload: any): void {
  const q = payload?.questions?.[0];
  if (!q) return;

  this.currentQuestionSubject.next(q.question);
  this.currentAnswersListSubject.next(q.answers);
  console.log('Assigned question data:', q);
}

}