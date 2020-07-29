import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoDetailService {
  constructor() {}

  isRestriction: boolean = false;

  videos: any = null;
  restrictedVideos: any = null;

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

  changeRestriction(meanState: boolean) {
    this.isRestriction = meanState;
  }

  getRestrictionState(): boolean {
    return this.isRestriction;
  }
}
