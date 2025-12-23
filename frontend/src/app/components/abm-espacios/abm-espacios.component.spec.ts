import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbmEspaciosComponent } from './abm-espacios.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('AbmEspaciosComponent', () => {
  let component: AbmEspaciosComponent;
  let fixture: ComponentFixture<AbmEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmEspaciosComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});