import { Component } from '@angular/core';
import { RoleService } from '../../shared/services/role.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

  userRole: string ='';

  constructor(private roleService: RoleService) {}


}
