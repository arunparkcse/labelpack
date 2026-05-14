import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimationService } from './services/animation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    // Small delay ensures child components (navbar/footer) are in DOM
    setTimeout(() => {
      this.anim.initPreloader();
      this.anim.initCursor();
      this.anim.initNav();
      this.anim.initMobileMenu();
      this.anim.initTouchDropdown();
    }, 0);
  }
}
