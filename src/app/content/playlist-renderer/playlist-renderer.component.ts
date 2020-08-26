import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-playlist-renderer',
  templateUrl: './playlist-renderer.component.html',
  styleUrls: ['./playlist-renderer.component.scss'],
})
export class PlaylistRendererComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() playlist: {
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

  @Input() video: {
    id: number;
    image_path: string;
    title: string;
    description: string;
    view_count: string;
    upload_date: string;
    video_path: string;
    user_id: number;
    restriction: string;
    duration: string;
  };

  @Input() videoCount: any = 0;
}
