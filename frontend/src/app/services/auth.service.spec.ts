import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when token exists', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.estaAutenticado()).toBe(true);
    localStorage.removeItem('token');
  });

  it('should return false when token does not exist', () => {
    localStorage.removeItem('token');
    expect(service.estaAutenticado()).toBe(false);
  });
});