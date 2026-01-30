import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { BaseCrudService } from '@core/services/base-crud.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TournamentService extends BaseCrudService<any> {
    constructor(api: ApiService) {
        super(api, `${environment.apiUrl}/tournaments`);
    }

    getPointsTable(tournamentId: number): Observable<any> {
        return this.api.get(`${environment.apiUrl}/tournaments/${tournamentId}/points-table`);
    }

    getTournamentMatches(tournamentId: number): Observable<any> {
        return this.api.get(`${environment.apiUrl}/tournaments/${tournamentId}/matches`);
    }
}
