import { TestBed } from '@angular/core/testing';
import { EspacioService } from './espacio.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EspacioService', () => {
  let service: EspacioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EspacioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});