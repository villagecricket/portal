import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gallery-grid',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section id="gallery" class="py-5 bg-dark text-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-warning">{{ title }}</h2>
          <p class="text-white-50">{{ subtitle }}</p>
        </div>

        <div class="row g-2">
          <div class="col-md-3 col-6" *ngFor="let img of items">
            <div class="gallery-item position-relative overflow-hidden rounded cursor-pointer"
              (click)="imageClick.emit(img)">
              <div class="ratio ratio-1x1">
                <img [src]="img.url" class="img-fluid w-100 h-100" style="object-fit: cover;">
              </div>
              <div class="overlay d-flex flex-column align-items-center justify-content-center text-center p-3">
                <h5 class="text-warning mb-1">{{ img.title }}</h5>
                <small class="text-white">{{ img.category }}</small>
              </div>
            </div>
          </div>
          
          <div class="col-12 text-center py-5" *ngIf="items.length === 0">
             <p class="text-white-50">No photos available in the gallery yet.</p>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .gallery-item {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover {
        transform: translateY(-5px);
        .overlay { opacity: 1; }
        img { transform: scale(1.1); }
      }
      img { transition: all 0.5s ease; }
    }
    .overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); opacity: 0; transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
  `]
})
export class GalleryGridComponent {
    @Input() items: any[] = [];
    @Input() title: string = 'Gallery';
    @Input() subtitle: string = 'Frozen moments of pure passion';
    @Output() imageClick = new EventEmitter<any>();
}
