import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from '@core/services/settings.service';
import { inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private titleService = inject(Title);
  title = 'portal';

  ngOnInit() {
    this.settingsService.getAppSettings().subscribe((res: any) => {
      if (res.success && res.data?.settings?.AppName) {
        this.titleService.setTitle(res.data.settings.AppName);
      }
    });
  }

  
}
