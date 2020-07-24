import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  constructor() {}

  currentUser: any = null;

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}