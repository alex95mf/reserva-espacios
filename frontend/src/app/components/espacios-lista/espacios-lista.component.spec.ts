import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspaciosListaComponent } from './espacios-lista.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('EspaciosListaComponent', () => {
  let component: EspaciosListaComponent;
  let fixture: ComponentFixture<EspaciosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaciosListaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaciosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});