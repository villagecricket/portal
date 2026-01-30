import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@core/services/settings.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface PollOption {
    id: number;
    text: string;
    votes: number;
}

interface Poll {
    id: number;
    question: string;
    description: string;
    options: PollOption[];
    isActive: boolean;
    endDate: string;
    totalVotes: number;
}

@Component({
    selector: 'app-polling-page',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        MatIconModule,
        MatSnackBarModule
    ],
    template: `
    <div class="polling-container py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold text-center mb-5 gradient-text">Community Polls</h1>
            
            <div *ngIf="loading()" class="text-center py-5">
              <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div *ngIf="!loading() && activePolls().length === 0" class="text-center py-5">
                <mat-icon class="large-icon mb-3">poll</mat-icon>
                <h3>No active polls at the moment</h3>
                <p class="text-muted">Check back later for new community votes!</p>
            </div>

            <div class="poll-list" *ngIf="!loading()">
              <mat-card *ngFor="let poll of activePolls()" class="poll-card mb-4 overflow-hidden">
                <div class="poll-header p-4">
                  <h2 class="h3 mb-2">{{ poll.question }}</h2>
                  <p class="text-muted">{{ poll.description }}</p>
                  <div class="d-flex align-items-center gap-3 mt-3">
                    <span class="badge" [class.bg-success]="poll.isActive" [class.bg-danger]="!poll.isActive">
                        {{ poll.isActive ? 'Active' : 'Expired' }}
                    </span>
                    <small class="text-muted" *ngIf="poll.endDate">
                        Ends on: {{ poll.endDate | date:'mediumDate' }}
                    </small>
                  </div>
                </div>

                <div class="poll-options p-4 bg-light bg-opacity-50">
                  <div *ngFor="let option of poll.options" class="option-wrapper mb-3">
                    <button 
                      class="option-btn d-flex align-items-center justify-content-between p-3"
                      [disabled]="hasVoted(poll.id) || !poll.isActive"
                      (click)="vote(poll.id, option.id)"
                      [class.voted-option]="isVotedOption(poll.id, option.id)"
                    >
                      <span class="option-text">{{ option.text }}</span>
                      <span class="vote-count" *ngIf="hasVoted(poll.id) || !poll.isActive">
                        {{ calculatePercentage(option.votes, poll.totalVotes) }}%
                      </span>
                    </button>
                    
                    <mat-progress-bar 
                      *ngIf="hasVoted(poll.id) || !poll.isActive"
                      mode="determinate" 
                      [value]="calculatePercentage(option.votes, poll.totalVotes)"
                      class="poll-progress"
                    ></mat-progress-bar>
                  </div>
                  
                  <div class="total-votes text-end mt-2 text-muted" *ngIf="hasVoted(poll.id) || !poll.isActive">
                    Total Votes: {{ poll.totalVotes }}
                  </div>
                </div>
              </mat-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .polling-container { min-height: 100vh; background: #f8f9fa; }
    .gradient-text { background: linear-gradient(45deg, #1a73e8, #34a853); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .poll-card { border-radius: 16px; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .option-btn {
      width: 100%; text-align: left; border: 2px solid #e0e0e0;
      background: #fff; border-radius: 12px; transition: all 0.3s;
      &:hover:not(:disabled) { border-color: #1a73e8; background: #f1f7ff; transform: translateX(5px); }
      &:disabled { cursor: default; }
    }
    .voted-option { border-color: #1a73e8; background: #e8f0fe; font-weight: bold; }
    .poll-progress { height: 8px; border-radius: 4px; margin-top: 5px; }
    .large-icon { font-size: 64px; width: 64px; height: 64px; color: #bdbdbd; }
  `]
})
export class PollingPageComponent implements OnInit {
    loading = signal(true);
    activePolls = signal<any[]>([]);
    votedPolls = signal<number[]>([]);

    constructor(
        private settingsService: SettingsService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loadPolls();
        this.loadVotedState();
    }

    loadPolls() {
        this.loading.set(true);
        this.settingsService.getPolls().subscribe({
            next: (res: any) => {
                const polls = res.data?.polls || res || [];
                // Map data to include total votes if not present
                this.activePolls.set(polls.map((p: any) => ({
                    ...p,
                    totalVotes: p.options ? p.options.reduce((acc: number, opt: any) => acc + (opt.votes || 0), 0) : 0
                })));
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadVotedState() {
        const saved = localStorage.getItem('kkk_voted_polls');
        if (saved) {
            this.votedPolls.set(JSON.parse(saved));
        }
    }

    hasVoted(pollId: number): boolean {
        return this.votedPolls().includes(pollId);
    }

    isVotedOption(pollId: number, optionId: number): boolean {
        // This part is harder without backend tracking which option was picked by this user
        // For now we just highlight the poll as voted.
        return false;
    }

    vote(pollId: number, optionId: number) {
        if (this.hasVoted(pollId)) return;

        // Use current user ID or 0 for guest
        const userId = 0;

        this.settingsService.votePoll(pollId, optionId, userId).subscribe({
            next: (res: any) => {
                const updated = [...this.votedPolls(), pollId];
                this.votedPolls.set(updated);
                localStorage.setItem('kkk_voted_polls', JSON.stringify(updated));

                this.snackBar.open('Vote recorded successfully!', 'Close', { duration: 3000 });
                this.loadPolls(); // Refresh to show updated results
            },
            error: (err: any) => {
                this.snackBar.open('Error recording vote. Please try again.', 'Close', { duration: 3000 });
            }
        });
    }

    calculatePercentage(votes: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((votes / total) * 100);
    }
}
