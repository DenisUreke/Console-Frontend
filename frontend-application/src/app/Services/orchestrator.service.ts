import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { ControllerType } from '../Enums/Controller_type';
import { Player } from '../Models/Player';
import { State } from '../Enums/State';


@Injectable({
  providedIn: 'root'
})
export class OrchestratorService {

  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$: Observable<Player[]> = this.playersSubject.asObservable();

  private gameStateSubject = new BehaviorSubject<State>(State.LOBBY);
  public gameState$: Observable<State> = this.gameStateSubject.asObservable();

  private playerCountSubject = new BehaviorSubject<number>(0);
  public playerCount$: Observable<number> = this.playerCountSubject.asObservable();

  private currentPlayerSubject = new BehaviorSubject<Player | null>(null);
  public currentPlayer$: Observable<Player | null> = this.currentPlayerSubject.asObservable();

  private controllerTypeSubject = new BehaviorSubject<ControllerType>(ControllerType.LOBBY);
  public controllerType$: Observable<ControllerType> = this.controllerTypeSubject.asObservable();

  constructor(private webSocketService: WebsocketService) {
    this.initializeMessageHandling();
  }

  private initializeMessageHandling(): void {
    // Subscribe to WebSocket messages and route them
    this.webSocketService.getMessage().subscribe({
      next: (message) => this.handleMessage(message),
      error: (error) => console.error('WebSocket error in orchestrator:', error)
    });
  }

  private handleMessage(message: any): void {
    console.log('Orchestrator received message:', message);

    switch (message.type) {
      case 'player_list_update':
        this.handlePlayerListUpdate(message.data);
        break;
      case 'state_change':
        this.handleStateChange(message.data);
        break;
      case 'player_joined':
        this.handlePlayerJoined(message.data);
        break;
      case 'error':
        this.handleError(message.data);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }
  private handlePlayerListUpdate(data: any): void {
    const players: Player[] = [];

    if (data.players && Array.isArray(data.players)) {
      for (const playerData of data.players) {
        // Create Player instances with all the new data
        const player = new Player(
          playerData.name,
          playerData.player_number,
          playerData.is_leader || false,
          playerData.player_score || 0,
          playerData.player_lives || 0
        );
        players.push(player);
      }
    }

    const playerCount = data.player_count || 0;

    // Update the observables
    this.playersSubject.next(players);
    this.playerCountSubject.next(playerCount);

    // Get current user data on list update
    const currentPlayerName = this.currentPlayerSubject.value?.player_name;
    if (currentPlayerName) {
      const myUpdatedData = players.find(p => p.player_name === currentPlayerName);
      if (myUpdatedData) {
        this.currentPlayerSubject.next(myUpdatedData);
      } else {
        console.warn('Current player not found in updated player list:', currentPlayerName);
      }
    }

    console.log('Player list updated:', players);
  }

  private handleStateChange(data: any): void {
    const newState = data.state;
    this.gameStateSubject.next(newState);
    console.log('Game state changed to:', newState);
  }

  private handlePlayerJoined(data: any): void {
    // Handle individual player join confirmation
    console.log('Player joined confirmation:', data);
  }

  private handleError(data: any): void {
    console.error('Server error:', data.message);
    // You could emit to an error subject here
  }

  sendJoystickMove(direction: number, distance: number): void {
    console.log(`direction: ${direction}, distance: ${distance}`);

    let currentPlayer = this.getCurrentPlayer();

    const message = {
      type: 'player_controls',
      data: {
      input_type: 'joystick_move',
      player_name: currentPlayer?.player_name,
      direction: direction,
      distance: distance
    }};

    this.webSocketService.sendMessage(JSON.stringify(message));
  }

  sendJoystickRelease(): void {
    console.log(`Joystick Released: True`);

    let currentPlayer = this.getCurrentPlayer();
    const message = {
      type: 'player_controls',
      data: {
      input_type: 'joystick_release',
      player_name: currentPlayer?.player_name,
      released: "True"
    }};

    this.webSocketService.sendMessage(JSON.stringify(message));
  }

  sendButtonPress(button: string): void {
    console.log(`Button ${button} is pressed`)

    let currentPlayer = this.getCurrentPlayer();

    const message = {
      type: 'player_controls',
      data: {
        input_type: 'button_press',
        player_name: currentPlayer?.player_name,
        button: button
      }
    };

    this.webSocketService.sendMessage(JSON.stringify(message));
  }

  // Getters for current values (synchronous access)
  getCurrentPlayers(): Player[] {
    return this.playersSubject.value;
  }

  getCurrentGameState(): string {
    return this.gameStateSubject.value;
  }

  getCurrentPlayerCount(): number {
    return this.playerCountSubject.value;
  }

  getCurrentPlayer(): Player | null {
    return this.currentPlayerSubject.value;
  }

  // Method to set current player (called after successful join)
  setCurrentPlayer(player: Player): void {
    this.currentPlayerSubject.next(player);
  }

  joinGame(playerName: string): void {

    const message = {
      type: 'player_join',
      data: {
        name: playerName
      }
    };

    const tempPlayer = new Player(playerName);
    this.currentPlayerSubject.next(tempPlayer);

    this.webSocketService.sendMessage(JSON.stringify(message));
  }

  changeLeader(player: Player) {

    const message = {
      type: "change_leader",
      data: {
        name: player.player_name
      }
    };

    this.webSocketService.sendMessage(JSON.stringify(message))
  }

  getLeaderName(): string {
    const players = this.playersSubject.value;
    const leader = players.find(player => player.is_leader);
    return leader ? `👑 ${leader.player_name}` : 'No Leader';
  }
}
