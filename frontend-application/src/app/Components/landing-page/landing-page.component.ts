import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Player } from '../../Models/Player';
import { IsLoggedService } from '../../Services/is-logged.service';
import { OrchestratorService } from '../../Services/orchestrator.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, OnDestroy {

  player: Player = new Player('');
  
  private isLoggedSubscription: Subscription | undefined;

  constructor(
    private orchestratorService: OrchestratorService,
    private isLoggedService: IsLoggedService
  ) { }

  ngOnInit() {
    this.isLoggedSubscription = this.isLoggedService.showController$.subscribe(
      (showController: boolean) => {
        console.log('Show controller:', showController);
      }
    );
  }

  register() {
    if (!this.player.player_name.trim()) {
      console.warn('Player name is required');
      return;
    }

    // Register the player
    this.orchestratorService.joinGame(this.player.player_name);
    
    // Switch to controller view
    this.isLoggedService.setShowController(true);
  }

  ngOnDestroy(): void {
    if (this.isLoggedSubscription) {
      this.isLoggedSubscription.unsubscribe();
    }
  }
}
