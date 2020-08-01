import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';

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
        variables: {
          isKid: this.videoService.getRestrictionState(),
        },
      })
      .valueChanges.subscribe((result) => {
        // console.log(this.videoService.getRestrictionState());
        // console.log(result.data);
        this.videos = result.data.searchHomeVideosManager;
        this.videoService.setVideos(this.videos);
        this.videos = this.shuffle(this.videos);
        // console.log(this.videos);
      });
  }

  shuffle(a: any) {
    for (var i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  videos: any;
}
