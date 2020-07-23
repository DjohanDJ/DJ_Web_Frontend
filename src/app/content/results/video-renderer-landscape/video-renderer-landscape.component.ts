import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';

@Component({
  selector: 'app-video-renderer-landscape',
  templateUrl: './video-renderer-landscape.component.html',
  styleUrls: ['./video-renderer-landscape.component.scss'],
})
export class VideoRendererLandscapeComponent implements OnInit {
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
  }
  @Input() videos: any;
  @Input() selectedVideo: any;
}
