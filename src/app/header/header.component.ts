import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UserSessionService } from '../services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from '../services-only/video-detail.service';
import { LocationDetailService } from '../services-only/location-detail.service';

export const searchUserByEmail = gql`
  query searchUser($searchEmail: String!) {
    searchUserByEmail(searchEmail: $searchEmail) {
      id
      username
      email
      user_password
      user_image
      channel_name
      channel_banner
      restriction
      location
      channel_desc
      membership
      expired_member
      join_date
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
        channel_banner: "./../../assets/dummy-channel-assets/dj4_banner.jpg"
        channel_desc: "Inspire people for code!"
        restriction: "mature"
        location: "Indonesia"
        membership: ""
        expired_member: ""
        join_date: ""
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

export const updateUser = gql`
  mutation updateUserAttrib(
    $userID: ID!
    $username: String!
    $email: String!
    $user_password: String!
    $channel_name: String!
    $user_image: String!
    $channel_banner: String!
    $channel_desc: String!
    $restriction: String!
    $location: String!
    $membership: String!
    $expired_date: String!
    $join_date: String!
  ) {
    updateUser(
      id: $userID
      input: {
        username: $username
        email: $email
        user_password: $user_password
        channel_name: $channel_name
        user_image: $user_image
        channel_banner: $channel_banner
        channel_desc: $channel_desc
        restriction: $restriction
        location: $location
        membership: $membership
        expired_member: $expired_date
        join_date: $join_date
      }
    ) {
      id
      username
      email
      user_password
      channel_name
      user_image
      location
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
    private videoService: VideoDetailService,
    private locationService: LocationDetailService
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
    this.userSession.currentSubs = [];
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
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
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
        // ngatur subscription

        this.getCurrentUsers();
        this.getSubscriber();
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
    if (this.userSession.getCurrentUserDB() != null) {
      this.updateUserRestriction('mature');
    }
    window.scrollTo(0, 0);
  }

  restrictionOnlyKids() {
    this.restrictionToggle = false;
    this.videoService.changeRestriction(true);
    if (this.userSession.getCurrentUserDB() != null) {
      this.updateUserRestriction('kid');
    }
    window.scrollTo(0, 0);
  }

  //keybard shortcut list
  shortcutListState: boolean = false;
  changeShortcutState() {
    this.shortcutListState = !this.shortcutListState;
    this.settingsDropdownState = false;
    this.dropdownDisplay = false;
    window.scrollTo(0, 0);
  }

  locationModalState: boolean = false;

  changeLocationModalState() {
    this.locationModalState = !this.locationModalState;
    this.settingsDropdownState = false;
  }

  changeLocationInd() {
    this.locationService.setCurrentLocation('Indonesia');
    this.locationModalState = false;
    this.settingsDropdownState = false;
    if (this.userSession.getCurrentUserDB() != null) {
      this.updateUserLocation('Indonesia');
    }
  }

  changeLocationHK() {
    this.locationService.setCurrentLocation('Hong Kong');
    this.locationModalState = false;
    this.settingsDropdownState = false;
    if (this.userSession.getCurrentUserDB() != null) {
      this.updateUserLocation('Hong Kong');
    }
  }

  changeLocationAus() {
    this.locationService.setCurrentLocation('Australia');
    this.locationModalState = false;
    this.settingsDropdownState = false;
    if (this.userSession.getCurrentUserDB() != null) {
      this.updateUserLocation('Australia');
    }
  }

  changeLocationChi() {
    this.locationService.setCurrentLocation('China');
    this.locationModalState = false;
    this.settingsDropdownState = false;
    if (this.userSession.getCurrentUserDB() != null) {
      this.updateUserLocation('China');
    }
  }

  changeLocationAmr() {
    this.locationService.setCurrentLocation('America');
    this.locationModalState = false;
    this.settingsDropdownState = false;
    if (this.userSession.getCurrentUserDB() != null) {
      this.updateUserLocation('America');
    }
  }

  updateUserRestriction(restric: any) {
    this.apollo
      .mutate({
        mutation: updateUser,
        variables: {
          userID: this.userSession.getCurrentUserDB().id,
          username: this.user.name,
          email: this.user.email,
          user_password: 'None',
          channel_name: this.user.name,
          user_image: this.user.photoUrl,
          channel_banner: this.userSession.getCurrentUserDB().channel_banner,
          channel_desc: this.userSession.getCurrentUserDB().channel_desc,
          restriction: restric,
          location: this.userSession.getCurrentUserDB().location,
          membership: this.userSession.getCurrentUserDB().membership,
          expired_date: this.userSession.getCurrentUserDB().expired_member,
          join_date: this.userSession.getCurrentUserDB().join_date,
        },
      })
      .subscribe((result) => {});
  }

  updateUserLocation(locationParam: any) {
    this.apollo
      .mutate({
        mutation: updateUser,
        variables: {
          userID: this.userSession.getCurrentUserDB().id,
          username: this.user.name,
          email: this.user.email,
          user_password: 'None',
          channel_name: this.user.name,
          user_image: this.user.photoUrl,
          channel_banner: this.userSession.getCurrentUserDB().channel_banner,
          channel_desc: this.userSession.getCurrentUserDB().channel_desc,
          restriction: this.userSession.getCurrentUserDB().restriction,
          location: locationParam,
          membership: this.userSession.getCurrentUserDB().membership,
          expired_date: this.userSession.getCurrentUserDB().expired_member,
          join_date: this.userSession.getCurrentUserDB().join_date,
        },
      })
      .subscribe((result) => {});
  }

  // subscription
  allSubscribers: any = [];
  currentSubscriber: any = [];
  getSubscriber(): boolean {
    this.apollo
      .watchQuery<any>({
        query: getAllSubscriber,
      })
      .valueChanges.subscribe((result) => {
        this.allSubscribers = result.data.subscribers;
        this.getCurrentSubscriber();
        return true;
      });
    return false;
  }

  getCurrentSubscriber() {
    this.currentSubscriber = [];
    this.userSession.currentSubs = [];
    this.userSession.nextSubs = [];
    var counter = 0;
    for (let i = 0; i < this.allSubscribers.length; i++) {
      const element = this.allSubscribers[i];
      if (this.userSession.getCurrentUserDB().id == element.user_id) {
        this.currentSubscriber.push(element);
        for (let j = 0; j < this.allUsers.length; j++) {
          const element2 = this.allUsers[j];
          if (element2.id == element.channel_id && counter <= 9) {
            this.userSession.currentSubs.push(element2);
            counter++;
          } else if (element2.id == element.channel_id && counter > 9) {
            this.userSession.nextSubs.push(element2);
            counter++;
          }
        }
      }
    }
    this.sortChannelByName();
  }

  allUsers: any = [];

  getCurrentUsers() {
    this.apollo
      .watchQuery<any>({
        query: searchUserById,
      })
      .valueChanges.subscribe((result) => {
        this.allUsers = result.data.users;
      });
  }

  sortChannelByName() {
    this.userSession.currentSubs = [] = this.userSession.currentSubs.sort(
      (n1, n2) => {
        if (n1.username > n2.username) {
          return 1;
        } else return -1;
      }
    );
  }
}

export const getAllSubscriber = gql`
  query getSubscribers {
    subscribers {
      id
      channel_id
      user_id
    }
  }
`;

export const searchUserById = gql`
  query getUsers {
    users {
      id
      username
      channel_name
      user_image
      channel_banner
      channel_desc
      restriction
      location
      membership
      expired_member
      join_date
    }
  }
`;
