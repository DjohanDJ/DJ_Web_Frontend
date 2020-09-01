import { Component, OnInit, Input } from '@angular/core';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-post-channel',
  templateUrl: './post-channel.component.html',
  styleUrls: ['./post-channel.component.scss'],
})
export class PostChannelComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.changeDateFormat();
  }

  @Input() post: {
    post_id: number;
    channel_id: number;
    title: string;
    description: string;
    image: string;
    like_count: number;
    dislike_count: number;
    date: string;
  };

  editDate: any;
  changeDateFormat() {
    var now = new Date();
    var videoDate = new Date(this.post.date);
    var differentDate = Math.abs(
      Math.floor((now.getTime() - videoDate.getTime()) / (1000 * 3600 * 24))
    );
    if (differentDate <= 1) {
      this.editDate = 'Today';
    } else if (differentDate <= 6) {
      this.editDate = differentDate + ' days ago';
    } else if (differentDate <= 30) {
      this.editDate = Math.abs(Math.floor(differentDate / 7)) + ' weeks ago';
    } else if (differentDate <= 365) {
      this.editDate = Math.abs(Math.floor(differentDate / 30)) + ' months ago';
    } else {
      this.editDate = Math.abs(Math.floor(differentDate / 365)) + ' years ago';
    }
  }
}
