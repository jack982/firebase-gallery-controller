import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewer',
  template: `
   <div class="bg">
     <img src="https://i.picsum.photos/id/10/600/400.jpg">
   </div>
  `,
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
