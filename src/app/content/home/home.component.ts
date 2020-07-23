import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';

export const getVideoQuery = gql`
  query getVideos {
    videos {
      id
      title
      image_path
      description
      view_count
      upload_date
      video_path
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
    private videoService: VideoDetailService
  ) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: getVideoQuery,
      })
      .valueChanges.subscribe((result) => {
        this.videos = result.data.videos;
        this.videoService.setVideos(this.videos);
      });
  }

  videos: any;
}
