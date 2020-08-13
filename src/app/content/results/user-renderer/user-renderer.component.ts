import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';

@Component({
  selector: 'app-user-renderer',
  templateUrl: './user-renderer.component.html',
  styleUrls: ['./user-renderer.component.scss'],
})
export class UserRendererComponent implements OnInit {
  constructor(private videoService: VideoDetailService) {}

  ngOnInit(): void {
    this.countCurrentVideo();
  }

  @Input() user: {
    id: number;
    username: string;
    channel_name: string;
    user_image: string;
    channel_banner: string;
    channel_desc: string;
  };

  @Input() users: any;

  subscribeState: boolean = false;
  videoCount: number = 0;
  videos: any = [];

  changeSubscribeState() {
    this.subscribeState = !this.subscribeState;
  }

  countCurrentVideo() {
    this.videoCount = 0;
    this.videos = this.videoService.getVideos();
    for (let i = 0; i < this.videos.length; i++) {
      const element = this.videos[i];
      if (element.user_id == this.user.id) {
        this.videoCount++;
      }
    }
  }
}
