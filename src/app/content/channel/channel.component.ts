import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/services-only/user-session.service';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export const searchUserById = gql`
  query searchUserByID($searchId: Int!) {
    searchUserByID(userId: $searchId) {
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
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  constructor(
    public userSession: UserSessionService,
    private videosService: VideoDetailService,
    private route: ActivatedRoute,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.currentUserParam = this.route.snapshot.params.id;
    this.filterTop5Videos();
    this.filterGetVideos();
    this.apollo
      .watchQuery<any>({
        query: searchUserById,
        variables: {
          searchId: this.currentUserParam,
        },
      })
      .valueChanges.subscribe((result) => {
        this.userFromPickedChannel = result.data.searchUserByID;
      });
  }

  userFromPickedChannel: any = null;

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

  currentUserParam: string;

  videos: any = this.videosService.getVideos();

  filteredVideos: any = [];

  filteredCurrentVideos: any = [];

  shuffle(a: any) {
    for (var i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  pushAllVideosToNew() {
    for (var i = 0; i < this.videos.length; i++) {
      this.shuffledVideos.push(this.videos[i]);
    }
  }

  shuffledVideos: any = [];

  filterTop5Videos() {
    this.pushAllVideosToNew();
    this.shuffledVideos = this.shuffle(this.shuffledVideos);
    for (let i = 0; i < this.shuffledVideos.length; i++) {
      const element = this.shuffledVideos[i];
      if (
        element.user_id == this.currentUserParam &&
        this.filteredVideos.length < 5
      ) {
        this.filteredVideos.push(element);
      }
    }
  }

  filterGetVideos() {
    for (let i = 0; i < this.videos.length; i++) {
      const element = this.videos[i];
      if (this.currentUserParam == element.user_id) {
        this.filteredCurrentVideos.push(element);
      }
    }
  }
}
