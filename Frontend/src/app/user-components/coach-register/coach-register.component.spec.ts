import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachRegisterComponent } from './coach-register.component';

describe('CoachRegisterComponent', () => {
  let component: CoachRegisterComponent;
  let fixture: ComponentFixture<CoachRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
