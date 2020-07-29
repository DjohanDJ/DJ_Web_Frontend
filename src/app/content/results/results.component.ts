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
    private router: Router
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
      });
  }
  searchQuery: string;
  // searchQuery: string = this.videoService.getSearchQuery();
  videos: any;
}
