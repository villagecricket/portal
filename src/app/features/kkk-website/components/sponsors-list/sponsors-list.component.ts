import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sponsors-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section id="sponsors" class="py-5 bg-white">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill">Partners</span>
          <h2 class="fw-bold mb-3">Our Sponsors</h2>
        </div>

        <div class="position-relative">
          <div id="sponsors-scroll" class="d-flex align-items-center gap-5 overflow-auto py-4 no-scrollbar container-fluid"
            style="scroll-behavior: smooth;">
            <div class="sponsor-item text-center flex-shrink-0" *ngFor="let sponsor of items"
              style="min-width: 150px; opacity: 0.7; transition: all 0.3s;">
              <a [href]="sponsor.website" target="_blank" class="text-decoration-none">
                <img [src]="sponsor.logoUrl" class="img-fluid mb-2 grayscale-hover" style="height: 60px; object-fit: contain;">
                <h6 class="fw-bold text-dark mt-2">{{sponsor.name}}</h6>
                <small class="text-muted d-block">{{sponsor.description}}</small>
              </a>
            </div>
            
            <div class="text-center w-100 py-4 text-muted" *ngIf="items.length === 0">
               <em>Partnering with the community...</em>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .grayscale-hover { filter: grayscale(100%); transition: all 0.3s; &:hover { filter: grayscale(0%); transform: scale(1.1); } }
    .sponsor-item:hover { opacity: 1 !important; }
  `]
})
export class SponsorsListComponent {
    @Input() items: any[] = [];
}
