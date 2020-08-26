import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export const searchUserByID = gql`
  query searchUserByID($userId: Int!) {
    searchUserByID(userId: $userId) {
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
  selector: 'app-video-renderer-landscape',
  templateUrl: './video-renderer-landscape.component.html',
  styleUrls: ['./video-renderer-landscape.component.scss'],
})
export class VideoRendererLandscapeComponent implements OnInit {
  @Input() video: {
    id: number;
    image_path: string;
    title: string;
    description: string;
    view_count: string;
    upload_date: string;
    video_path: string;
    user_id: number;
    channel_name: string;
    duration: string;
  };
  constructor(
    private videoDetailService: VideoDetailService,
    private apollo: Apollo
  ) {}

  userFromPickedVideo: any;

  ngOnInit(): void {
    this.searchForUserByID();
    this.temp = this.video.view_count;
    this.changeViewFormat();
    this.changeTitleFormat();
    this.changeDateFormat();
    this.changeDescFormat();

    this.apollo
      .watchQuery<any>({
        query: searchUserByID,
        variables: {
          userId: this.video.user_id,
        },
      })
      .valueChanges.subscribe((result) => {
        this.userFromPickedVideo = result.data.searchUserByID;
      });
  }

  getVideoDetail() {
    this.selectedVideo = this.videos[this.video.id - 1];
  }
  @Input() videos: any;
  @Input() selectedVideo: any;

  userImage: string;
  channelName: string;

  searchForUserByID() {
    // cek ke db usenya ada/engga
    this.apollo
      .watchQuery<any>({
        query: searchUserByID,
        variables: {
          userId: this.video.user_id,
        },
      })
      .valueChanges.subscribe((result) => {
        this.userImage = result.data.searchUserByID.user_image;
        this.channelName = result.data.searchUserByID.channel_name;
      });
  }

  temp: any;
  editViewers: any;

  changeViewFormat() {
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

  editTitle: any;
  changeTitleFormat() {
    if (this.video.title.length > 50) {
      this.editTitle = this.video.title.substring(0, 50);
      this.editTitle += '...';
    } else {
      this.editTitle = this.video.title;
    }
  }

  editDesc: any;
  changeDescFormat() {
    if (this.video.description.length > 50) {
      this.editDesc = this.video.description.substring(0, 50);
      this.editDesc += '...';
    } else {
      this.editDesc = this.video.description;
    }
  }

  editDate: any;

  changeDateFormat() {
    var now = new Date();
    var videoDate = new Date(this.video.upload_date);
    var differentDate = Math.abs(
      Math.floor((videoDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
    );
    if (differentDate < 1) {
      this.editDate = 'Today';
    } else if (differentDate <= 6) {
      this.editDate = differentDate + ' days ago';
    } else if (differentDate <= 30) {
      this.editDate = Math.abs(Math.floor(differentDate / 7)) + ' weeks ago';
    } else if (differentDate <= 365) {
      this.editDate = Math.abs(Math.floor(differentDate / 30)) + ' months ago';
    } else {
      this.editDate = Math.abs(Math.floor(differentDate / 365)) + ' years ago';
    }
  }
}
