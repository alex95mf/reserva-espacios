import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioEspaciosComponent } from './calendario-espacios.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('CalendarioEspaciosComponent', () => {
  let component: CalendarioEspaciosComponent;
  let fixture: ComponentFixture<CalendarioEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioEspaciosComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
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