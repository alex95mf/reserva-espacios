import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisReservasComponent } from './mis-reservas.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('MisReservasComponent', () => {
  let component: MisReservasComponent;
  let fixture: ComponentFixture<MisReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisReservasComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});