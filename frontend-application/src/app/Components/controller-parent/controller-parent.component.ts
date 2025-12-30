import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, Observable } from 'rxjs';
import { ControllerLobbyComponent } from '../controller-lobby/controller-lobby.component';
import { ControllerMenuComponent } from '../controller-menu/controller-menu.component';
import { OrchestratorService } from '../../Services/orchestrator.service';
import { ControllerType } from '../../Enums/Controller_type';
import { Player } from '../../Models/Player';
 
@Component({
  selector: 'app-controller-parent',
  standalone: true,
  imports: [CommonModule, ControllerLobbyComponent, ControllerMenuComponent],
  templateUrl: './controller-parent.component.html',
  styleUrl: './controller-parent.component.css'
})
export class ControllerParentComponent implements OnDestroy, OnInit {

  currentPlayer$: Observable<Player | null>;
  controllerType: ControllerType = ControllerType.JOYSTICK;
  ControllerType = ControllerType;

  private controllerTypeSubscription: Subscription | undefined;

  constructor(private orchestrator: OrchestratorService) {
    this.currentPlayer$ = this.orchestrator.currentPlayer$;
   }

  ngOnInit(): void {
    this.controllerTypeSubscription = this.orchestrator.controllerType$.subscribe(
      (type) => {
        this.controllerType = type;
        console.log('Controller - Controller type:', type);
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up all orchestrator subscriptions
    if (this.controllerTypeSubscription) {
      this.controllerTypeSubscription.unsubscribe();
    }
  }
}