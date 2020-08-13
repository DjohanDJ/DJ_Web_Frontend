import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationDetailService {
  constructor() {}

  currentLocation: string = 'Indonesia';

  setCurrentLocation(location: string) {
    this.currentLocation = location;
  }

  getCurrentLocation() {
    return this.currentLocation;
  }
}
