import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineDetailsComponent } from './vaccine-details.component';

describe('VaccineDetailsComponent', () => {
  let component: VaccineDetailsComponent;
  let fixture: ComponentFixture<VaccineDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaccineDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VaccineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
