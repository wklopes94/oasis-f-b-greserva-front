import { TestBed } from '@angular/core/testing';

import { MenuCrudService } from './menu-crud.service';

describe('MenuCrudService', () => {
  let service: MenuCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
