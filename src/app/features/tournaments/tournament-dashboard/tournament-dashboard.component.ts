import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { Tournament, PointsTableEntry } from '../models/tournament.model';

@Component({
   selector: 'app-tournament-dashboard',
   standalone: true,
   imports: [CommonModule, RouterModule],
   template: `
    <div class="dashboard-container animate-fade" *ngIf="tournament()">
      <div class="row g-4">
        <!-- Tournament Hero -->
        <div class="col-12">
          <div class="hero-card bg-dark text-white rounded-4 overflow-hidden position-relative p-5">
            <div class="overlay"></div>
            <div class="content position-relative z-1">
               <h1 class="display-5 fw-bold mb-2">{{ tournament()!.name }}</h1>
               <p class="lead opacity-75 mb-4">{{ tournament()!.description }}</p>
               <div class="d-flex gap-4">
                  <div class="stat">
                     <div class="label opacity-50 small text-uppercase">Teams</div>
                     <div class="value fs-4 fw-bold">{{ tournament()!.Teams?.length || tournament()!.teams?.length || 0 }}</div>
                  </div>
                  <div class="stat border-start ps-4">
                     <div class="label opacity-50 small text-uppercase">Status</div>
                     <div class="value fs-4 fw-bold text-success">{{ tournament()!.status }}</div>
                  </div>
                  <div class="stat border-start ps-4">
                     <div class="label opacity-50 small text-uppercase">Dates</div>
                     <div class="value fs-5 fw-bold">{{ tournament()!.startDate | date:'shortDate' }} - {{ tournament()!.endDate | date:'shortDate' }}</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Points Table -->
        <div class="col-lg-8">
           <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div class="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-center">
                 <h5 class="mb-0 fw-bold">Points Table</h5>
                 <button class="btn btn-sm btn-outline-primary">Full Table</button>
              </div>
              <div class="table-responsive">
                 <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                       <tr>
                          <th class="ps-3">Team</th>
                          <th class="text-center">M</th>
                          <th class="text-center">W</th>
                          <th class="text-center">L</th>
                          <th class="text-center">NRR</th>
                          <th class="text-center fw-bold text-primary">Pts</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr *ngFor="let entry of pointsTable()">
                          <td class="ps-3 d-flex align-items-center gap-2">
                             <img [src]="entry.teamLogo || 'assets/logo.jpeg'" class="team-logo-xs">
                             <span class="fw-bold">{{ entry.teamName }}</span>
                          </td>
                          <td class="text-center">{{ entry.matchesPlayed }}</td>
                          <td class="text-center">{{ entry.won }}</td>
                          <td class="text-center">{{ entry.lost }}</td>
                          <td class="text-center" [class.text-danger]="entry.netRunRate < 0">{{ entry.netRunRate }}</td>
                          <td class="text-center fw-bold text-primary">{{ entry.points }}</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <!-- Recent Matches -->
        <div class="col-lg-4">
           <div class="card shadow-sm border-0 rounded-4">
              <div class="card-header bg-white p-3 border-bottom">
                 <h5 class="mb-0 fw-bold">Upcoming Fixtures</h5>
              </div>
              <div class="card-body p-0">
                 <div class="match-mini-row p-3 border-bottom" *ngFor="let match of recentMatches()">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                       <span class="small text-muted">{{ match.date | date:'MMM d, h:mm a' }}</span>
                       <span class="badge bg-light text-dark border">Match {{ match.matchNumber }}</span>
                    </div>
                     <div class="d-flex justify-content-between align-items-center fw-bold">
                        <span>{{ match.TeamA?.Name || 'TBD' }}</span>
                        <span class="text-muted small">vs</span>
                        <span>{{ match.TeamB?.Name || 'TBD' }}</span>
                     </div>
                 </div>
              </div>
              <div class="card-footer bg-white border-0 p-3">
                 <button class="btn btn-light w-100 fw-bold" [routerLink]="['/kkk/match-list']">View All Matches</button>
              </div>
           </div>
        </div>

        <!-- Analytical Insights -->
        <div class="col-12">
            <div class="card shadow-sm border-0 rounded-4 p-4">
                <h5 class="fw-bold mb-4">tournament Insights</h5>
                <div class="row g-4">
                   <div class="col-md-3">
                      <div class="insight-box p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                         <div class="label small text-primary fw-bold text-uppercase">Top Scorer</div>
                         <div class="value fs-4 fw-bold">A. Player (245)</div>
                      </div>
                   </div>
                   <div class="col-md-3">
                      <div class="insight-box p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25">
                         <div class="label small text-success fw-bold text-uppercase">Highest Wickets</div>
                         <div class="value fs-4 fw-bold">B. Bowler (12)</div>
                      </div>
                   </div>
                   <div class="col-md-3">
                      <div class="insight-box p-3 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-25">
                         <div class="label small text-warning fw-bold text-uppercase">Best Economy</div>
                         <div class="value fs-4 fw-bold">C. Spinner (4.2)</div>
                      </div>
                   </div>
                   <div class="col-md-3">
                      <div class="insight-box p-3 rounded-3 bg-info bg-opacity-10 border border-info border-opacity-25">
                         <div class="label small text-info fw-bold text-uppercase">Most Sixes</div>
                         <div class="value fs-4 fw-bold">D. Batter (15)</div>
                      </div>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
   styles: [`
    .dashboard-container { padding: 1.5rem; }
    .hero-card {
      min-height: 250px;
      display: flex;
      align-items: center;
      background-image: url('assets/GJ2026_1.jpeg');
      background-size: cover;
      background-position: center;
    }
    .hero-card .overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%);
    }
    .team-logo-xs { width: 24px; height: 24px; border-radius: 4px; object-fit: contain; }
    .match-mini-row:hover { background: #f8fafc; cursor: pointer; }
    .insight-box { transition: transform 0.2s; &:hover { transform: scale(1.02); } }
  `]
})
export class TournamentDashboardComponent implements OnInit {
   tournament = signal<Tournament | null>(null);
   pointsTable = signal<PointsTableEntry[]>([]);
   recentMatches = signal<any[]>([]);

   constructor(
      private route: ActivatedRoute,
      private tournamentService: TournamentService
   ) { }

   ngOnInit(): void {
      const id = this.route.snapshot.params['id'];
      this.loadDashboardData(id);
   }

   loadDashboardData(id: string): void {
      const tournamentId = Number(id);

      // Fetch Tournament details
      this.tournamentService.getById(tournamentId).subscribe({
         next: (res: any) => {
            this.tournament.set(res.data?.tournament || res);
         },
         error: (err) => console.error('Error loading tournament details', err)
      });

      // Fetch Points Table
      this.tournamentService.getPointsTable(tournamentId).subscribe({
         next: (res: any) => {
            this.pointsTable.set(res.data?.pointsTable || res || []);
         },
         error: (err) => console.error('Error loading points table', err)
      });

      // Fetch Tournament Matches
      this.tournamentService.getTournamentMatches(tournamentId).subscribe({
         next: (res: any) => {
            this.recentMatches.set(res.data?.matches || res || []);
         },
         error: (err) => console.error('Error loading matches', err)
      });
   }
}
