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

export const insertSubscriber = gql`
  mutation insertSubscriber($channel_id: Int!, $user_id: Int!) {
    createSubscriber(input: { channel_id: $channel_id, user_id: $user_id }) {
      id
      channel_id
      user_id
    }
  }
`;

export const deleteSubscriber = gql`
  mutation deleteSubscriber($deleteId: ID!) {
    deleteSubscriber(id: $deleteId)
  }
`;

export const getAllSubscriber = gql`
  query getSubscribers {
    subscribers {
      id
      channel_id
      user_id
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
          if (
            this.lastKey < this.filteredCurrentVideos.length &&
            this.videosState
          ) {
            let div = document.createElement('div');
            let video = document.createElement('app-video-renderer');
            video.setAttribute('video', 'this.videos[this.lastKey]');
            if (video != null && this.videosState) {
              div.appendChild(video);
            }
            if (div != null && this.videosState) {
              main.appendChild(div);
            }
            this.lastKey++;
          }
        }
      }
    });
    if (this.videosState) {
      this.observer.observe(document.querySelector('.end-point'));
    }

    this.getSubscriber();
    this.getPlaylist();
  }

  userPlaylists: any = [];
  showedPlaylist: any = [];
  getPlaylist() {
    var playlists = this.videosService.playlists;
    this.userPlaylists = [];

    if (
      this.userSession.getCurrentUserDB() != null &&
      this.userSession.getCurrentUserDB().id == this.currentUserParam
    ) {
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].channel_id == this.currentUserParam) {
          this.userPlaylists.push(playlists[i]);
        }
      }
    } else {
      for (let i = 0; i < playlists.length; i++) {
        if (
          playlists[i].channel_id == this.currentUserParam &&
          playlists[i].privacy == 'Public'
        ) {
          this.userPlaylists.push(playlists[i]);
        }
      }
    }

    const result = [];
    const map = new Map();
    for (const item of this.userPlaylists) {
      if (!map.has(item.playlist_id)) {
        map.set(item.playlist_id, true);
        result.push(item);
      }
    }
    this.userPlaylists = this.shuffle(result);

    this.showedPlaylist = [];
    for (let i = 0; i < this.userPlaylists.length; i++) {
      if (i < 3) {
        this.showedPlaylist.push(this.userPlaylists[i]);
      }
    }
    this.getCurrentVideo();
    this.getVideoCount();
  }

  currentVideo: any = [];
  videoCount: any = [];
  getCurrentVideo() {
    this.currentVideo = [];
    var allVideo = this.videosService.getVideos();
    for (let i = 0; i < this.showedPlaylist.length; i++) {
      for (let j = 0; j < allVideo.length; j++) {
        if (this.showedPlaylist[i].video_id == allVideo[j].id) {
          this.currentVideo.push(allVideo[j]);
        }
      }
    }
  }

  getVideoCount() {
    this.videoCount = [];
    for (let j = 0; j < this.showedPlaylist.length; j++) {
      this.videoCount[j] = 0;
    }
    var allPlaylist = this.videosService.playlists;
    for (let i = 0; i < allPlaylist.length; i++) {
      for (let j = 0; j < this.showedPlaylist.length; j++) {
        if (allPlaylist[i].playlist_id == this.showedPlaylist[j].playlist_id) {
          this.videoCount[j]++;
        }
      }
    }
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

  recentVideos: any = [];
  oneRecentVideos: any = [];

  filterRecentVideos() {
    this.recentVideos = [] = this.filteredCurrentVideos.sort((n1, n2) => {
      var first = new Date(n1.upload_date);
      var second = new Date(n2.upload_date);
      if (first.getTime() < second.getTime()) {
        return 1;
      } else return -1;
    });
    this.oneRecentVideos.push(this.recentVideos[0]);
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

  // subscribing

  subscribeState: boolean = false;
  deleteId: number;

  changeSubscribeState() {
    this.checkSubsRelation();
    if (this.subscribeState == true) {
      this.deleteSubscriber(this.deleteId);
    } else {
      this.insertSubscriber(
        Number(this.currentUserParam),
        Number(this.userSession.getCurrentUserDB().id)
      );
    }
    this.subscribeState = !this.subscribeState;
  }

  checkSubsRelation(): boolean {
    // console.log(this.allSubscribers);
    if (this.userSession.getCurrentUserDB() != null) {
      for (let i = 0; i < this.allSubscribers.length; i++) {
        const element = this.allSubscribers[i];
        if (
          this.userSession.getCurrentUserDB().id == element.user_id &&
          this.currentUserParam == element.channel_id
        ) {
          this.subscribeState = true;
          this.deleteId = element.id;
          return true;
          break;
        }
      }
      this.subscribeState = false;
      return false;
    }
  }

  insertSubscriber(channelId: any, userId: any) {
    this.apollo
      .mutate({
        mutation: insertSubscriber,
        variables: {
          channel_id: channelId,
          user_id: userId,
        },
        refetchQueries: [
          {
            query: getAllSubscriber,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {});
  }

  deleteSubscriber(subsId: any) {
    this.apollo
      .mutate({
        mutation: deleteSubscriber,
        variables: {
          deleteId: subsId,
        },
        refetchQueries: [
          {
            query: getAllSubscriber,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {});
  }

  getSubscriber() {
    this.apollo
      .watchQuery<any>({
        query: getAllSubscriber,
      })
      .valueChanges.subscribe((result) => {
        this.allSubscribers = result.data.subscribers;
        this.getCurrentSubscriber();
        this.checkSubsRelation();
      });
  }

  getCurrentSubscriber() {
    this.countSubscriber = 0;
    for (let i = 0; i < this.allSubscribers.length; i++) {
      const element = this.allSubscribers[i];
      if (this.currentUserParam == element.channel_id) {
        this.countSubscriber++;
        this.currentSubscriber.push(element);
      }
    }
    this.changeSubsFormat();
  }

  countSubscriber: number;
  currentSubscriber: any = [];
  allSubscribers: any = [];

  temp: any;
  editViewers: any;
  changeSubsFormat() {
    this.temp = this.countSubscriber;
    if (this.temp >= 1000000000) {
      if (this.temp % 1000000000 != 0) {
        this.temp = Math.floor(this.temp / 100000000);
        if (this.temp % 10 != 0) {
          this.temp /= 10;
          this.editViewers = this.temp.toFixed(1) + 'B';
        } else {
          this.temp /= 10;
          this.editViewers = this.temp.toString() + 'B';
        }
      } else {
        this.temp = this.temp / 1000000000;
        this.editViewers = this.temp.toString() + 'B';
      }
    } else if (this.temp >= 1000000) {
      if (this.temp % 1000000 != 0) {
        this.temp = Math.floor(this.temp / 100000);
        if (this.temp % 10 != 0) {
          this.temp /= 10;
          this.editViewers = this.temp.toFixed(1) + 'M';
        } else {
          this.temp /= 10;
          this.editViewers = this.temp.toString() + 'M';
        }
      } else {
        this.temp = this.temp / 1000000;
        this.editViewers = this.temp.toString() + 'M';
      }
    } else if (this.temp >= 1000) {
      if (this.temp % 1000 != 0) {
        this.temp = Math.floor(this.temp / 100);
        if (this.temp % 10 != 0) {
          this.temp /= 10;
          this.editViewers = this.temp.toFixed(1) + 'K';
        } else {
          this.temp /= 10;
          this.editViewers = this.temp.toString() + 'K';
        }
      } else {
        this.temp = this.temp / 1000;
        this.editViewers = this.temp.toString() + 'K';
      }
    } else {
      this.editViewers = this.temp.toString();
    }
  }
}
