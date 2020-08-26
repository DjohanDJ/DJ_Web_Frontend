import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';

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
  selector: 'app-playlist-renderer-landscape',
  templateUrl: './playlist-renderer-landscape.component.html',
  styleUrls: ['./playlist-renderer-landscape.component.scss'],
})
export class PlaylistRendererLandscapeComponent implements OnInit {
  constructor(
    private apollo: Apollo,
    private router: Router,
    private videoService: VideoDetailService
  ) {}

  ngOnInit(): void {
    this.searchUser();
  }

  searchUser() {
    this.apollo
      .watchQuery<any>({
        query: searchUserById,
        variables: {
          searchId: this.playlist.channel_id,
        },
      })
      .valueChanges.subscribe((result) => {
        this.user = result.data.searchUserByID;
      });
  }

  @Input() playlist: {
    playlist_id: number;
    video_id: number;
    channel_id: number;
    title: string;
    description: string;
    thumbnail: string;
    update_date: string;
    view_count: string;
    privacy: string;
  };

  @Input() video: {
    id: number;
    image_path: string;
    title: string;
    description: string;
    view_count: string;
    upload_date: string;
    video_path: string;
    user_id: number;
    restriction: string;
    duration: string;
  };

  @Input() videoCount: any = 0;

  user: {
    id: number;
    username: string;
    email: string;
    user_password: string;
    channel_name: string;
    user_image: string;
  };

  playAllPlaylist() {
    this.setCurrentQueue();
    this.router.navigateByUrl(
      '/watch/' + this.video.id + '/' + this.playlist.playlist_id
    );
  }

  setCurrentQueue() {
    this.videoService.parsedVideoQueue = [];
    var allPlaylist = this.videoService.playlists;
    var allVideo = this.videoService.getVideos();
    var videoIds = [];

    for (let i = 0; i < allPlaylist.length; i++) {
      if (allPlaylist[i].playlist_id == this.playlist.playlist_id) {
        videoIds.push(allPlaylist[i].video_id);
      }
    }

    for (let j = 0; j < videoIds.length; j++) {
      for (let i = 0; i < allVideo.length; i++) {
        if (allVideo[i].id == videoIds[j]) {
          this.videoService.parsedVideoQueue.push(allVideo[i]);
        }
      }
    }
  }
}
