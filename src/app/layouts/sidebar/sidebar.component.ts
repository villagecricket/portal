import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatListModule, FormsModule, RouterModule, MatIconModule, MatTooltipModule],

  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() visible = true;

  menuSections = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', route: '/kkk/dashboard', icon: 'dashboard' },
        { label: 'Players', route: '/kkk/players-list', icon: 'people' },
        { label: 'Teams', route: '/kkk/teams-list', icon: 'shield' },
        { label: 'Tournaments', route: '/kkk/tournaments-list', icon: 'emoji_events' },
        { label: 'Matches', route: '/kkk/match-list', icon: 'sports_cricket' },
        { label: 'Auction Session', route: '/kkk/auction-session-list', icon: 'gavel' },
        { label: 'Auction Room', route: '/kkk/auction-room', icon: 'live_tv' },
        { label: 'Settings', route: '/kkk/settings', icon: 'settings' },
      ]
    }
  ];
}
