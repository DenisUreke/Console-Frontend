import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { ControllerLobbyComponent } from './Components/controller-lobby/controller-lobby.component';
import { ControllerParentComponent } from './Components/controller-parent/controller-parent.component';
import { IsLoggedService } from './Services/is-logged.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LandingPageComponent, ControllerParentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Lobby';
  showController = false; 

  private isLoggedSubscription: Subscription | undefined;

  constructor(private isLoggedService: IsLoggedService) { }

  ngOnInit(): void {
    this.isLoggedSubscription = this.isLoggedService.showController$.subscribe(
      (showController: boolean) => {
        console.log('Show controller:', showController);
        this.showController = showController;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.isLoggedSubscription) {
      this.isLoggedSubscription.unsubscribe();
    }
  }
}