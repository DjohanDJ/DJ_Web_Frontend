import { Component, OnInit, Input } from '@angular/core';
import { UserSessionService } from '../services-only/user-session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public userSession: UserSessionService) {}
  ngOnInit(): void {}

  @Input() display: boolean;

  @Input() navBarClassToggle: string = 'navbar';

  subscriptionModalState: boolean = false;

  changeModalState() {
    this.subscriptionModalState = false;
  }

  checkUserAlreadySignIn() {
    if (this.userSession.getCurrentUser() != null) {
      this.subscriptionModalState = false;
    } else {
      this.subscriptionModalState = true;
    }
  }
}
