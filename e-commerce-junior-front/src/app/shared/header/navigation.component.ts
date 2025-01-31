import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShopingCar } from 'src/app/models/product.model';
import { User } from 'src/app/models/User';
import { ShopingCarService } from 'src/app/services/shoping-car-service.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule],
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  public user!: User;
  public showSearch = false;
  public shoppingCarItems: ShopingCar[] = [];

  constructor(private storageService: StorageService, private router: Router, private shoppingCarService: ShopingCarService) {
    this.user = this.storageService.getUser();

    if (!this.user) {
      this.logout();
    }
  }

  ngOnInit(): void {
    this.shoppingCarService.shoppingCar$.subscribe({
      next: (shoppingCar) => {
        this.shoppingCarItems = shoppingCar;
      }
    });

    if(this.shoppingCarItems.length === 0) {
      this.consultShoppingCar();
    }
  }


  consultShoppingCar() {
    this.shoppingCarService.getProductShoppingCar();
  }

  logout() {
    this.storageService.logout();
    this.router.navigate(['/login']);
  }

  // This is for Notifications
  notifications: Object[] = [
    {
      btn: 'btn-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      btn: 'btn-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      btn: 'btn-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-warning',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/user1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/user4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  }

  public languages: any[] = [{
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  },
  {
    language: 'Español',
    code: 'es',
    icon: 'es'
  },
  {
    language: 'Français',
    code: 'fr',
    icon: 'fr'
  },
  {
    language: 'German',
    code: 'de',
    icon: 'de'
  }]

  ngAfterViewInit() { }
}
