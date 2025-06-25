import { ElementRef, Injectable } from '@angular/core';
import nipplejs from 'nipplejs';
import { OrchestratorService } from './orchestrator.service';

@Injectable({
  providedIn: 'root'
})
export class JoystickService {
  private joystickManager: any;
  private throttle = 50; // default throttle
  private lastSent = Date.now();

  constructor(private orchestrator: OrchestratorService) {}

  initializeJoystick(container: ElementRef, options?: { throttle?: number, size?: number, color?: string }) {
    if (!container) return;

    // Allow override of default options
    this.throttle = options?.throttle ?? 50;
    const size = options?.size ?? 120;
    const color = options?.color ?? 'cyan';

    this.joystickManager = nipplejs.create({
      zone: container.nativeElement,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color,
      size
    });

    this.lastSent = Date.now();

    this.joystickManager.on('move', (_evt: any, data: any) => {
      const now = Date.now();
      if (now - this.lastSent > this.throttle) {
        this.orchestrator.sendJoystickMove(
          data.angle?.degree || 0,
          data.distance || 0
        );
        this.lastSent = now;
      }
    });

    this.joystickManager.on('end', () => {
      console.log('Joystick released');
      this.orchestrator.sendJoystickRelease();
    });
  }

  destroyJoystick() {
    if (this.joystickManager) {
      this.joystickManager.destroy();
      this.joystickManager = null;
    }
  }
}