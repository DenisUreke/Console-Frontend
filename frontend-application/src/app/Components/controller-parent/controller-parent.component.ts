import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ControllerLobbyComponent } from '../controller-lobby/controller-lobby.component';
import { ControllerMenuComponent } from '../controller-menu/controller-menu.component';
import { OrchestratorService } from '../../Services/orchestrator.service';
import { ControllerType } from '../../Enums/Controller_type';

@Component({
  selector: 'app-controller-parent',
  standalone: true,
  imports: [CommonModule, ControllerLobbyComponent, ControllerMenuComponent],
  templateUrl: './controller-parent.component.html',
  styleUrl: './controller-parent.component.css'
})
export class ControllerParentComponent implements OnDestroy, OnInit {

  controllerType: ControllerType = ControllerType.JOYSTICK;
  ControllerType = ControllerType;

  private controllerTypeSubscription: Subscription | undefined;

  constructor(private orchestrator: OrchestratorService) { }

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