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
      channel_banner
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

  lastKey: number = 0;
  observer: any;

  ngOnInit(): void {
    this.currentUserParam = this.route.snapshot.params.id;
    this.filterTop5Videos();
    this.filterGetVideos();
    this.filterRecentVideos();
    this.sortVideosByViews();
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

    this.lastKey = 4;
    this.observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.parent');
        for (let i = 0; i < 3; i++) {
          if (this.lastKey < this.filteredCurrentVideos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-video-renderer');
            video.setAttribute('video', 'this.videos[this.lastKey]');
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey++;
          }
        }
      }
    });
    this.observer.observe(document.querySelector('.end-point'));
  }

  userFromPickedChannel: any = null;

  homeState: boolean = false;
  videosState: boolean = true;
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

  subscribeState: boolean = false;

  changeSubscribeState() {
    this.subscribeState = !this.subscribeState;
  }

  recentVideos: any = [];

  filterRecentVideos() {
    var currentDate = new Date();
    for (let i = 0; i < this.videos.length; i++) {
      const element = this.videos[i];
      var dbDate = new Date(element.upload_date);
      var differentDate = Math.abs(
        Math.floor(
          (dbDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
        )
      );
      if (differentDate <= 7) {
        this.recentVideos.push(element);
        i++;
      }
      if (i == 5) {
        break;
      }
    }
  }

  // sort

  mostPopularState: boolean = true;
  newestState: boolean = false;
  oldestState: boolean = false;

  changeMostPopularState() {
    this.mostPopularState = true;
    this.newestState = false;
    this.oldestState = false;
    this.sortVideosByViews();
  }

  changeNewestState() {
    this.mostPopularState = false;
    this.newestState = true;
    this.oldestState = false;
    this.sortVideosByNewest();
  }

  changeOldestState() {
    this.mostPopularState = false;
    this.newestState = false;
    this.oldestState = true;
    this.sortVideosByOldest();
  }

  sortVideosByNewest() {
    this.filteredCurrentVideos = [] = this.filteredCurrentVideos.sort(
      (n1, n2) => {
        var first = new Date(n1.upload_date);
        var second = new Date(n2.upload_date);
        if (first.getTime() < second.getTime()) {
          return 1;
        } else return -1;
      }
    );
  }

  sortVideosByOldest() {
    this.filteredCurrentVideos = [] = this.filteredCurrentVideos.sort(
      (n1, n2) => {
        var first = new Date(n1.upload_date);
        var second = new Date(n2.upload_date);
        if (first.getTime() > second.getTime()) {
          return 1;
        } else return -1;
      }
    );
  }

  sortVideosByViews() {
    this.filteredCurrentVideos = [] = this.filteredCurrentVideos.sort(
      (n1, n2) => {
        if (n1.view_count < n2.view_count) {
          return 1;
        } else return -1;
      }
    );
  }
}
