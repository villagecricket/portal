import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchService } from '../services/match.service';
import { Match } from '../models/match.model';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="match-list-container animate-fade">
      <div class="header-section mb-4 d-flex justify-content-between align-items-center">
     
        <button class="btn btn-primary btn-lg shadow-sm" [routerLink]="['/kkk/match-form']">
          <i class="bi bi-calendar-plus me-2"></i> Schedule Match
        </button>
      </div>

      <div class="filter-bar mb-4 p-3 bg-white rounded-4 border shadow-sm">
        <div class="d-flex gap-3">
          <button class="btn btn-sm px-4 rounded-pill" [class.btn-dark]="filter() === 'all'" (click)="filter.set('all')">All</button>
          <button class="btn btn-sm px-4 rounded-pill" [class.btn-dark]="filter() === 'Live'" (click)="filter.set('Live')">🔴 Live</button>
          <button class="btn btn-sm px-4 rounded-pill" [class.btn-dark]="filter() === 'Scheduled'" (click)="filter.set('Scheduled')">Upcoming</button>
          <button class="btn btn-sm px-4 rounded-pill" [class.btn-dark]="filter() === 'Completed'" (click)="filter.set('Completed')">Finished</button>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6 col-lg-4" *ngFor="let match of filteredMatches()">
          <div class="match-card shadow-sm" [class.live-border]="match.status === 'Live'">
            <div class="match-header p-3 border-bottom d-flex justify-content-between align-items-center">
              <span class="tournament-name small fw-bold text-muted text-uppercase">T#{{ match.tournamentId }}</span>
              <span class="match-status px-3 py-1 rounded-pill small fw-bold" [class]="match.status.toLowerCase()">
                {{ match.status }}
              </span>
            </div>
            
            <div class="match-body p-4 text-center">
              <div class="d-flex justify-content-between align-items-center gap-3 mb-4">
                <div class="team text-center flex-1">
                  <div class="team-logo-wrapper mb-2">
                    <img [src]="match.TeamA?.LogoURL || 'assets/default-team.png'" class="team-logo">
                  </div>
                  <h6 class="mb-0 fw-bold">{{ match.TeamA?.Name || 'TBD' }}</h6>
                </div>
                
                <div class="vs-badge">VS</div>

                <div class="team text-center flex-1">
                  <div class="team-logo-wrapper mb-2">
                    <img [src]="match?.TeamB?.LogoURL || 'assets/default-team.png'" class="team-logo">
                  </div>
                  <h6 class="mb-0 fw-bold">{{ match?.TeamB?.Name || 'TBD' }}</h6>
                </div>
              </div>

              <div class="match-details mb-4 py-2 border-top border-bottom bg-light bg-opacity-50">
                <div class="small text-muted mb-1"><i class="bi bi-geo-alt me-1"></i> {{ match.venue }}</div>
                <div class="fw-bold">{{ match.date | date:'MMM d, y, h:mm a' }}</div>
              </div>

              <div class="match-actions">
                <button *ngIf="match.status === 'Live'" class="btn btn-danger w-100 py-2 fw-bold pulse-btn" [routerLink]="['/kkk/scorecard', match.id]">
                  GO TO SCORECARD 🔴
                </button>
                <button *ngIf="match.status === 'Scheduled'" class="btn btn-outline-primary w-100 py-2 fw-bold" [routerLink]="['/kkk/scorecard', match.id]">
                  START SCORING
                </button>
                <button *ngIf="match.status === 'Completed'" class="btn btn-dark w-100 py-2 fw-bold" [routerLink]="['/kkk/scorecard', match.id]">
                  VIEW RESULT
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="col-12 text-center py-5" *ngIf="filteredMatches().length === 0">
           <div class="empty-icon text-muted opacity-25" style="font-size: 4rem;"><i class="bi bi-calendar-x"></i></div>
           <h4 class="mt-3">No matches found</h4>
           <p class="text-muted">There are no matches matching your current filter.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title { font-weight: 800; letter-spacing: -1px; }
    .match-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      &:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
    }
    .live-border { border: 2px solid #ef4444 !important; box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
    .match-status {
      &.live { background: #fee2e2; color: #ef4444; }
      &.scheduled { background: #dcfce7; color: #16a34a; }
      &.completed { background: #f1f5f9; color: #64748b; }
    }
    .team-logo-wrapper {
      width: 64px;
      height: 64px;
      margin: 0 auto;
      background: #f8fafc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }
    .team-logo { max-width: 100%; max-height: 100%; object-fit: contain; }
    .vs-badge { 
      font-weight: 900; 
      color: #94a3b8; 
      font-size: 0.8rem;
      padding: 8px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .pulse-btn {
      animation: pulse-red 2s infinite;
    }
    @keyframes pulse-red {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
  `]
})
export class MatchListComponent implements OnInit {
  matches = signal<Match[]>([]);
  filter = signal<'all' | 'Live' | 'Scheduled' | 'Completed'>('all');

  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchService.getAll().subscribe((res: any) => {
      this.matches.set(res.data?.matches || res || []);
    });
  }

  filteredMatches = () => {
    if (this.filter() === 'all') return this.matches();
    return this.matches().filter(m => m.status === this.filter());
  };
}
