import { Component, OnInit } from '@angular/core';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CategoryDetailService } from '../../services-only/category-detail.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  constructor(
    private videoService: VideoDetailService,
    private route: ActivatedRoute,
    private router: Router,
    public categoryService: CategoryDetailService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.categoryQuery = params.category_query;
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
    this.videos = this.videoService.getVideos();
    this.filterVideos(this.categoryQuery);
  }

  changeMusicState() {
    this.categoryService.musicState = true;
    this.categoryService.sportState = false;
    this.categoryService.gamingState = false;
    this.categoryService.entertainmentState = false;
    this.categoryService.newsState = false;
    this.categoryService.travelState = false;
    this.categoryService.currentName = 'Music';
    this.categoryService.currentLogo =
      '../../../assets/category-assets/bxs-music.svg';
  }

  changeSportState() {
    this.categoryService.musicState = false;
    this.categoryService.sportState = true;
    this.categoryService.gamingState = false;
    this.categoryService.entertainmentState = false;
    this.categoryService.newsState = false;
    this.categoryService.travelState = false;
    this.categoryService.currentName = 'Sport';
    this.categoryService.currentLogo =
      '../../../assets/category-assets/baseline-sports-basketball.svg';
  }

  changeGamingState() {
    this.categoryService.musicState = false;
    this.categoryService.sportState = false;
    this.categoryService.gamingState = true;
    this.categoryService.entertainmentState = false;
    this.categoryService.newsState = false;
    this.categoryService.travelState = false;
    this.categoryService.currentName = 'Gaming';
    this.categoryService.currentLogo =
      '../../../assets/category-assets/youtubegaming.svg';
  }

  changeEntertainmentState() {
    this.categoryService.musicState = false;
    this.categoryService.sportState = false;
    this.categoryService.gamingState = false;
    this.categoryService.entertainmentState = true;
    this.categoryService.newsState = false;
    this.categoryService.travelState = false;
    this.categoryService.currentName = 'Entertainment';
    this.categoryService.currentLogo =
      '../../../assets/category-assets/dcentertainment.svg';
  }

  changeNewsState() {
    this.categoryService.musicState = false;
    this.categoryService.sportState = false;
    this.categoryService.gamingState = false;
    this.categoryService.entertainmentState = false;
    this.categoryService.newsState = true;
    this.categoryService.travelState = false;
    this.categoryService.currentName = 'News';
    this.categoryService.currentLogo =
      '../../../assets/category-assets/bx-news.svg';
  }

  changeTravelState() {
    this.categoryService.musicState = false;
    this.categoryService.sportState = false;
    this.categoryService.gamingState = false;
    this.categoryService.entertainmentState = false;
    this.categoryService.newsState = false;
    this.categoryService.travelState = true;
    this.categoryService.currentName = 'Travel';
    this.categoryService.currentLogo =
      '../../../assets/category-assets/baseline-card-travel.svg';
  }

  filterVideos(categoryQuery: string) {
    for (let index = 0; index < this.videos.length; index++) {
      const element = this.videos[index];
      if (categoryQuery == 'music') {
        if (element.category_id == 1) {
          this.filteredVideos.push(element);
        }
      } else if (categoryQuery == 'sport') {
        if (element.category_id == 2) {
          this.filteredVideos.push(element);
        }
      } else if (categoryQuery == 'gaming') {
        if (element.category_id == 3) {
          this.filteredVideos.push(element);
        }
      } else if (categoryQuery == 'entertainment') {
        if (element.category_id == 4) {
          this.filteredVideos.push(element);
        }
      } else if (categoryQuery == 'news') {
        if (element.category_id == 5) {
          this.filteredVideos.push(element);
        }
      } else if (categoryQuery == 'travel') {
        if (element.category_id == 6) {
          this.filteredVideos.push(element);
        }
      }
    }
  }

  filteredVideos: any = [];
  videos: any = [];
  categoryQuery: string;
}
