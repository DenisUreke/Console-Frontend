import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerParentComponent } from './controller-parent.component';

describe('ControllerParentComponent', () => {
  let component: ControllerParentComponent;
  let fixture: ComponentFixture<ControllerParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerParentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
