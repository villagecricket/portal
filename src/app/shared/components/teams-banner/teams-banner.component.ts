import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsService } from '@features/teams/services/teams.service';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-teams-banner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="teams-banner-wrapper py-4">
      <div class="container-fluid">
        <div class="banner-scroll d-flex gap-4 overflow-auto no-scrollbar scroll-snap">
          <div class="team-mini-card" *ngFor="let team of teams()">
            <div class="logo-circle">
              <img [src]="team.FullLogoURL" [alt]="team.Name">
            </div>
            <div class="team-info">
              <div class="name">{{ team.Name }}</div>
              <div class="status" *ngIf="team.Captain">Capt: {{ team.Captain }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .teams-banner-wrapper {
      background: #1e293b;
      margin-bottom: 2rem;
      border-radius: 0 0 30px 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .banner-scroll {
      display: flex;
      padding: 0.5rem 1rem;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }
    .team-mini-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: max-content;
      transition: all 0.3s;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        border-color: #f59e0b;
      }
    }
    .logo-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      padding: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .team-info {
      .name {
        color: white;
        font-weight: 700;
        font-size: 0.9rem;
      }
      .status {
        color: #94a3b8;
        font-size: 0.75rem;
        font-weight: 500;
      }
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scroll-snap {
        scroll-snap-type: x mandatory;
    }
  `]
})
export class TeamsBannerComponent implements OnInit {
    teams = signal<any[]>([]);
    private teamService = inject(TeamsService);

    ngOnInit(): void {
        this.teamService.getAll().subscribe({
            next: (res: any) => {
                const data = res.data?.teams || res || [];
                data.forEach((t: any) => {
                    t.FullLogoURL = t.LogoURL ? environment.apiUrl + t.LogoURL : 'assets/logo.jpeg';
                });
                this.teams.set(data);
            }
        });
    }
}
