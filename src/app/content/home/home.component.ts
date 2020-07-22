import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: getVideoQuery,
      })
      .valueChanges.subscribe((result) => {
        this.videos = result.data.videos;
      });
  }

  videos: any;
}
