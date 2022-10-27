import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNaoEncontradoComponent } from './pagina-nao-encontrado.component';

describe('PaginaNaoEncontradoComponent', () => {
  let component: PaginaNaoEncontradoComponent;
  let fixture: ComponentFixture<PaginaNaoEncontradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaNaoEncontradoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNaoEncontradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
