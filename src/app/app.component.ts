import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DJ-TPA-YourJube';

  showSideNav: boolean = false;
  navBarClass: string = 'navbar';

  onDisplayChange(event: boolean) {
    this.showSideNav = event;
  }

  toggleDisplay() {
    this.showSideNav = !this.showSideNav;
  }

  changeNavBarClass() {
    if (this.navBarClass === 'navbar') {
      this.navBarClass = 'navbar-minim';
    } else {
      this.navBarClass = 'navbar';
    }
  }
}
