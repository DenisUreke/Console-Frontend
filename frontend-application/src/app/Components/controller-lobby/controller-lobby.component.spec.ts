import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerLobbyComponent } from './controller-lobby.component';

describe('ControllerLobbyComponent', () => {
  let component: ControllerLobbyComponent;
  let fixture: ComponentFixture<ControllerLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerLobbyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
