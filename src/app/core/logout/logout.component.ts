import { Component } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor (private auth: AuthenticationService, private router: Router) {}

  ConfirmLogout() {
    this.auth.Logout();
    this.router.navigate(['home']);
  }
}
