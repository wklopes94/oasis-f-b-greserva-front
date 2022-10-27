import { TestBed } from '@angular/core/testing';

import { PagamentoCrudService } from './pagamento-crud.service';

describe('PagamentoCrudService', () => {
  let service: PagamentoCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagamentoCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
