import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { BaseCrudService } from '@core/services/base-crud.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MatchService extends BaseCrudService<any> {
    constructor(api: ApiService) {
        super(api, `${environment.apiUrl}/matches`);
    }

    getLiveScore(matchId: number): Observable<any> {
        return this.api.get(`${environment.apiUrl}/matches/${matchId}/live-score`);
    }

    updateScore(matchId: number, ballData: any): Observable<any> {
        return this.api.post(`${environment.apiUrl}/matches/${matchId}/score`, ballData);
    }

    getInningsData(matchId: number, inningsNumber: number): Observable<any> {
        return this.api.get(`${environment.apiUrl}/matches/${matchId}/innings/${inningsNumber}`);
    }
}
