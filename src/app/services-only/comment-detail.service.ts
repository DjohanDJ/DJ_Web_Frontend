import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentDetailService {
  constructor() {}

  allComments: any = [];

  setAllComments(allComments: any) {
    this.allComments = allComments;
  }

  getAllComments() {
    return this.allComments;
  }

  sortNewState: boolean = true;
  sortLikeState: boolean = false;

  changeNewState() {
    this.sortNewState = !this.sortNewState;
  }

  changeLikeState() {
    this.sortLikeState = !this.sortLikeState;
  }

  getSortNewState(): boolean {
    return this.sortNewState;
  }

  getSortLikeState(): boolean {
    return this.sortLikeState;
  }
}
