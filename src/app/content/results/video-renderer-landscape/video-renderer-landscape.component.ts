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
  };
  constructor(
    private videoDetailService: VideoDetailService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.searchForUserByID();
  }

  getVideoDetail() {
    this.selectedVideo = this.videos[this.video.id - 1];
  }
  @Input() videos: any;
  @Input() selectedVideo: any;

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
}
