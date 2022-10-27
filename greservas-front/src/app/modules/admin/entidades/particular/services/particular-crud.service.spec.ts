import { TestBed } from '@angular/core/testing';

import { ParticularCrudService } from './particular-crud.service';

describe('ParticularCrudService', () => {
  let service: ParticularCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticularCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
