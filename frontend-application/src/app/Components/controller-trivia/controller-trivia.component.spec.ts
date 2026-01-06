import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerTriviaComponent } from './controller-trivia.component';

describe('ControllerTriviaComponent', () => {
  let component: ControllerTriviaComponent;
  let fixture: ComponentFixture<ControllerTriviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerTriviaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerTriviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
