import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

 
  const authServiceMock = {
    login: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    vi.clearAllMocks();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  it('Form sollte initial invalid sein', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('sollte showPassword toggeln', () => {
    expect(component.showPassword()).toBe(false);

    component.togglePassword();
    expect(component.showPassword()).toBe(true);

    component.togglePassword();
    expect(component.showPassword()).toBe(false);
  });

  it('sollte Form als touched markieren wenn invalid bei Submit', () => {
    const markSpy = vi.spyOn(component.loginForm, 'markAllAsTouched');

    component.onSubmit();

    expect(markSpy).toHaveBeenCalled();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('sollte bei erfolgreichem Login navigieren', () => {
    authServiceMock.login.mockReturnValue(true);

    component.loginForm.setValue({
      username: 'test',
      password: '123456',
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test', '123456');
    expect(component.loginError()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/main/dashboard']);
  });

  it('sollte loginError setzen wenn Login fehlschlägt', () => {
    authServiceMock.login.mockReturnValue(false);

    component.loginForm.setValue({
      username: 'test',
      password: '123456',
    });

    component.onSubmit();

    expect(component.loginError()).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('Password sollte minLength 6 validieren', () => {
    component.loginForm.setValue({
      username: 'test',
      password: '123',
    });

    expect(component.passwordControl.invalid).toBe(true);
  });
});
