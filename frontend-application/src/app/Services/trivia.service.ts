import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TriviaPhase } from '../Enums/Trivia';
import { PossibleMovesData } from '../Enums/Trivia';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {

  private possilbeMovesDataSubject: BehaviorSubject<PossibleMovesData | null> = new BehaviorSubject<PossibleMovesData | null>(null);
  public possibleMovesData$: Observable<PossibleMovesData | null> = this.possilbeMovesDataSubject.asObservable();

  // 1 Internal State holder (BehaviorSubject = "always has a current value")
  private phaseSubject: BehaviorSubject<TriviaPhase> = new BehaviorSubject<TriviaPhase>(TriviaPhase.ANSWERING);
  
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
  const payloadKeys = data?.payload ? Object.keys(data.payload) : [];

  switch (phase) {
    case TriviaPhase.CHOOSE_MOVE:
      if (topic === 'possible_moves' && data?.payload) {
      this.setPossibleMovesData(data.payload as PossibleMovesData);
      }
      break;
    }
}

setPossibleMovesData(movesData: PossibleMovesData): void {
  this.possilbeMovesDataSubject.next(movesData);
}

getPossibleMovesData(): PossibleMovesData | null {
  return this.possilbeMovesDataSubject.value;
}

}