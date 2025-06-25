import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedService {
  private showControllerSubject = new BehaviorSubject<boolean>(false);
  public showController$: Observable<boolean> = this.showControllerSubject.asObservable();

  constructor() { }

  setShowController(show: boolean): void {
    this.showControllerSubject.next(show);
  }

  getShowController(): boolean {
    return this.showControllerSubject.value;
  }
}