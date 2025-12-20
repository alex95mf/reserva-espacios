import { TestBed } from '@angular/core/testing';

import { Espacio } from './espacio';

describe('Espacio', () => {
  let service: Espacio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Espacio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
