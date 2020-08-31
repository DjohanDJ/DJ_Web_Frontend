import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoDetailService {
  constructor() {}

  isRestriction: boolean = false;

  currentChildComments = [];

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

  setChildComment(currentComments) {
    this.currentChildComments = currentComments;
  }

  getCurrentChildComments() {
    return this.currentChildComments;
  }

  playlists: any = [];
  userPlaylists: any = [];
  distinctPlaylists: any = [];
  nextDistinctPlaylists: any = [];

  privacyState: boolean = false;

  parsedVideoQueue: any = [];

  currentNextVideo: any = null;

  currentAllVideos: any = [];

  singlePlaylistDetail: {
    playlist_id: number;
    video_id: number;
    channel_id: number;
    title: string;
    description: string;
    thumbnail: string;
    update_date: string;
    view_count: string;
    privacy: string;
  };

  // dropdown state share
  sharingState: boolean = false;
  addPlaylistState: boolean = false;

  checkBooleanTime: boolean = false;

  autoPlayState: boolean = false;

  // for insert to playlist

  choosenVideoForPlaylist: any = null;

  savedPlaylists: any = [];
}
