import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioEspaciosComponent } from './calendario-espacios.component';

describe('CalendarioEspaciosComponent', () => {
  let component: CalendarioEspaciosComponent;
  let fixture: ComponentFixture<CalendarioEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioEspaciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
