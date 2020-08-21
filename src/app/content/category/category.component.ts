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
    this.sortVideosByView();
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
    this.filteredVideos = [];
    let j = 0;
    for (let index = 0; index < this.videos.length; index++) {
      const element = this.videos[index];
      if (categoryQuery == 'music') {
        if (element.category_id == 1) {
          this.filteredVideos.push(element);
          j++;
        }
      } else if (categoryQuery == 'sport') {
        if (element.category_id == 2) {
          this.filteredVideos.push(element);
          j++;
        }
      } else if (categoryQuery == 'gaming') {
        if (element.category_id == 3) {
          this.filteredVideos.push(element);
          j++;
        }
      } else if (categoryQuery == 'entertainment') {
        if (element.category_id == 4) {
          this.filteredVideos.push(element);
          j++;
        }
      } else if (categoryQuery == 'news') {
        if (element.category_id == 5) {
          this.filteredVideos.push(element);
          j++;
        }
      } else if (categoryQuery == 'travel') {
        if (element.category_id == 6) {
          this.filteredVideos.push(element);
          j++;
        }
      }
      if (j == 20) {
        break;
      }
    }
  }

  filteredVideos: any = [];
  videos: any = [];
  categoryQuery: string;

  // section

  allTimePopular: boolean = true;
  popularThisWeek: boolean = false;
  popularThisMonth: boolean = false;
  recentlyUpload: boolean = false;

  changeAllPopular() {
    this.allTimePopular = true;
    this.popularThisWeek = false;
    this.popularThisMonth = false;
    this.recentlyUpload = false;
    this.filterVideos(this.categoryQuery);
    this.sortByAllTimePopular();
  }

  changePopularThisWeek() {
    this.allTimePopular = false;
    this.popularThisWeek = true;
    this.popularThisMonth = false;
    this.recentlyUpload = false;
    this.filterVideos(this.categoryQuery);
    this.sortByPopularThisWeek();
  }

  changePopularThisMonth() {
    this.allTimePopular = false;
    this.popularThisWeek = false;
    this.popularThisMonth = true;
    this.recentlyUpload = false;
    this.filterVideos(this.categoryQuery);
    this.sortByPopularThisMonth();
  }

  changeRecentlyUpload() {
    this.allTimePopular = false;
    this.popularThisWeek = false;
    this.popularThisMonth = false;
    this.recentlyUpload = true;
    this.filterVideos(this.categoryQuery);
    this.sortByRecentVideos();
  }

  sortByAllTimePopular() {
    this.sortVideosByView();
  }

  sortByPopularThisWeek() {
    this.filterByDay(7);
    this.sortVideosByView();
  }

  sortByPopularThisMonth() {
    this.filterByDay(30);
    this.sortVideosByView();
  }

  temp: any = [];
  sortByRecentVideos() {
    this.sortVideosByNewest();
    this.filteredVideos = [];
    this.filteredVideos.push(this.temp[0]);
  }

  sortVideosByNewest() {
    this.temp = [] = this.filteredVideos.sort((n1, n2) => {
      var first = new Date(n1.upload_date);
      var second = new Date(n2.upload_date);
      if (first.getTime() < second.getTime()) {
        return 1;
      } else return -1;
    });
  }

  sortVideosByView() {
    this.filteredVideos = [] = this.filteredVideos.sort((n1, n2) => {
      if (n1.view_count < n2.view_count) {
        return 1;
      } else return -1;
    });
  }

  filteredVideosNew: any = [];
  filterByDay(dayCount: number) {
    this.filteredVideosNew = [];
    var date = new Date();
    for (let i = 0; i < this.filteredVideos.length; i++) {
      const element = this.filteredVideos[i];
      var dbDate = new Date(element.upload_date);
      var differentDate = Math.abs(
        Math.floor((dbDate.getTime() - date.getTime()) / (1000 * 3600 * 24))
      );
      if (differentDate <= dayCount) {
        this.filteredVideosNew.push(element);
      }
    }

    this.filteredVideos = [];
    for (let i = 0; i < this.filteredVideosNew.length; i++) {
      this.filteredVideos.push(this.filteredVideosNew[i]);
    }
  }
}
