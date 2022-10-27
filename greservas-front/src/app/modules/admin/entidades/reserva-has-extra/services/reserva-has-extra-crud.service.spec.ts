import { TestBed } from '@angular/core/testing';

import { ReservaHasExtraCrudService } from './reserva-has-extra-crud.service';

describe('ReservaHasExtraCrudService', () => {
  let service: ReservaHasExtraCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaHasExtraCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
