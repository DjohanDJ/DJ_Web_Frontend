import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UserSessionService } from '../services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export const searchUserByEmail = gql`
  query searchUser($searchEmail: String!) {
    searchUserByEmail(searchEmail: $searchEmail) {
      id
      username
      email
      user_password
      channel_name
    }
  }
`;

export const createUser = gql`
  mutation createUser($newUser: NewUser!) {
    createUser(input: $newUser) {
      id
      username
      email
      user_password
      channel_name
    }
  }
`;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: SocialAuthService,
    private userSession: UserSessionService,
    private apollo: Apollo
  ) {}

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
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.loginBoxDisplay = false;
    this.searchForUserState = true;
  }

  signInWithGoogleForSwitch(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.loginBoxDisplay = false;
  }

  signOut(): void {
    this.searchForUserState = false;
    this.userSession.setCurrentUser(null);
    this.userSession.setCurrentUserDB(null);
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
      this.userSession.setCurrentUser(this.user);
      if (this.searchForUserState) {
        this.searchForUser();
      }
      if (this.currentUserinDB == null) {
        // Ga ada di DB, jadi create at db disini
        // console.log('A');
        // this.createNewUser();
        // console.log('B');
      }
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
    this.signInWithGoogleForSwitch();
  }

  settingsDropdownState = false;
  changeSettingsDropdownState() {
    this.settingsDropdownState = !this.settingsDropdownState;
  }

  booleanSearch: boolean = false;
  searchQuery: string = '';
  onTypeSearchBox(value: string) {
    this.searchQuery = value;
    if (this.searchQuery != '') {
      this.booleanSearch = true;
    } else {
      this.booleanSearch = false;
    }
  }

  loginBoxDisplay: boolean = false;
  changeStateLoginBox() {
    this.loginBoxDisplay = !this.loginBoxDisplay;
  }

  searchForUserState: boolean = false;
  searchForUser() {
    // cek ke db usenya ada/engga
    this.searchEmail = this.user.email;
    this.apollo
      .watchQuery<any>({
        query: searchUserByEmail,
        variables: {
          searchEmail: this.searchEmail,
        },
      })
      .valueChanges.subscribe((result) => {
        this.currentUserinDB = result.data.searchUserByEmail[0];
        this.userSession.setCurrentUserDB(this.currentUserinDB);
      });
  }

  currentUserinDB: any;
  searchEmail: string;

  // new user

  newUser: {
    username: 'asd';
    email: 'asd';
    user_password: 'asd';
    channel_name: 'asd';
  };

  createNewUser() {
    // console.log('C');
    this.apollo
      .watchQuery<any>({
        query: createUser,
        variables: {
          newUser: this.newUser,
        },
      })
      .valueChanges.subscribe((result) => {
        console.log(result);
      });
  }
}
