import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApagarComponent } from './apagar.component';

describe('ApagarComponent', () => {
  let component: ApagarComponent;
  let fixture: ComponentFixture<ApagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApagarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
