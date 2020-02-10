import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Presentation} from '../../model/presentation';

@Component({
  selector: 'app-admin',
  template: `

    <!-- player -->
    <div class="center">
      <img src="https://i.picsum.photos/id/10/600/400.jpg"
            class="player-image">
      <div>
        <button class="button">PREV</button>
        <span class="counter">1 / 3</span>
        <button class="button">NEXT</button>
      </div>
    </div>

    <!-- gallery -->
    <div class="gallery">

      <div class="center">
      <form #f="ngForm" (submit)="addImage(f.value.tmb)">
        <input type="text" placeholder="Add a new image URL" [ngModel] name="tmb">
        <button class="button" type="button" (click)="generateRandomImage()">Generate image</button>
      </form>
      </div>
    <div class="image-container">
    <div class="grid">
        <div class="cell" *ngFor="let item of items">
          <img class="responsive-image" [src]="item">
          <span class="icon cursor">&#10006;</span>
        </div>
    </div>
    </div>
    </div>
  `,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  items: string[] = [];

  constructor(private db: AngularFireDatabase) {
    db.object<Presentation>('presentation')
      .valueChanges()
      .subscribe((res: Presentation) => {
        this.items = res.images;
      });
  }

  images: string[];

  addImage(tmbUrl: string) {
    console.log(tmbUrl);
    this.items = [...this.items, tmbUrl];
    this.db.object('presentation/images').set(this.items);
  }

  generateRandomImage() {
    const random = Math.floor(Math.random() * 200);
    const url = `https://i.picsum.photos/id/${random}/600/400.jpg`;
    this.addImage( url );
  }

}
