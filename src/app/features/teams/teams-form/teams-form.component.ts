import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, ImageUploadComponent, InputComponent } from '@shared/forms/form-controls';
import { TeamsService } from '../services/teams.service';
import { ToastService } from '@shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams-form',
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent, InputComponent, ButtonComponent],
  templateUrl: './teams-form.component.html',
  styleUrl: './teams-form.component.scss'
})
export class TeamsFormComponent implements OnInit {
  isEdit: boolean = false;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private teamService: TeamsService,
    private toast: ToastService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.InitForm();
    const id = sessionStorage.getItem('TeamID');
    if (id) {
      this.isEdit = true;
      this.getByID(+id);
    }

  }

  getByID(id: number) {
    this.teamService.getById(id).subscribe({
      next: (response: any) => {
        const teams = response?.data?.teams;

        if (!teams) {
          console.warn('No Teams data found');
          return;
        }

        this.form.patchValue({
          TeamID: teams.TeamID,
          Name: teams.Name,
          LogoURL: teams.LogoURL,
          Captain: teams.Captain,
          Founded: teams.Founded,
          OwnerName: teams.OwnerName,
          Contact: teams.Contact,
          Bio: teams.Bio,
          Slogan: teams.Slogan,
          Location: teams.Location,
          Coach: teams.Coach
        });
      },
      error: (error: any) => {
        console.error('Error fetching Teams:', error);
      }
    });

  }

  InitForm() {
    this.form = this.fb.group({
      TeamID: [],
      Name: ['', Validators.required],
      LogoURL: [''],
      Captain: ['', Validators.required],
      Founded: [''],
      OwnerName: [''],
      Contact: [''],
      Bio: [''],
      Slogan: [''],
      Location: [''],
      Coach: ['']
    })
  }


  onSubmit(): void {
    if (this.form.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const teamsData = this.form.getRawValue();
    const payload = new FormData();

    // Handle File upload vs existing string URL
    if (teamsData.LogoURL instanceof File) {
      payload.append('image', teamsData.LogoURL);
    } else if (teamsData.LogoURL && typeof teamsData.LogoURL === 'string') {
      payload.append('LogoURL', teamsData.LogoURL);
    }

    // Append other fields
    Object.keys(teamsData).forEach(key => {
      if (key !== 'LogoURL' && teamsData[key] !== null && teamsData[key] !== undefined) {
        payload.append(key, teamsData[key]);
      }
    });

    const request$ = this.isEdit
      ? this.teamService.update(teamsData.TeamID, payload)
      : this.teamService.create(payload);

    request$.subscribe({
      next: (response: any) => {
        this.toast.success(response?.message || (this.isEdit ? 'Teams updated successfully.' : 'Teams created successfully.'));
        this.router.navigate(['/kkk/teams-list']);
      },
      error: (error) => {
        console.error(this.isEdit ? 'Update failed:' : 'Creation failed:', error);
        this.toast.error(this.isEdit ? 'Failed to update Teams.' : 'Failed to create Teams.');
      }
    });
  }
}
