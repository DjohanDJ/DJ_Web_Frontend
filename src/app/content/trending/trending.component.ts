import { Component, OnInit } from '@angular/core';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { LocationDetailService } from 'src/app/services-only/location-detail.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent implements OnInit {
  constructor(
    private videoService: VideoDetailService,
    private locationService: LocationDetailService
  ) {}

  ngOnInit(): void {
    var today = new Date();
    this.getTrendingVideos(today);
  }

  getTrendingVideos(currentDate) {
    var allVideos = this.videoService.getVideos();
    let i = 0;
    for (let i = 0; i < allVideos.length; i++) {
      const element = allVideos[i];
      var dbDate = new Date(element.upload_date);
      var differentDate = Math.abs(
        Math.floor(
          (dbDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
        )
      );
      if (differentDate <= 7) {
        this.videos.push(element);
        i++;
      }
      if (i == 20) {
        break;
      }
    }
    this.sortVideosByView();
    this.checkLocation();
  }

  sortVideosByView() {
    this.videos = [] = this.videos.sort((n1, n2) => {
      if (n1.view_count < n2.view_count) {
        return 1;
      } else return -1;
    });
  }

  videos: any = [];

  videosByLocation: any = [];
  checkLocation() {
    for (let i = 0; i < this.videos.length; i++) {
      const element = this.videos[i];
      if (element.location == this.locationService.getCurrentLocation()) {
        this.videosByLocation.push(element);
      }
    }
  }
}
