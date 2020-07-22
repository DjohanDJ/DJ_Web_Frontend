import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from '../../services-only/video-detail.service';

@Component({
  selector: 'app-video-renderer',
  templateUrl: './video-renderer.component.html',
  styleUrls: ['./video-renderer.component.scss'],
})
export class VideoRendererComponent implements OnInit {
  @Input() video: {
    id: number;
    image_path: string;
    title: string;
    description: string;
    view_count: string;
    upload_date: string;
    video_path: string;
  };

  constructor(private videoDetailService: VideoDetailService) {}

  ngOnInit(): void {}

  getVideoDetail() {
    this.selectedVideo = this.videos[this.video.id - 1];
    this.videoDetailService.setVideos(this.videos);
  }
  @Input() videos: any;
  @Input() selectedVideo: any;
}
