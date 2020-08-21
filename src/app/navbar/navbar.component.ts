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

  closeState: boolean = true;
  expandChannel() {
    for (let i = 0; i < this.userSession.nextSubs.length; i++) {
      this.userSession.currentSubs.push(this.userSession.nextSubs[i]);
    }
    this.closeState = false;
  }

  backNormal() {
    var allCurrentSubs = this.userSession.currentSubs;
    this.userSession.currentSubs = [];
    for (let i = 0; i < 10; i++) {
      this.userSession.currentSubs.push(allCurrentSubs[i]);
    }
    this.closeState = true;
  }
}
