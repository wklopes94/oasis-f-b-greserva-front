import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaHasExtraComponent } from './reserva-has-extra.component';

describe('ReservaHasExtraComponent', () => {
  let component: ReservaHasExtraComponent;
  let fixture: ComponentFixture<ReservaHasExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaHasExtraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaHasExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
