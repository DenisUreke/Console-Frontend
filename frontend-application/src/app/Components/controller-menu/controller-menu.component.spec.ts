import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerMenuComponent } from './controller-menu.component';

describe('ControllerMenuComponent', () => {
  let component: ControllerMenuComponent;
  let fixture: ComponentFixture<ControllerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
