import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AuthService } from 'src/app/service/AuthService/auth.service';

import { LoginComponent } from './login.component';

class MockAuthService {
  login(username: string, password: string): boolean {
    return username === 'test' && password === 'Password123';
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports:[FormsModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message for invalid login', () => {
    component.username = 'invalid';
    component.password = 'invalid';
    component.login();
    expect(component.errorMessage).toBe('Invalid username or password');
  });


  it('should call authService.login when login is called', () => {
    const loginSpy = spyOn(authService, 'login').and.callThrough();
    component.username = 'test';
    component.password = 'password';
    component.login();
    expect(loginSpy).toHaveBeenCalledWith('test', 'password');
  });

  it('should display error message in template when login fails', () => {
    component.username = 'invalid';
    component.password = 'invalid';
    component.login();
    fixture.detectChanges();
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message')).nativeElement;
    expect(errorMessageElement.textContent).toContain('Invalid username or password');
  });
  
});


