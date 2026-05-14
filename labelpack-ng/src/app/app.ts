import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimationService } from './services/animation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private anim: AnimationService) {}
  ngOnInit() {
    this.anim.initPreloader();
    this.anim.initCursor();
    this.anim.initNav();
    this.anim.initMobileMenu();
    this.anim.initTouchDropdown();
  }
}
