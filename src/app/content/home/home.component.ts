import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { LocationDetailService } from 'src/app/services-only/location-detail.service';
import { Router } from '@angular/router';

export const getSavedPlaylist = gql`
  query getSavedPlaylist {
    savedplays {
      savedplay_id
      user_id
    }
  }
`;

export const getVideoQuery = gql`
  query searchHomeVideos($isKid: Boolean!) {
    searchHomeVideosManager(isKid: $isKid) {
      id
      title
      image_path
      description
      view_count
      upload_date
      video_path
      user_id
      restriction
      category_id
      location
      duration
    }
  }
`;

export const getPlaylistQuery = gql`
  query getPlaylists {
    playlists {
      playlist_id
      video_id
      description
      channel_id
      title
      thumbnail
      update_date
      view_count
      privacy
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private apollo: Apollo,
    private videoService: VideoDetailService,
    private locationService: LocationDetailService,
    private route: Router
  ) {}

  clickPlaylist() {
    this.route.navigateByUrl('/playlist/6');
  }

  ngOnInit(): void {
    this.lastKey = 12;
    this.observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.video-content');
        for (let i = 0; i < 4; i++) {
          if (this.lastKey < this.videos.length) {
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

    this.apollo
      .watchQuery<any>({
        query: getVideoQuery,
        variables: {
          isKid: this.videoService.getRestrictionState(),
        },
      })
      .valueChanges.subscribe((result) => {
        // console.log(this.videoService.getRestrictionState());
        // console.log(result.data);
        this.videos = result.data.searchHomeVideosManager;
        this.videoService.setVideos(this.videos);
        this.pushAllVideosToNew();
        this.shuffledVideos = this.shuffle(this.shuffledVideos);
        this.checkLocation();
        // console.log(this.videos);
      });

    this.apollo
      .watchQuery<any>({
        query: getPlaylistQuery,
      })
      .valueChanges.subscribe((result) => {
        this.videoService.playlists = result.data.playlists;
      });

    this.apollo
      .watchQuery<any>({
        query: getSavedPlaylist,
      })
      .valueChanges.subscribe((result) => {
        this.videoService.savedPlaylists = result.data.savedplays;
      });
  }

  videosByLocation: any = [];
  videosNotByLocation: any = [];
  checkLocation() {
    for (let i = 0; i < this.shuffledVideos.length; i++) {
      const element = this.shuffledVideos[i];
      if (element.location == this.locationService.getCurrentLocation()) {
        this.videosByLocation.push(element);
      } else {
        this.videosNotByLocation.push(element);
      }
    }

    for (let i = 0; i < this.videosNotByLocation.length; i++) {
      const element = this.videosNotByLocation[i];
      this.videosByLocation.push(element);
    }
  }

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
  videos: any = [];

  // infinite scroll
  lastKey = 0;
  observer: any;
}
