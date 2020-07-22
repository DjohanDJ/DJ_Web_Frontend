import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoDetailService {
  constructor() {}

  videos: any;

  getVideos(): any {
    return this.videos;
  }

  setVideos(videos: any) {
    this.videos = videos;
  }
}
