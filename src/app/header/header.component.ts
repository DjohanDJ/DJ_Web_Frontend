import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: SocialAuthService) {}

  @Input() display: boolean;

  @Output()
  onDisplayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  toggleShow: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  navBarClass: EventEmitter<string> = new EventEmitter<string>();

  toggleDisplay() {
    this.toggleShow.emit();
    this.navBarClass.emit();
    // this.display = !this.display;
    // this.onDisplayChange.emit(this.display);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
    this.dropdownDisplay = false;
  }

  // Save the user
  user: SocialUser;
  loggedIn: boolean;

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    });
  }

  dropdownDisplay = false;

  changeDropdownState() {
    this.dropdownDisplay = !this.dropdownDisplay;
  }

  signInBoxDisplay = false;

  changeSignInBoxState() {
    this.signInBoxDisplay = !this.signInBoxDisplay;
    this.dropdownDisplay = false;
  }

  switchAccount() {
    this.signInBoxDisplay = false;
    this.dropdownDisplay = false;
    this.signOut();
    this.signInWithGoogle();
  }

  settingsDropdownState = false;
  changeSettingsDropdownState() {
    this.settingsDropdownState = !this.settingsDropdownState;
  }
}
