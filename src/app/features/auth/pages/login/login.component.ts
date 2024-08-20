import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { errorAction, getControl, getErrorMessage } from 'src/app/shared/functions';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})

export class LoginComponent implements OnInit, OnDestroy{

  // Variables
  loading: boolean = false;
  isPassword:boolean = true;
  typeInput:string = 'password';
  destroy$: Subject<boolean> = new Subject<boolean>();

  // Definición del formulario de inicio de sesión
  signInForm = this.fb.group({
    user: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9\s.\-'"_@]*$/),
        Validators.minLength(3)
      ]
    ],
    pass: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ]
  });

  constructor (
    private router:Router,
    private fb:FormBuilder,
    private cookieService:SsrCookieService,
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Verifica si existe un token CSRF en las cookies y redirige al inicio si es válido.
   * También suscribe al cambio de estado del formulario de inicio de sesión para habilitar o deshabilitar el botón de inicio de sesión según su validez.
   */
  ngOnInit(): void {
    let csrfToken = this.cookieService.get('csrf_token');
    if (csrfToken && csrfToken.length > 0) {
      this.router.navigateByUrl('/');
    }
  }

  //Controls
  user: FormControl = getControl(this.signInForm, 'user');
  pass: FormControl = getControl(this.signInForm, 'pass');

  //Validators
  getErrorMessage(formControlName: FormControl, min: string): string {
    return getErrorMessage(formControlName, min);
  }

  /**
   * Método que se ejecuta al enviar el formulario de inicio de sesión.
   * Realiza la petición de inicio de sesión y guarda el token en las cookies.
   * Redirige al inicio si la petición es exitosa.
   */
  singIn() {
    this.loading = true;
    if (this.signInForm.valid) {
      // this.authService
      //   .singIn(this.signInForm.value as SingInRequest)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe({
      //     next: (data) => {
      //       this.setPersistenceInfo(data);
      //     },
      //     error: () => {
      //       this.loading = false;
      //       errorAction('Error', 'Lo sentimos, el usuario o contraseña es incorrecto, inténtalo nuevamente.')
      //     },
      //     complete: () => {
      //       this.setLocalStorageInfo();
      //     }
      //   });
    }
    else {
      this.signInForm.markAllAsTouched();
      this.loading = false;
    }
  }

  setPersistenceInfo(data:any){
    // const authToken = this.authService.getAuthorizationToken(this.user.value, this.pass.value);
    this.cookieService.set('csrf_token', data?.csrf_token, {path: '/'});
    // this.localStorageService.setItem('authToken', authToken);
    // this.localStorageService.setItem('current_user_roles', JSON.stringify(data?.current_user.roles));
  }

  /**
   * Método que se ejecuta al hacer clic en el botón de mostrar/ocultar contraseña.
   * Cambia el tipo de input de contraseña a texto y viceversa.
   */
  showPass() {
    this.isPassword = !this.isPassword;
    this.typeInput = this.isPassword ? 'password' : 'text';
  }

  // Método que settea información del usuario en el local storage
  setLocalStorageInfo(){
    // this.usersService.getUserData().pipe(takeUntil(this.destroy$)).subscribe({
    //   next: data => {
    //     if(data){
    //       this.localStorageService.setItem('user_id',JSON.stringify(data))
    //       this.getUserCompany(data);
    //     }
    //   },
    //   error: () => {
    //     errorAction('Error', 'No se pudo obtener la información del usuario. Por favor contacte a soporte.')
    //     this.loading = false;
    //     this.router.navigateByUrl('/');
    //   },
    // })
  }

  // Métodos que settean información de la empresa en el local storage
  getUserCompany(data:any){
    // this.usersService.getUserCompany(data).pipe(takeUntil(this.destroy$)).subscribe({
    //   next: company => {
    //     this.localStorageService.setItem('company', JSON.stringify(company))
    //   },
    //   complete: () => {
    //     this.router.navigateByUrl('/');
    //     this.loading = false;
    //   }
    // })
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Desuscribe el observable de cambio de estado del formulario de inicio de sesión.
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}



