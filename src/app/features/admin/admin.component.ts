import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Presentation} from '../../model/presentation';
import {NgForm} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  template: `

    <!-- player -->
    <div class="center" *ngIf="items?.length">
      <img [src]="items[counter]"
            class="player-image">
      <div>
        <button class="button"
                (click)="prev()">PREV</button>
        <span class="counter">{{counter + 1}} / {{items.length}}</span>
        <button class="button"
                (click)="next()">NEXT</button>
      </div>
    </div>

    <!-- gallery -->
    <div class="gallery">

      <div class="center">
        <form #f="ngForm" (submit)="addImage(f)">
          <input type="text" placeholder="Add a new image URL" [ngModel] name="tmb">
          <button class="button" type="button" (click)="generateRandomImage()">Generate image</button>
        </form>
      </div>
    <div class="image-container">
    <div class="grid">
        <div class="cell" *ngFor="let item of items; let i = index;">
          <img class="responsive-image"
               [ngClass]="{ 'image-active' : counter === i }"
               [src]="item"
            (click)="updateCounter(i)">
          <span class="icon cursor" (click)="deleteImage(item)"
          title="Remove this image">&#10006;</span>
        </div>
    </div>
    </div>
    </div>
  `,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  items: string[] = [];
  active: string;
  counter = 0;

  constructor(private db: AngularFireDatabase) {
    db.object<Presentation>(environment.presentationRef.root)
      .valueChanges()
      .subscribe((res: Presentation) => {
        this.items = (res && res.images) || [];
        this.counter = (res && res.counter) || 0;
      });
  }

  prev() {
    const total = this.items.length - 1;
    const counter = this.counter > 0 ? this.counter - 1 : total;
    this.updateCounter( counter );
  }

  next() {
    const total = this.items.length - 1;
    const counter = this.counter < total ? this.counter + 1 : 0;
    this.updateCounter( counter );
  }

  addImage(form: NgForm) {
    const url = form.value.tmb;
    this.saveUrl(url);
    form.reset();
  }

  deleteImage(url: string) {
    this.items = this.items.filter(item => item !== url );
    this.db.object( environment.presentationRef.images ).set(this.items);
    if( this.counter > this.items.length - 1) {
      this.updateCounter(this.items.length - 1);
    }
  }

  generateRandomImage() {
    const random = Math.floor(Math.random() * 200);
    const url = `https://i.picsum.photos/id/${random}/600/400.jpg`;
    this.saveUrl( url );
  }

  saveUrl(url: string) {
    this.items = [...this.items, url];
    this.db.object(environment.presentationRef.images).set(this.items);
  }

  updateCounter(counter: number) {
    const counterRef = this.db.object(environment.presentationRef.counter);
    counterRef.set( counter );
  }

}
