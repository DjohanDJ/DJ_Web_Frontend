import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/services-only/user-session.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  constructor(public userSession: UserSessionService) {}

  ngOnInit(): void {}

  homeState: boolean = true;
  videosState: boolean = false;
  playlistState: boolean = false;
  communityState: boolean = false;
  aboutState: boolean = false;

  changeHomeState() {
    this.homeState = true;
    this.videosState = false;
    this.playlistState = false;
    this.communityState = false;
    this.aboutState = false;
  }

  changeVideosState() {
    this.homeState = false;
    this.videosState = true;
    this.playlistState = false;
    this.communityState = false;
    this.aboutState = false;
  }

  changePlaylistState() {
    this.homeState = false;
    this.videosState = false;
    this.playlistState = true;
    this.communityState = false;
    this.aboutState = false;
  }

  changeCommunityState() {
    this.homeState = false;
    this.videosState = false;
    this.playlistState = false;
    this.communityState = true;
    this.aboutState = false;
  }

  changeAboutState() {
    this.homeState = false;
    this.videosState = false;
    this.playlistState = false;
    this.communityState = false;
    this.aboutState = true;
  }
}
