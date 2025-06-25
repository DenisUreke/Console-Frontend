import { TestBed } from '@angular/core/testing';

import { JoystickService } from './joystick.service';

describe('JoystickService', () => {
  let service: JoystickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoystickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
