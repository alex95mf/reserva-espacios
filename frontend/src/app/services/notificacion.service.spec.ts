import { TestBed } from '@angular/core/testing';
import { NotificacionService } from './notificacion.service';
import { MessageService } from 'primeng/api';

describe('NotificacionService', () => {
  let service: NotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificacionService,
        MessageService
      ]
    });
    service = TestBed.inject(NotificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});