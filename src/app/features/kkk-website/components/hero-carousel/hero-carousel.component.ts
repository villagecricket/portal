import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero-carousel',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="hero-section position-relative">
      <div id="heroCarousel" class="carousel slide fade-carousel" data-bs-ride="carousel" data-bs-interval="5000">
        <div class="carousel-indicators" *ngIf="items && items.length > 1">
          <button type="button" data-bs-target="#heroCarousel" 
                  *ngFor="let item of items; let i = index"
                  [attr.data-bs-slide-to]="i" 
                  [class.active]="i === 0"></button>
        </div>

        <div class="carousel-inner">
          <!-- Dynamic Slides -->
          <ng-container *ngIf="items && items.length > 0">
            <div class="carousel-item" *ngFor="let item of items; let i = index" [class.active]="i === 0">
              <div class="overlay"></div>
              <img [src]="item.imageUrl" class="d-block w-100 vh-100" [alt]="item.alt" style="object-fit: cover;">
              <div class="carousel-caption d-none d-md-block slide-up">
                <h1 class="display-1 fw-bold text-uppercase gradient-text">{{ item.title }}</h1>
                <p class="lead fs-3 mb-4">{{ item.description }}</p>
                <button class="btn btn-warning btn-lg rounded-pill px-5 py-3 fw-bold glow-effect"
                  (click)="onAction.emit(item)">{{ actionLabel }}</button>
              </div>
            </div>
          </ng-container>

          <!-- Fallback Slide if empty -->
          <div class="carousel-item active" *ngIf="!items || items.length === 0">
            <div class="overlay"></div>
            <img src="assets/MV_4.jpeg" class="d-block w-100 vh-100" alt="Default Hero" style="object-fit: cover;">
            <div class="carousel-caption d-none d-md-block slide-up">
              <h1 class="display-1 fw-bold text-uppercase gradient-text">Kattur Premier League</h1>
              <p class="lead fs-3 mb-4">The Battle of Champions Returns</p>
              <button class="btn btn-warning btn-lg rounded-pill px-5 py-3 fw-bold glow-effect"
                (click)="onAction.emit({})">Explore More</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .hero-section { height: 100vh; overflow: hidden; background: #000; position: relative; }
    .overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)); z-index: 1; }
    .carousel-item img { filter: brightness(0.7); width: 100%; height: 100vh; object-fit: cover; }
    .carousel-caption { z-index: 2; bottom: 20%; position: absolute; width: 100%; text-align: center; }
    .gradient-text { background: linear-gradient(45deg, #fff, #ffc107); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; display: inline-block; }
    .glow-effect { box-shadow: 0 0 20px rgba(255, 193, 7, 0.4); transition: all 0.3s; }
    .glow-effect:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 193, 7, 0.6); }
    .carousel-item { transition: opacity 0.8s ease-in-out; }
    /* Basic fade transition */
    .carousel-fade .carousel-item { opacity: 0; transition-property: opacity; }
    .carousel-fade .carousel-item.active { opacity: 1; }
  `]
})
export class HeroCarouselComponent {
    @Input() items: any[] = [];
    @Input() actionLabel: string = 'Explore More';
    @Output() onAction = new EventEmitter<any>();
}
