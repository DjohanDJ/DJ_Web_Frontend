import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';

export const searchVideosQuery = gql`
  query searchVideos($searchQuery: String!) {
    searchVideos(search_query: $searchQuery) {
      id
      title
      image_path
      description
      view_count
      upload_date
      video_path
      user_id
      duration
    }
  }
`;

export const getUsers = gql`
  query getUsers {
    users {
      id
      username
      channel_name
      user_image
      channel_banner
      channel_desc
    }
  }
`;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoDetailService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    // this.searchQuery = this.route.snapshot.params.search_query;
    // this.searchQuery = this.videoService.getSearchQuery();
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params.search_query;
    });

    this.apollo
      .watchQuery<any>({
        query: searchVideosQuery,
        variables: {
          searchQuery: this.searchQuery,
        },
      })
      .valueChanges.subscribe((result) => {
        this.videos = result.data.searchVideos;
        this.filteredVideos = this.videos;
      });

    this.apollo
      .watchQuery<any>({
        query: getUsers,
      })
      .valueChanges.subscribe((result) => {
        this.users = result.data.users;
        this.checkContainUser();
        this.checkContainPlaylist();
      });
  }
  searchQuery: string;
  // searchQuery: string = this.videoService.getSearchQuery();
  videos: any;

  filteredVideos: any;

  allState: boolean = true;
  thisWeekState: boolean = false;
  thisMonthState: boolean = false;
  thisYearState: boolean = false;
  videoState: boolean = false;
  playlistState: boolean = false;
  channelState: boolean = false;

  changeAllState() {
    this.allState = true;
    this.thisWeekState = false;
    this.thisMonthState = false;
    this.thisYearState = false;
    this.videoState = false;
    this.playlistState = false;
    this.channelState = false;
    this.filteredVideos = [];
    this.filteredVideos = this.videos;
    this.checkContainUser();
  }

  changeThisWeekState() {
    this.allState = false;
    this.thisWeekState = true;
    this.thisMonthState = false;
    this.thisYearState = false;
    this.videoState = false;
    this.playlistState = false;
    this.channelState = false;
    this.filterByDay(7);
  }

  changeThisMonthState() {
    this.allState = false;
    this.thisWeekState = false;
    this.thisMonthState = true;
    this.thisYearState = false;
    this.videoState = false;
    this.playlistState = false;
    this.channelState = false;
    this.filterByDay(30);
  }

  changeThisYearState() {
    this.allState = false;
    this.thisWeekState = false;
    this.thisMonthState = false;
    this.thisYearState = true;
    this.videoState = false;
    this.playlistState = false;
    this.channelState = false;
    this.filterByDay(365);
  }

  changeVideoState() {
    this.allState = false;
    this.thisWeekState = false;
    this.thisMonthState = false;
    this.thisYearState = false;
    this.videoState = true;
    this.playlistState = false;
    this.channelState = false;
  }

  changePlaylistState() {
    this.allState = false;
    this.thisWeekState = false;
    this.thisMonthState = false;
    this.thisYearState = false;
    this.videoState = false;
    this.playlistState = true;
    this.channelState = false;
  }

  changeChannelState() {
    this.allState = false;
    this.thisWeekState = false;
    this.thisMonthState = false;
    this.thisYearState = false;
    this.videoState = false;
    this.playlistState = false;
    this.channelState = true;
    this.checkContainUser();
  }

  filterByDay(dayCount: number) {
    this.filteredVideos = [];
    var date = new Date();
    for (let i = 0; i < this.videos.length; i++) {
      const element = this.videos[i];
      var dbDate = new Date(element.upload_date);
      var differentDate = Math.abs(
        Math.floor((dbDate.getTime() - date.getTime()) / (1000 * 3600 * 24))
      );
      if (differentDate <= dayCount) {
        this.filteredVideos.push(element);
      }
    }
  }

  checkContainUser() {
    this.filteredUsers = [];
    for (let i = 0; i < this.users.length; i++) {
      const element = this.users[i];
      if (
        element.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      ) {
        this.filteredUsers.push(element);
      }
    }
  }

  filteredUsers: any = [];
  users: any;

  filteredPlaylists: any = [];

  checkContainPlaylist() {
    this.filteredPlaylists = [];
    var allPlaylist = this.videoService.playlists;
    const result = [];
    const map = new Map();
    for (const item of allPlaylist) {
      if (!map.has(item.playlist_id)) {
        map.set(item.playlist_id, true);
        result.push(item);
      }
    }

    var publicVideos = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].privacy === 'Public') {
        publicVideos.push(result[i]);
      }
    }
    for (let i = 0; i < publicVideos.length; i++) {
      if (
        publicVideos[i].title
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      ) {
        this.filteredPlaylists.push(publicVideos[i]);
      }
    }
    this.getCurrentVideo();
  }

  currentVideo: any = [];
  getCurrentVideo() {
    this.currentVideo = [];
    var allVideo = this.videoService.getVideos();
    for (let i = 0; i < this.filteredPlaylists.length; i++) {
      for (let j = 0; j < allVideo.length; j++) {
        if (this.filteredPlaylists[i].video_id == allVideo[j].id) {
          this.currentVideo.push(allVideo[j]);
        }
      }
    }
  }
}
