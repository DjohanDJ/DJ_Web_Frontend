import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from '../../services-only/video-detail.service';
import { ActivatedRoute } from '@angular/router';
import { url } from 'inspector';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  constructor(
    private videoDetailService: VideoDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.urlId = this.route.snapshot.params.id - 1;
    this.selectedVideo = this.videoDetailService.getVideos()[this.urlId];
  }

  @Input() selectedVideo: {
    id: number;
    image_path: string;
    title: string;
    description: string;
    view_count: string;
    upload_date: string;
    video_path: string;
  };
  @Input() urlId: number;
}
