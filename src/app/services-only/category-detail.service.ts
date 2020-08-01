import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryDetailService {
  constructor() {}

  public musicState: boolean = true;
  public sportState: boolean = false;
  public gamingState: boolean = false;
  public entertainmentState: boolean = false;
  public newsState: boolean = false;
  public travelState: boolean = false;
  public currentName: string = 'Music';
  public currentLogo: string = '../../../assets/category-assets/bxs-music.svg';
}
