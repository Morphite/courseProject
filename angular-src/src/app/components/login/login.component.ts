import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  showReset: boolean = false;
  place: string; 
  loginForm: FormGroup;
  resetForm: FormGroup;
  

  constructor(private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private location: Location,
    private fb: FormBuilder) {
    this.loginForm = fb.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])]
    })

    this.resetForm = fb.group({
      resetEmail: ['', Validators.compose([Validators.required, Validators.email])],
    })
  }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      login: this.loginForm.get('login').value,
      password: this.loginForm.get('password').value,
      location: this.loginForm.get('location').value
    }
    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('Вход успешен', {
          cssClass: 'alert-success', 
          timeout: 3000
        });
        this.router.navigate(['dashboard']);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 3000
        });
        this.router.navigate(['login']);
      }
    });
  }

  //TODO: Salasanan resetointi
  onResetSubmit() {

    const user = {
      email: this.resetForm.get('resetEmail').value
    }

    this.authService.resetPassword(user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Ваш новый пароль был отправлен на электронную почту. Смените пароль после входа в систему.',
        {
          cssClass: 'alert-success',
          timeout: 7000
        });
        this.showReset = false;
      }
      else {
        this.flashMessage.show('При сбросе пароля произошла ошибка. Попробуйте еще раз через несколько минут.',
        {
          cssClass: 'alert-danger',
          timeout: 7000
        });
      }
    })
  }
}
