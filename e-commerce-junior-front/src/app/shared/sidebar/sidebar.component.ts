import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgIf } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
//declare var $: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgIf],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[] = [];


  constructor(
    private storageService: StorageService
  ) { }

  // End open close
  ngOnInit() {
    const userRole = this.storageService.getUser(); // "urserRole" -> "userRole"
    if (userRole) {
      this.sidebarnavItems = ROUTES.filter(item =>
        item.roles.includes(userRole.rolename.toLowerCase()) // Case insensitive
      );
    }
  }

  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
}
