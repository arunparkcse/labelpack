import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { AnimationService } from '../../services/animation.service';
import { ParticleService } from '../../services/particle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements AfterViewInit {
  constructor(private anim: AnimationService, private particles: ParticleService) {}
  ngAfterViewInit() {
    this.anim.initScrollReveal();
    this.anim.initCounters();
    this.anim.initTiltCards();
    this.particles.init("particles-canvas");
  }
}
