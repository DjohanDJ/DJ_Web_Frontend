import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from '../../services-only/video-detail.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { UserSessionService } from 'src/app/services-only/user-session.service';

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
  selector: 'app-video-renderer',
  templateUrl: './video-renderer.component.html',
  styleUrls: ['./video-renderer.component.scss'],
})
export class VideoRendererComponent implements OnInit {
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

  constructor(
    private videoDetailService: VideoDetailService,
    private apollo: Apollo,
    private router: Router,
    public userSession: UserSessionService
  ) {}

  userFromPickedVideo: any = null;
  channelName: any;

  locationNow: any;
  ngOnInit(): void {
    this.locationNow = location.href;
    this.searchForUserByID();
    this.temp = this.video.view_count;
    this.changeViewFormat();
    this.changeTitleFormat();
    this.changeDateFormat();

    this.apollo
      .watchQuery<any>({
        query: searchUserByID,
        variables: {
          userId: this.video.user_id,
        },
      })
      .valueChanges.subscribe((result) => {
        this.userFromPickedVideo = result.data.searchUserByID;
        this.channelName = result.data.searchUserByID.channel_name;
      });
  }

  getVideoDetail() {
    this.selectedVideo = this.videos[this.video.id - 1];
    this.videoDetailService.setVideos(this.videos);
    // this.router.navigateByUrl('/watch/' + this.video.id + '/0?time=14');
  }
  @Input() videos: any;
  @Input() selectedVideo: any;

  //searchUserFunc

  userImage: string;

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
    if (this.video.title.length > 30) {
      this.editTitle = this.video.title.substring(0, 30);
      this.editTitle += '...';
    } else {
      this.editTitle = this.video.title;
    }
  }

  editDate: any;

  changeDateFormat() {
    var now = new Date();
    var videoDate = new Date(this.video.upload_date);
    var differentDate = Math.abs(
      Math.floor((videoDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
    );
    if (differentDate <= 1) {
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

  dropdownDisplay: boolean = false;

  openDropdown() {
    this.dropdownDisplay = !this.dropdownDisplay;
  }

  openPlaylistModal() {
    this.dropdownDisplay = !this.dropdownDisplay;
    // console.log(this.video.id);
    this.videoDetailService.choosenVideoForPlaylist = this.video.id;
    this.changeAddPlaylistState();
  }

  changeAddPlaylistState() {
    this.videoDetailService.addPlaylistState = !this.videoDetailService
      .addPlaylistState;
    window.scrollTo(0, 0);
  }
}
