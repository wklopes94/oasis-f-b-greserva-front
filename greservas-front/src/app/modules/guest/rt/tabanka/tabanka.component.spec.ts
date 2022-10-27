import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabankaComponent } from './tabanka.component';

describe('TabankaComponent', () => {
  let component: TabankaComponent;
  let fixture: ComponentFixture<TabankaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabankaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabankaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
