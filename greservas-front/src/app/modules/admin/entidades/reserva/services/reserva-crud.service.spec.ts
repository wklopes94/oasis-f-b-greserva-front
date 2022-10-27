import { TestBed } from '@angular/core/testing';

import { ReservaCrudService } from './reserva-crud.service';

describe('ReservaCrudService', () => {
  let service: ReservaCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
