import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { TeamsService } from '@features/teams/services/teams.service';
import { ToastService } from '@shared/services/toast.service';
import { ButtonComponent, ImageUploadComponent, InputComponent, SelectComponent, TextareaComponent, DatepickerComponent } from '@shared/forms/form-controls';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-tournament-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ImageUploadComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    TextareaComponent,
    DatepickerComponent
  ],
  templateUrl: './tournament-form.component.html',
  styleUrl: './tournament-form.component.scss'
})
export class TournamentFormComponent implements OnInit {
  tournamentForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);
  availableTeams = signal<any[]>([]);
  selectedTeamIds = signal<number[]>([]);

  tournamentTypes = [
    { label: 'League (Round Robin)', value: 'League' },
    { label: 'Knockout', value: 'Knockout' },
    { label: 'Hybrid (Group + Knockout)', value: 'Hybrid' }
  ];

  tournamentStatuses = [
    { label: 'Upcoming', value: 'Upcoming' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' }
  ];

  private fb = inject(FormBuilder);
  private tournamentService = inject(TournamentService);
  private teamService = inject(TeamsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  constructor() {
    this.tournamentForm = this.fb.group({
      TournamentID: [null],
      Name: ['', Validators.required],
      Description: [''],
      Type: ['League', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Status: ['Upcoming', Validators.required],
      LogoURL: [''],
      BannerURL: [''],
      Location: [''],
      Organizer: [''],
      PrizePool: [''],
      Rules: [''],
      Category: ['']
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loadTournament(id);
    }
  }

  loadTeams(): void {
    this.teamService.getAll().subscribe((res: any) => {
      const teams = res.data?.teams || res || [];
      // Handle image URLs for preview
      teams.forEach((t: any) => {
        if (t.LogoURL && !t.LogoURL.startsWith('http')) {
          t.FullLogoURL = environment.apiUrl + t.LogoURL;
        } else {
          t.FullLogoURL = t.LogoURL || 'assets/logo.jpeg';
        }
      });
      this.availableTeams.set(teams);
    });
  }

  loadTournament(id: string): void {
    this.tournamentService.getById(Number(id)).subscribe((res: any) => {
      const t = res.data?.tournament || res;
      this.tournamentForm.patchValue({
        TournamentID: t.TournamentID,
        Name: t.Name,
        Description: t.Description,
        Type: t.Type,
        StartDate: t.StartDate ? new Date(t.StartDate).toISOString().split('T')[0] : '',
        EndDate: t.EndDate ? new Date(t.EndDate).toISOString().split('T')[0] : '',
        Status: t.Status,
        LogoURL: t.LogoURL,
        BannerURL: t.BannerURL,
        Location: t.Location,
        Organizer: t.Organizer,
        PrizePool: t.PrizePool,
        Rules: t.Rules,
        Category: t.Category
      });
      this.selectedTeamIds.set(t.Teams?.map((team: any) => team.TeamID) || []);
    });
  }

  toggleTeam(id: number): void {
    const current = this.selectedTeamIds();
    if (current.includes(id)) {
      this.selectedTeamIds.set(current.filter(t => t !== id));
    } else {
      this.selectedTeamIds.set([...current, id]);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedTeamIds().includes(id);
  }

  onSubmit(): void {
    if (this.tournamentForm.invalid) {
      this.tournamentForm.markAllAsTouched();
      this.toast.error('Please fill all required fields');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.tournamentForm.getRawValue();
    const payload = new FormData();

    // Handle files
    if (formVal.LogoURL instanceof File) {
      payload.append('logo', formVal.LogoURL);
    } else if (formVal.LogoURL) {
      payload.append('LogoURL', formVal.LogoURL);
    }

    if (formVal.BannerURL instanceof File) {
      payload.append('banner', formVal.BannerURL);
    } else if (formVal.BannerURL) {
      payload.append('BannerURL', formVal.BannerURL);
    }

    // Append other fields
    Object.keys(formVal).forEach(key => {
      if (key !== 'LogoURL' && key !== 'BannerURL' && formVal[key] !== null && formVal[key] !== undefined) {
        payload.append(key, formVal[key]);
      }
    });

    // Append teams
    const teamIds = this.selectedTeamIds();
    if (teamIds.length > 0) {
      // Many-to-many teams are usually handled by sending an array or comma-separated string
      // We'll send it as a JSON string and handle it in the service/backend if needed
      payload.append('teams', JSON.stringify(teamIds));
    }

    const request = this.isEdit
      ? this.tournamentService.update(formVal.TournamentID, payload)
      : this.tournamentService.create(payload);

    request.subscribe({
      next: () => {
        this.toast.success(`Tournament ${this.isEdit ? 'updated' : 'created'} successfully!`);
        this.router.navigate(['/kkk/tournaments-list']);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Failed to save tournament');
        this.isSubmitting.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/kkk/tournaments-list']);
  }
}
