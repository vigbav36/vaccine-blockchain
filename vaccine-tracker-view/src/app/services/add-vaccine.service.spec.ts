import { TestBed } from '@angular/core/testing';

import { AddVaccineService } from './add-vaccine.service';

describe('AddVaccineService', () => {
  let service: AddVaccineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddVaccineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
