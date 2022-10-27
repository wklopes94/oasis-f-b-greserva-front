import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestauranteSeatingComponent } from './restaurante-seating.component';

describe('RestauranteSeatingComponent', () => {
  let component: RestauranteSeatingComponent;
  let fixture: ComponentFixture<RestauranteSeatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestauranteSeatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestauranteSeatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
