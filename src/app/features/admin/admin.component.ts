import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Presentation} from '../../model/presentation';

@Component({
  selector: 'app-admin',
  template: `

    <!-- player -->
    <div class="center">
      <img [src]="active"
            class="player-image">
      <div>
        <button class="button" 
                (click)="prev()"
                    [disabled]="current < 1">PREV</button>
        <span class="counter">{{current + 1}} / {{items.length}}</span>
        <button class="button"
                (click)="next()"
                [disabled]="current === items.length - 1">NEXT</button>
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
        <div class="cell" *ngFor="let item of items; trackBy: current ">
          <img class="responsive-image" [src]="item"
            (click)="setActive(index)">
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
  current = 0;

  constructor(private db: AngularFireDatabase) {
    db.object<Presentation>('presentation')
      .valueChanges()
      .subscribe((res: Presentation) => {
        this.items = res.images;
        if ( this.items ) {
          this.setActive(0);
        }
      });
  }

  track(index, item) {
    return item ? hero.id : undefined;

  }

  prev() {
    if( this.current > 0 ) {
      this.current -= 1;
      this.setActive(this.current -= 1);
    }
  }

  next() {
    if( this.current <= this.items.length ) {
      this.setActive( this.current += 1);
    }
  }

  setActive(index: number) {
    this.active = this.items[index];
    this.current = index;
  }

  addImage(tmbUrl: string) {
    console.log(tmbUrl);
    this.items = [...this.items, tmbUrl];
    this.db.object('presentation/images').set(this.items);
  }

  deleteImage(url: string) {
    const index = this.items.findIndex(( i => i === url ));
    this.items.splice(index, 1);
    this.db.object( 'presentation/images' ).set(this.items);
  }

  generateRandomImage() {
    const random = Math.floor(Math.random() * 200);
    const url = `https://i.picsum.photos/id/${random}/600/400.jpg`;
    this.addImage( url );
  }

}
