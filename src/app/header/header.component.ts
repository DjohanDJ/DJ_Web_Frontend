import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UserSessionService } from '../services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from '../services-only/video-detail.service';

export const searchUserByEmail = gql`
  query searchUser($searchEmail: String!) {
    searchUserByEmail(searchEmail: $searchEmail) {
      id
      username
      email
      user_password
      channel_name
      channel_banner
    }
  }
`;

export const createUser = gql`
  mutation createUser(
    $username: String!
    $email: String!
    $user_password: String!
    $channel_name: String!
    $user_image: String!
  ) {
    createUser(
      input: {
        username: $username
        email: $email
        user_password: $user_password
        channel_name: $channel_name
        user_image: $user_image
      }
    ) {
      id
      username
      email
      user_password
      channel_name
      user_image
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
    public userSession: UserSessionService,
    private apollo: Apollo,
    private videoService: VideoDetailService
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
        // console.log(this.currentUserinDB);
        if (this.currentUserinDB == null) {
          // this.isCurrentUserExist = true;
          // console.log('A' + this.isCurrentUserExist);
          this.createNewUser();
        }
        this.userSession.setCurrentUserDB(this.currentUserinDB);
      });
  }

  currentUserinDB: any;
  searchEmail: string;

  isCurrentUserExist: boolean = false;
  // new user

  createNewUser() {
    this.apollo
      .mutate({
        mutation: createUser,
        variables: {
          username: this.user.name,
          email: this.user.email,
          user_password: 'None',
          channel_name: this.user.name,
          user_image: this.user.photoUrl,
        },
      })
      .subscribe((result) => {});
  }

  restrictionToggle: boolean = false;
  // restriction mode
  changeRestrictionToggleState() {
    this.restrictionToggle = !this.restrictionToggle;
    this.settingsDropdownState = false;
    this.dropdownDisplay = false;
  }

  noRestriction() {
    this.restrictionToggle = false;
    this.videoService.changeRestriction(false);
  }

  restrictionOnlyKids() {
    this.restrictionToggle = false;
    this.videoService.changeRestriction(true);
  }

  //keybard shortcut list
  shortcutListState: boolean = false;
  changeShortcutState() {
    this.shortcutListState = !this.shortcutListState;
    this.settingsDropdownState = false;
    this.dropdownDisplay = false;
  }
}
