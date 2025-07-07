import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ControllerType } from '../../Enums/Controller_type';
import { OrchestratorService } from '../../Services/orchestrator.service';
import { Player } from '../../Models/Player';
import { State } from '../../Enums/State';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controller-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './controller-menu.component.html',
  styleUrl: './controller-menu.component.css'
})
export class ControllerMenuComponent implements OnDestroy, OnInit {
  @ViewChild('joystickContainer', { static: false }) joystickContainer!: ElementRef;

  // Game state from orchestrator
  players: Player[] = [];
  playerCount = 0;
  gameState: State = State.LOBBY;
  currentPlayer: Player | null = null;
  controllerType: ControllerType = ControllerType.KEYPAD;
  throttle = 50;

  // Subscriptions to orchestrator observables
  private playersSubscription: Subscription | undefined;
  private playerCountSubscription: Subscription | undefined;
  private gameStateSubscription: Subscription | undefined;
  private currentPlayerSubscription: Subscription | undefined;
  private controllerTypeSubscription: Subscription | undefined;

  private joystickManager: any;

  // Dropdown state
  selectedPlayerId: number | null = null;

  constructor(private orchestrator: OrchestratorService) { }

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
  }

  onButtonClick(button: string): void {
    console.log('Button clicked:', button);

    // Use orchestrator to send button press
    this.orchestrator.sendButtonPress(button);
  }

  onPlayerSelected(event: any): void {

    const selectedID = Number(event.target.value)
    const selectedPlayer = this.players.find(p => p.player_number === selectedID)

    if (selectedPlayer) {
      this.orchestrator.changeLeader(selectedPlayer)
    };

  }

  onControllerClick(direction: string) {
    const button = document.querySelector(`.${direction}-button`);
    if (button) {
      button.classList.add('pressed');
      setTimeout(() => button.classList.remove('pressed'), 150);
    }

    this.orchestrator.sendKeyPadPress(direction)
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
}
