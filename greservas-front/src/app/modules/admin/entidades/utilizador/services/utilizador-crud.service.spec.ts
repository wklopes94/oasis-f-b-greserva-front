import { TestBed } from '@angular/core/testing';

import { UtilizadorCrudService } from './utilizador-crud.service';

describe('UtilizadorCrudService', () => {
  let service: UtilizadorCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilizadorCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
