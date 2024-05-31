import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

  public userRole: string='user';

  setUserRole(role: string) {
    this.userRole = role;
    console.log(this.userRole)
    return this.userRole;
    
  }

  getUserRole(): string {
    console.log("Sono nel get" + this.userRole)
    return this.userRole;
  }

  isAdmin(): boolean {
    if(this.userRole == 'admin') {
      return true;
    } else {
      return false;
    }
  }
}  
