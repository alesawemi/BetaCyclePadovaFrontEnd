import { Component, NgModule } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Registration } from '../../shared/models/registrationdata';
import { NewUserHttp } from '../../shared/services/newUserHttp.service';
import { HttpStatusCode } from '@angular/common/http';
import { Credentials } from '../../shared/models/credentials';
import { LoginHttpService } from '../../shared/services/loginHttp.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { LogtraceService } from '../../shared/services/logtrace.service';
import { LogTrace } from '../../shared/models/LogTraceData';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleService } from '../../shared/services/role.service';
import { AdminPanelComponent } from '../../features/admin-panel/admin-panel.component';


@Component({
  selector: 'app-login-registration',
  standalone: true,
  imports: [FormsModule, CommonModule,AdminPanelComponent],
  templateUrl: './login-registration.component.html',
  styleUrl: './login-registration.component.css'
})



export class LoginRegistrationComponent {
  
  constructor(
    private router: Router,

    // for centralized error management
    private logtrace: LogtraceService,

    // for registration:
    private UserHttp: NewUserHttp, 

    // for login:
    private http: LoginHttpService, private auth: AuthenticationService,
    private roleService:RoleService
  ) {}



  // fEnd LogTrace
  fEndError: LogTrace = new LogTrace;









  //#region REGISTRATION 
  
  [x: string]: any;
  confirmPassword: string ='';  
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{8,}$/; //I got some help from ChatGPT here

  newRegistration: Registration = new Registration(); //the new registered user has only the password in plain text

  Registrated: Registration[] = []

  pass: string = '';

  passwordsMatch: boolean = false;

  checkPasswordMatch() {
      this.passwordsMatch = this.pass === this.confirmPassword;
  }



  Registration(frm: NgForm) {  
    if (frm.valid) {

      

      // Check if the password meets the required criteria
      if (!this.isPasswordValid(frm.value.passwordInput)) {
        alert('The password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one special character.');
        return;
      }

      // Check if the password confirmation matches the password
      if (frm.value.passwordInput !== frm.value.confirmPasswordInput) {
        alert('The password and confirmation password do not match.');
        return;
      }

      // Send the form data to the server 

      // Copy only the necessary fields from the form to the newRegistration instance
      this.newRegistration.firstName = frm.value.nameInput;
      this.newRegistration.lastName = frm.value.surnameInput;
      this.newRegistration.emailAddress = frm.value.emailInput;
      this.newRegistration.phone = frm.value.phoneInput;
      this.pass = frm.value.passwordInput;

      this.newRegistration.password = window.btoa(this.pass); 

      // now that I have encrypted it, I can send the new user to the backend
      this.PostRegistration();

    } else {
      // Show an appropriate alert or error message
      alert('Please fill out all required fields correctly.');
    }
  }

  // Function to check if the password meets the required criteria
  isPasswordValid(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, and one special character
    
    return this.passwordRegex.test(password);
  }

  // Ok - now I have my user with the plain text password and I need to encrypt it - not sure whether to do it on the backend
  PostRegistration(){
    this.UserHttp.PostNewRegistration(this.newRegistration).subscribe({
     next: (response: any) => {
      switch(response.status) {
        case HttpStatusCode.Ok:
          alert("Welcome! Please log in to your account in the Login section.");
          this.router.navigate(['login&registration']); // Redirect to the login page
          break;
        default: break;
      }
    },
    error: (err: any) => {
      this.fEndError = new LogTrace;
      this.fEndError.Level = 'error';
      this.fEndError.Message = 'An Error Occurred in PostRegistration';
      this.fEndError.Logger = 'login-registration';
      this.fEndError.Exception = err.message;
      this.logtrace.PostError(this.fEndError).subscribe({
        next: (Data: any) => {
          console.log('post frontend error to db:'); console.log(Data);
        },
        error: (err: any) => {
          console.log('post frontend error to db:'); console.log(err);
        }
      })
      if (err.status === 409) { // Conflict (User already in the DB)
        alert("User already exists in the database.");
      } else {
        // Handle other error cases
        console.error('An error occurred:', err);
        alert('An error occurred. Please try again!')
      }
    }
   })
  }

//#endregion









  //#region LOGIN 
  loginCredentials: Credentials = new Credentials();
  private jwtHelper: JwtHelperService = new JwtHelperService();
  isLoading: boolean = false; // Loading state variable

  jwtToken: string = '';
  Login(usr: HTMLInputElement, pwd: HTMLInputElement) {

     // Add the spinner class to the document body
    this.isLoading = true;
    

    if (usr.value != '' && pwd.value != '') // check repeated on the backend
    {
      this.loginCredentials.username = usr.value;
      this.loginCredentials.password = pwd.value;

      // enter credentials and then click login --> reset email and password fields?
      this.http.LoginPost(this.loginCredentials).subscribe({
        next: (response: any) => {
          switch (response.status) {
            case HttpStatusCode.Ok:
              // if (this.auth.TypeOfAuthorization ===  'basic') 
              //   { this.auth.setLoginStatusBasic(true, usr.value, pwd.value); }
              if (this.auth.TypeOfAuthorization === 'jwt') {                             
                this.jwtToken = response.body.token;
                this.auth.setLoginStatusJwt(true, this.jwtToken);
                const decodedToken = this.jwtHelper.decodeToken(this.jwtToken);
                const role = decodedToken.role;
                this.setRole(role);               
              }
              console.log("LOGIN OK!"); //in this case there is no need for "loginOk" notification because menu items previously hidden (logout, cart, etc.) will be activated              
              this.isLoading = false;
              this.router.navigate(['home']); // Redirect to home
              break;
            case HttpStatusCode.NoContent:
              this.isLoading = false;
              break;
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.fEndError = new LogTrace;
          this.fEndError.Level = 'error';
          this.fEndError.Message = 'An Error Occurred in Login';
          this.fEndError.Logger = 'login-registration';
          this.fEndError.Exception = err.message;
          this.logtrace.PostError(this.fEndError)
            .subscribe({
              next: (Data: any) => {
                console.log('post frontend error to db:'); console.log(Data);
              },
              error: (err: any) => {
                console.log('post frontend error to db:'); console.log(err);
              }
            })

          // if (this.auth.TypeOfAuthorization ===  'basic') 
          //   { this.auth.setLoginStatusBasic(false); }
          if (this.auth.TypeOfAuthorization === 'jwt') { this.auth.setLoginStatusJwt(false); }


          // find alternative solution to alert --> popup with dialog window?
          if (err.status === 404) {
            alert("REGISTER!");  // redirect to the login/registration page
            const container = document.getElementById('container');
            if (container) {
              container.classList.add("right-panel-active");
            } else {
              console.error("Container element is null.");
            }
          }
          if (err.status === 400) alert(err.error.message);
        }
      });
    }
    else alert('Attention! Username and Password are mandatory.');
  }


// Set the role
  setRole(role: string) {
   console.log(this.roleService.setUserRole(role))
  }

  isPageLoading() {
    return this.isLoading;
  }
//#endregion




  // CODE FOR ANIMATION ///////////////////////////////////////////////////////////////////////////////////
  // Execute JavaScript code after the components have been initialized 
  ngOnInit(): void {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
  
    // Null check before using the elements
    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });
  
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    } else {
      console.error("One or more elements are null.");
    }
  }
  
}
