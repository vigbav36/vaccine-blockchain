import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterViolationComponent } from './register-violation.component';

describe('RegisterViolationComponent', () => {
  let component: RegisterViolationComponent;
  let fixture: ComponentFixture<RegisterViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterViolationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
