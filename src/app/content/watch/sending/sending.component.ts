import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sending',
  templateUrl: './sending.component.html',
  styleUrls: ['./sending.component.scss'],
})
export class SendingComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.videoId = this.route.snapshot.params.id;
    setTimeout(() => {
      this.router.navigateByUrl('/watch/' + this.videoId + '/0');
    }, 1000);
  }

  videoId: string;
}
