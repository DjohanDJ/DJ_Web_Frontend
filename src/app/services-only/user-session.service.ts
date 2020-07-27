import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  constructor() {}

  currentUser: any = null;
  currentUserInDB: any = null;

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUserDB(user: any) {
    this.currentUserInDB = user;
  }

  getCurrentUserDB() {
    return this.currentUserInDB;
  }
}
