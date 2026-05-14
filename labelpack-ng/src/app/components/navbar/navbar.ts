import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements AfterViewInit {
  constructor(private anim: AnimationService, private el: ElementRef) {}

  ngAfterViewInit() {
    // Run after this component's DOM is ready
    setTimeout(() => {
      this.anim.initNav();
      this.anim.initMobileMenu();
      this.anim.initTouchDropdown();
    }, 0);
  }
}
