import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import nipplejs from 'nipplejs';
import { ControllerType } from '../../Enums/Controller_type';
import { OrchestratorService } from '../../Services/orchestrator.service';
import { Player } from '../../Models/Player';
import { State } from '../../Enums/State';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controller-lobby',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './controller-lobby.component.html',
  styleUrl: './controller-lobby.component.css'
})
export class ControllerLobbyComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('joystickContainer', { static: false }) joystickContainer!: ElementRef;

  // Game state from orchestrator
  players: Player[] = [];
  playerCount = 0;
  gameState: State = State.LOBBY;
  currentPlayer: Player | null = null;
  controllerType: ControllerType = ControllerType.LOBBY;
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

  ngAfterViewInit() {
    this.initializeJoystick();
  }

private initializeJoystick() {
  if (!this.joystickContainer) return;

  this.joystickManager = nipplejs.create({
    zone: this.joystickContainer.nativeElement,
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'cyan',
    size: 120
  });

  // Throttle joystick messages (send every 50ms max)
  let lastSent = Date.now();

  this.joystickManager.on('move', (evt: any, data: any) => {
    const now = Date.now();
    if (now - lastSent > this.throttle) {
      this.orchestrator.sendJoystickMove(
        data.angle?.degree || 0,
        data.distance || 0
      );
      lastSent = now;
    }
  });

  this.joystickManager.on('end', () => {
    console.log('Joystick released');

    // Use orchestrator to send release event
    this.orchestrator.sendJoystickRelease();
  });
}

  onButtonClick(button: string): void {
    console.log('Button clicked:', button);

    // Use orchestrator to send button press
    this.orchestrator.sendButtonPress(button);
  }

  onJoystickMove(joystick: string): void {
    console.log('Joystick used:', joystick);
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
}
