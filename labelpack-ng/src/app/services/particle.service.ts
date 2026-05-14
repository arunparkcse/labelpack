import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ParticleService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: any[] = [];
  private mouse = { x: null as number | null, y: null as number | null, radius: 140 };

  init(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.spawn();
    this.bindEvents();
    this.animate();
  }

  private resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  private spawn() {
    this.particles = [];
    const colors = ['rgba(13,53,135,','rgba(26,77,184,','rgba(200,160,70,','rgba(204,28,28,','rgba(0,0,0,'];
    for (let i = 0; i < 80; i++) {
      const c = this.canvas!;
      this.particles.push({
        x: Math.random() * c.width, y: Math.random() * c.height,
        vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
        size: Math.random()*2.5+1,
        color: colors[Math.floor(Math.random()*colors.length)],
        opacity: Math.random()*0.25+0.08
      });
    }
  }

  private animate() {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x!, dy = p.y - this.mouse.y!;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < this.mouse.radius) {
          const f = (this.mouse.radius-dist)/this.mouse.radius;
          p.vx += (dx/dist)*f*0.5; p.vy += (dy/dist)*f*0.5;
        }
      }
      p.vx *= 0.98; p.vy *= 0.98;
      p.vx += (Math.random()-0.5)*0.02; p.vy += (Math.random()-0.5)*0.02;
      const speed = Math.sqrt(p.vx*p.vx+p.vy*p.vy);
      if (speed > 1.5) { p.vx = (p.vx/speed)*1.5; p.vy = (p.vy/speed)*1.5; }
      p.x += p.vx; p.y += p.vy;
      const w = this.canvas!.width, h = this.canvas!.height;
      if (p.x < -10) p.x = w+10; if (p.x > w+10) p.x = -10;
      if (p.y < -10) p.y = h+10; if (p.y > h+10) p.y = -10;
      this.ctx!.beginPath();
      this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI*2);
      this.ctx!.fillStyle = p.color + p.opacity + ')';
      this.ctx!.fill();
    });
    // connect
    const maxDist = 130;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i+1; j < this.particles.length; j++) {
        const dx = this.particles[i].x-this.particles[j].x;
        const dy = this.particles[i].y-this.particles[j].y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < maxDist) {
          this.ctx!.beginPath();
          this.ctx!.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx!.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx!.strokeStyle = 'rgba(13,53,135,'+(1-d/maxDist)*0.12+')';
          this.ctx!.lineWidth = 1;
          this.ctx!.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }

  private bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.particles.forEach(p => {
        if (p.x > this.canvas!.width) p.x = Math.random()*this.canvas!.width;
        if (p.y > this.canvas!.height) p.y = Math.random()*this.canvas!.height;
      });
    });
    this.canvas!.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = this.canvas!.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    this.canvas!.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; });
  }
}
