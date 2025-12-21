import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaciosLista } from './espacios-lista';

describe('EspaciosLista', () => {
  let component: EspaciosLista;
  let fixture: ComponentFixture<EspaciosLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaciosLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaciosLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
