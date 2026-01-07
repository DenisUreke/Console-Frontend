import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ControllerType } from '../../Enums/Controller_type';
import { OrchestratorService } from '../../Services/orchestrator.service';
import { Player } from '../../Models/Player';
import { State } from '../../Enums/State';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TriviaService } from '../../Services/trivia.service';
import { TriviaPhase } from '../../Enums/Trivia';
import { PossibleMovesData, PossibleMove } from '../../Enums/Trivia';
 

@Component({
  selector: 'app-controller-trivia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './controller-trivia.component.html',
  styleUrl: './controller-trivia.component.css'
})
export class ControllerTriviaComponent {
  @ViewChild('joystickContainer', { static: false }) joystickContainer!: ElementRef;

  // Game state from orchestrator
  players: Player[] = [];
  playerCount = 0;
  gameState: State = State.LOBBY;
  currentPlayer: Player | null = null;
  controllerType: ControllerType = ControllerType.KEYPAD;
  throttle = 50;
  currentQuestion: any = null; // Placeholder for current question will chage later

  // Possible moves data and phase from trivia service
  possibleMovesData: PossibleMovesData | null = null;
  currentPhase: TriviaPhase = TriviaPhase.IDLE;


  selectedMoveIndex: number | null = null;

  // Subscriptions to orchestrator observables
  private playersSubscription: Subscription | undefined;
  private playerCountSubscription: Subscription | undefined;
  private gameStateSubscription: Subscription | undefined;
  private currentPlayerSubscription: Subscription | undefined;
  private controllerTypeSubscription: Subscription | undefined;
  private possibleMovesSubscription: Subscription | undefined;
  private phaseSubscription: Subscription | undefined;

  // Trivia service subscription
  phase$: Observable<TriviaPhase>;

  private joystickManager: any;

  // Dropdown state
  selectedPlayerId: number | null = null;

  constructor(private orchestrator: OrchestratorService, private triviaService: TriviaService) {
    this.phase$ = this.triviaService.phase$
   }

  ngOnInit(): void {
    // Subscribe to orchestrator observables (no direct WebSocket subscription)
    this.playersSubscription = this.orchestrator.players$.subscribe(
      (players) => {
        this.players = players;
        console.log('Controller - Players updated:', players);
      }
    );

    this.playerCountSubscription = this.orchestrator.playerCount$.subscribe(
      (count) => {
        this.playerCount = count;
        console.log('Controller - Player count:', count);
      }
    );

    this.gameStateSubscription = this.orchestrator.gameState$.subscribe(
      (state) => {
        this.gameState = state;
        console.log('Controller - Game state:', state);
      }
    );

    this.currentPlayerSubscription = this.orchestrator.currentPlayer$.subscribe(
      (player) => {
        this.currentPlayer = player;
        console.log('Controller - Current player:', player);
      }
    );

    this.controllerTypeSubscription = this.orchestrator.controllerType$.subscribe(
      (type) => {
        this.controllerType = type;
        console.log('Controller - Controller type:', type);
      }
    );
    
    this.possibleMovesSubscription = this.triviaService.possibleMovesData$.subscribe(
      (possibleMovesData) => {
        this.possibleMovesData = possibleMovesData;
        console.log('Controller - Current question:', possibleMovesData);
      }
    );

    this.phaseSubscription = this.triviaService.phase$.subscribe(
      (phase) => {
        this.currentPhase = phase;
        console.log('Controller - Current phase:', phase);
      }
    );
    
  }

  onButtonClick(button: string): void {

    var send_value: string = '';

    if (button == 'pause_toggle') {
      this.orchestrator.sendButtonPress(button);
      return;
    }

    switch(this.currentPhase){
      case TriviaPhase.IDLE:
        send_value = 'X';
        break;
      case TriviaPhase.CHOOSE_MOVE:
        send_value = this.selectedMoveIndex !== null ? this.selectedMoveIndex.toString() : '';
        break;
      case TriviaPhase.QUESTION:
        break;
    }
    
    this.orchestrator.sendButtonPress(send_value);
  }

  onPlayerSelected(event: any): void {

    const selectedID = Number(event.target.value)
    const selectedPlayer = this.players.find(p => p.player_number === selectedID)

    if (selectedPlayer) {
      this.orchestrator.changeLeader(selectedPlayer)
    };

  }

  ngOnDestroy(): void {
    // Clean up all orchestrator subscriptions
    if (this.playersSubscription) {
      this.playersSubscription.unsubscribe();
    }
    if (this.playerCountSubscription) {
      this.playerCountSubscription.unsubscribe();
    }
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.currentPlayerSubscription) {
      this.currentPlayerSubscription.unsubscribe();
    }
    if (this.controllerTypeSubscription) {
      this.controllerTypeSubscription.unsubscribe();
    }

    // Clean up joystick
    if (this.joystickManager) {
      this.joystickManager.destroy();
    }
  }

  getLeaderName(): string {
    return this.orchestrator.getLeaderName();
  }
  selectMove(move: PossibleMove): void {
  this.selectedMoveIndex = move.index;

  // later: send websocket message back to backend
  // this.ws.send({ type: 'trivia', data: { phase: 'CHOOSE_MOVE', topic: 'move_selected', payload: { index: move.index } }});
}

trackByMoveIndex(_: number, move: PossibleMove): number {
  return move.index;
}
}
