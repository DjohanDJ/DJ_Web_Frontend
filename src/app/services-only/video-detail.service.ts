import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoDetailService {
  constructor() {}

  videos: any = null;

  getVideos(): any {
    return this.videos;
  }

  setVideos(videos: any) {
    if (this.videos == null) {
      this.videos = videos;
    } else {
      return;
    }
  }
}
