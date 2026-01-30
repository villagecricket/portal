import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatchService } from '../services/match.service';
import { Match, Ball, Innings, BatsmanScore, BowlerScore } from '../models/match.model';

@Component({
   selector: 'app-scorecard',
   standalone: true,
   imports: [CommonModule, RouterModule],
   template: `
    <div class="scorecard-container animate-fade">
      <!-- Match Header -->
      <div class="match-header-card shadow-sm rounded-4 border mb-4 p-4" *ngIf="match()">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="tournament-tag">Tournament Trophy 2024</span>
          <span class="match-no">Match #{{ match()!.matchNumber }}</span>
        </div>
        
        <div class="score-display d-flex justify-content-between align-items-center mb-3">
          <div class="team-block text-center flex-1">
             <h2 class="team-name">{{ match()!.TeamA?.Name || 'Team A' }}</h2>
             <div class="innings-total">{{ match()!.TeamA_Runs || 0 }}/{{ match()!.TeamA_Wickets || 0 }} ({{ match()!.TeamA_Overs || 0 | number:'1.1-1' }})</div>
          </div>
          <div class="vs-divider">VS</div>
          <div class="team-block text-center flex-1">
             <h2 class="team-name">{{ match()!.TeamB?.Name || 'Team B' }}</h2>
             <div class="innings-total">{{ match()!.TeamB_Runs || 0 }}/{{ match()!.TeamB_Wickets || 0 }} ({{ match()!.TeamB_Overs || 0 | number:'1.1-1' }})</div>
          </div>
        </div>

        <div class="match-info-strip text-center border-top pt-3">
           <span class="venue"><i class="bi bi-geo-alt me-1"></i> {{ match()!.venue }}</span>
           <span class="mx-3 d-none d-md-inline">|</span>
           <span class="result-status fw-bold text-primary">{{ match()!.status === 'Live' ? '🔴 Match is LIVE' : 'Final Result Here' }}</span>
        </div>
      </div>

      <div class="row g-4">
        <!-- Main Scoring Controls (Left) -->
        <div class="col-lg-8" *ngIf="match()!.status === 'Live' || match()!.status === 'Scheduled'">
          <div class="scoring-card shadow-sm bg-white rounded-4 border overflow-hidden mb-4">
            <div class="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
              <h5 class="mb-0">🔴 Scoring Console</h5>
              <div class="current-partnership small">Partnership: 24(18)</div>
            </div>
            
            <div class="card-body p-4">
              <!-- Score buttons -->
              <div class="run-buttons-grid mb-4">
                <button class="run-btn" (click)="addRun(0)">0</button>
                <button class="run-btn" (click)="addRun(1)">1</button>
                <button class="run-btn" (click)="addRun(2)">2</button>
                <button class="run-btn" (click)="addRun(3)">3</button>
                <button class="run-btn highlight" (click)="addRun(4)">4</button>
                <button class="run-btn highlight" (click)="addRun(6)">6</button>
              </div>

              <!-- Extra buttons -->
              <div class="extra-buttons d-flex gap-2 mb-4">
                <button class="btn btn-outline-warning flex-grow-1" (click)="addExtra('Wide')">WIDE</button>
                <button class="btn btn-outline-warning flex-grow-1" (click)="addExtra('NoBall')">NO BALL</button>
                <button class="btn btn-outline-info flex-grow-1" (click)="addExtra('Bye')">BYE / LB</button>
                <button class="btn btn-outline-danger flex-grow-1" (click)="handleWicket()">WICKET!</button>
              </div>

              <!-- Current Batsmen & Bowler -->
              <div class="on-field-stats row g-3 mt-4">
                 <div class="col-md-6">
                    <div class="on-field-card bg-light p-3 rounded-3 border">
                       <label class="small text-muted mb-2 d-block">BATSMEN</label>
                       <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="fw-bold">Batsman 1 *</span>
                          <span class="stats">42 (28)</span>
                       </div>
                       <div class="d-flex justify-content-between align-items-center text-muted">
                          <span class="small">Batsman 2</span>
                          <span class="stats small">15 (12)</span>
                       </div>
                    </div>
                 </div>
                 <div class="col-md-6">
                    <div class="on-field-card bg-light p-3 rounded-3 border">
                       <label class="small text-muted mb-2 d-block">BOWLER</label>
                       <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="fw-bold">Current Bowler</span>
                          <span class="stats">3.4 - 0 - 28 - 2</span>
                       </div>
                       <div class="this-over d-flex gap-2 mt-2">
                          <span class="ball-dot">1</span>
                          <span class="ball-dot">4</span>
                          <span class="ball-dot">0</span>
                          <span class="ball-dot wicket">W</span>
                          <span class="ball-dot">.</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- Ball by Ball Feed -->
          <div class="feed-section shadow-sm bg-white rounded-4 border">
             <div class="p-3 border-bottom fw-bold text-muted">Recent Balls</div>
             <div class="feed-list p-0">
                <div class="feed-item p-3 border-bottom d-flex align-items-center gap-3">
                   <div class="over-num fw-bold text-muted">19.4</div>
                   <div class="ball-desc">Bowler to Batsman, <b>FOUR!</b> Short ball pulled firmly through mid-wicket.</div>
                   <div class="run-bubble ml-auto">4</div>
                </div>
                <div class="feed-item p-3 border-bottom d-flex align-items-center gap-3">
                   <div class="over-num fw-bold text-muted">19.3</div>
                   <div class="ball-desc">Bowler to Batsman, <b>WICKET!</b> Trapped LBW by an inswinging delivery.</div>
                   <div class="run-bubble wicket">W</div>
                </div>
             </div>
          </div>
        </div>

        <!-- Scoreboard Summary (Right) -->
        <div class="col-lg-4">
           <div class="scoreboard-summary sticky-top" style="top: 1.5rem;">
              <div class="bg-white rounded-4 border shadow-sm p-4 mb-4">
                 <h5 class="fw-bold border-bottom pb-2 mb-3">Batting Summary</h5>
                 <table class="table table-sm borderless align-middle mb-0">
                    <thead class="text-muted small">
                       <tr>
                          <th>Batsman</th>
                          <th class="text-end">R</th>
                          <th class="text-end">B</th>
                          <th class="text-end">SR</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td><b>A. Player *</b></td>
                          <td class="text-end">45</td>
                          <td class="text-end">30</td>
                          <td class="text-end">150.0</td>
                       </tr>
                       <tr class="text-muted">
                          <td>B. Player</td>
                          <td class="text-end">12</td>
                          <td class="text-end">15</td>
                          <td class="text-end">80.0</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              <div class="bg-white rounded-4 border shadow-sm p-4">
                 <h5 class="fw-bold border-bottom pb-2 mb-3">Bowling Summary</h5>
                 <table class="table table-sm borderless align-middle mb-0">
                    <thead class="text-muted small">
                       <tr>
                          <th>Bowler</th>
                          <th class="text-end">O</th>
                          <th class="text-end">R</th>
                          <th class="text-end">W</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td><b>X. Bowler</b></td>
                          <td class="text-end">3.4</td>
                          <td class="text-end">28</td>
                          <td class="text-end">2</td>
                       </tr>
                       <tr class="text-muted">
                          <td>Y. Bowler</td>
                          <td class="text-end">4.0</td>
                          <td class="text-end">32</td>
                          <td class="text-end">0</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
   styles: [`
    .scorecard-container { padding: 1rem; }
    .tournament-tag { font-size: 0.8rem; font-weight: 800; color: #64748b; background: #f1f5f9; padding: 4px 12px; border-radius: 20px; }
    .match-no { font-weight: 700; color: #94a3b8; }
    .team-name { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin: 0; }
    .innings-total { font-size: 1.1rem; font-weight: 700; color: #3b82f6; }
    .vs-divider { font-weight: 900; color: #cbd5e1; font-size: 1.25rem; }
    
    .run-buttons-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
    .run-btn { 
       height: 60px; 
       border-radius: 12px; 
       border: 2px solid #e2e8f0; 
       background: #f8fafc; 
       font-weight: 800; 
       font-size: 1.25rem;
       transition: all 0.2s ease;
       &:hover { background: #f1f5f9; border-color: #cbd5e1; }
       &.highlight { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
    }
    .ball-dot { 
       width: 28px; height: 28px; background: #f1f5f9; border-radius: 50%; 
       display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;
       &.wicket { background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; }
    }
    .run-bubble { width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .run-bubble.wicket { background: #ef4444; }
  `]
})
export class ScorecardComponent implements OnInit {
   match = signal<Match | null>(null);
   innings1 = signal<Innings | null>(null);
   innings2 = signal<Innings | null>(null);

   isLive = signal(true);
   currentScore = signal(0);
   currentWickets = signal(0);
   currentOvers = signal(0);
   currentBalls = signal(0);

   constructor(
      private route: ActivatedRoute,
      private matchService: MatchService
   ) { }

   ngOnInit(): void {
      const id = this.route.snapshot.params['id'];
      this.loadMatch(id);
   }

   loadMatch(id: string): void {
      this.matchService.getById(Number(id)).subscribe((res: any) => {
         const m = res.data?.match || res;
         this.match.set(m);

         // Initialize signals from match data
         const curInnings = m.CurrentInnings || 1;
         if (curInnings === 1) {
            this.currentScore.set(m.TeamA_Runs || 0);
            this.currentWickets.set(m.TeamA_Wickets || 0);
            const overs = m.TeamA_Overs || 0;
            this.currentOvers.set(Math.floor(overs));
            this.currentBalls.set(Math.round((overs % 1) * 10));
         } else {
            this.currentScore.set(m.TeamB_Runs || 0);
            this.currentWickets.set(m.TeamB_Wickets || 0);
            const overs = m.TeamB_Overs || 0;
            this.currentOvers.set(Math.floor(overs));
            this.currentBalls.set(Math.round((overs % 1) * 10));
         }
      });
   }

   addRun(count: number): void {
      this.currentScore.update(s => s + count);
      this.updateBall();
      this.syncWithApi();
   }

   addExtra(type: string): void {
      this.currentScore.update(s => s + 1);
      if (type !== 'Wide' && type !== 'NoBall') {
         this.updateBall();
      }
      this.syncWithApi();
   }

   handleWicket(): void {
      this.currentWickets.update(w => w + 1);
      this.updateBall();
      this.syncWithApi();
   }

   updateBall(): void {
      this.currentBalls.update(b => {
         if (b === 5) {
            this.currentOvers.update(o => o + 1);
            return 0;
         }
         return b + 1;
      });
   }

   syncWithApi(): void {
      const m = this.match();
      if (!m) return;

      const oversFloat = parseFloat(`${this.currentOvers()}.${this.currentBalls()}`);
      const payload: any = {
         CurrentInnings: m.CurrentInnings || 1
      };

      if (payload.CurrentInnings === 1) {
         payload.TeamA_Runs = this.currentScore();
         payload.TeamA_Wickets = this.currentWickets();
         payload.TeamA_Overs = oversFloat;
      } else {
         payload.TeamB_Runs = this.currentScore();
         payload.TeamB_Wickets = this.currentWickets();
         payload.TeamB_Overs = oversFloat;
      }

      this.matchService.update(m.id!, payload).subscribe();
   }
}
