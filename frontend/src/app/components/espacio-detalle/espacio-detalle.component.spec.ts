import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspacioDetalleComponent } from './espacio-detalle.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

describe('EspacioDetalleComponent', () => {
  let component: EspacioDetalleComponent;
  let fixture: ComponentFixture<EspacioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacioDetalleComponent],
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

    fixture = TestBed.createComponent(EspacioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});