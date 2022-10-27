import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaralterarComponent } from './criaralterar.component';

describe('CriaralterarComponent', () => {
  let component: CriaralterarComponent;
  let fixture: ComponentFixture<CriaralterarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriaralterarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriaralterarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
