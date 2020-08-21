import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subsciptions',
  templateUrl: './subsciptions.component.html',
  styleUrls: ['./subsciptions.component.scss'],
})
export class SubsciptionsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() user: {
    id: number;
    username: string;
    user_image: string;
  };

  @Input() users: any;
}
