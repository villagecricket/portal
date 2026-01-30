import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatchService } from '../services/match.service';
import { TournamentService } from '@features/tournaments/services/tournament.service';
import { TeamsService } from '@features/teams/services/teams.service';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="match-form-container animate-fade"> 
      <div class="form-wrapper bg-white shadow-sm rounded-4 border p-4">
        <form [formGroup]="matchForm" (ngSubmit)="onSubmit()">
          <div class="row g-4">
            
            <div class="col-md-6">
              <label class="form-label fw-bold">Select Tournament *</label>
              <select formControlName="tournamentId" class="form-select">
                <option value="">-- Choose Tournament --</option>
                <option *ngFor="let t of tournaments()" [value]="t.id">{{ t.name }}</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Venue *</label>
              <input type="text" formControlName="venue" class="form-control" placeholder="Ground Name / City">
            </div>

            <div class="col-md-5">
              <label class="form-label fw-bold">Team 1 *</label>
              <select formControlName="team1Id" class="form-select team-select">
                <option value="">-- Choose Team 1 --</option>
                <option *ngFor="let team of availableTeams()" [value]="team.id">{{ team.name }}</option>
              </select>
            </div>

            <div class="col-md-2 d-flex align-items-end justify-content-center pb-3">
              <div class="vs-circle shadow-sm">VS</div>
            </div>

            <div class="col-md-5">
              <label class="form-label fw-bold">Team 2 *</label>
              <select formControlName="team2Id" class="form-select team-select">
                <option value="">-- Choose Team 2 --</option>
                <option *ngFor="let team of availableTeams()" [value]="team.id">{{ team.name }}</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Match Date & Time *</label>
              <input type="datetime-local" formControlName="date" class="form-control">
            </div>

            <div class="col-md-3">
              <label class="form-label fw-bold">Overs *</label>
              <input type="number" formControlName="oversPerInnings" class="form-control" min="1" max="50">
            </div>

            <div class="col-md-3">
              <label class="form-label fw-bold">Match No.</label>
              <input type="number" formControlName="matchNumber" class="form-control">
            </div>

            <div class="col-md-12 mt-5">
              <div class="d-flex gap-3 justify-content-end">
                <button type="button" class="btn btn-light px-5 py-2 border fw-bold" [routerLink]="['/kkk/match-list']">Cancel</button>
                <button type="submit" class="btn btn-primary px-5 py-2 fw-bold" [disabled]="matchForm.invalid || isSubmitting()">
                  Schedule Match
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .match-form-container { padding: 1rem; max-width: 900px; margin: 0 auto; }
    .page-title { font-weight: 800; letter-spacing: -1px; }
    .vs-circle {
      width: 50px;
      height: 50px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: #94a3b8;
      border: 4px solid white;
    }
    .form-control, .form-select {
      border: 2px solid #e2e8f0;
      padding: 0.75rem;
      border-radius: 10px;
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      }
    }
    .team-select { font-weight: 700; color: #1e293b; }
  `]
})
export class MatchFormComponent implements OnInit {
  matchForm: FormGroup;
  tournaments = signal<any[]>([]);
  availableTeams = signal<any[]>([]);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    private tournamentService: TournamentService,
    private teamService: TeamsService,
    private router: Router
  ) {
    this.matchForm = this.fb.group({
      tournamentId: ['', Validators.required],
      team1Id: ['', Validators.required],
      team2Id: ['', Validators.required],
      date: ['', Validators.required],
      venue: ['', Validators.required],
      oversPerInnings: [20, [Validators.required, Validators.min(1)]],
      matchNumber: [1],
      status: ['Scheduled']
    });
  }

  ngOnInit(): void {
    this.loadTournaments();
    this.loadTeams();
  }

  loadTournaments(): void {
    this.tournamentService.getAll().subscribe((res: any) => {
      this.tournaments.set(res.data?.tournaments || res || []);
    });
  }

  loadTeams(): void {
    this.teamService.getAll().subscribe((res: any) => {
      this.availableTeams.set(res.data?.teams || res || []);
    });
  }

  onSubmit(): void {
    if (this.matchForm.invalid) return;

    const val = this.matchForm.value;
    if (val.team1Id === val.team2Id) {
      alert('Team 1 and Team 2 cannot be the same');
      return;
    }

    this.isSubmitting.set(true);
    const payload = {
      TournamentID: val.tournamentId,
      TeamA_ID: val.team1Id,
      TeamB_ID: val.team2Id,
      MatchDate: val.date,
      Venue: val.venue,
      MatchNumber: val.matchNumber,
      Status: val.status
    };

    this.matchService.create(payload).subscribe({
      next: () => {
        alert('Match scheduled successfully!');
        this.router.navigate(['/kkk/match-list']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
      }
    });
  }
}
