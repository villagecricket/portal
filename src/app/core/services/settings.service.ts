import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private apiUrl = `${environment.apiUrl}/settings`;

    constructor(private http: HttpClient) { }

    // App Settings
    getAppSettings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/app-settings`);
    }

    updateAppSettings(data: any, logoFile?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (logoFile) {
            formData.append('logo', logoFile);
        }
        return this.http.put(`${this.apiUrl}/app-settings`, formData);
    }

    // Gallery
    getGallery(params?: any): Observable<any> {
        return this.http.get(`${this.apiUrl}/gallery`, { params });
    }

    addGalleryImage(data: any, file: File): Observable<any> {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/gallery`, formData);
    }

    updateGalleryImage(id: number, data: any, file?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (file) {
            formData.append('file', file);
        }
        return this.http.put(`${this.apiUrl}/gallery/${id}`, formData);
    }

    deleteGalleryImage(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/gallery/${id}`);
    }

    // Carousel
    getCarousel(): Observable<any> {
        return this.http.get(`${this.apiUrl}/carousel`);
    }

    addCarouselImage(data: any, file: File): Observable<any> {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/carousel`, formData);
    }

    updateCarouselImage(id: number, data: any, file?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (file) {
            formData.append('file', file);
        }
        return this.http.put(`${this.apiUrl}/carousel/${id}`, formData);
    }

    deleteCarouselImage(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/carousel/${id}`);
    }

    // Sponsors
    getSponsors(): Observable<any> {
        return this.http.get(`${this.apiUrl}/sponsors`);
    }

    addSponsor(data: any, file: File): Observable<any> {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/sponsors`, formData);
    }

    updateSponsor(id: number, data: any, file?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (file) {
            formData.append('file', file);
        }
        return this.http.put(`${this.apiUrl}/sponsors/${id}`, formData);
    }

    deleteSponsor(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/sponsors/${id}`);
    }

    // Gallery Categories
    addGalleryCategory(categoryName: string): Observable<any> {
        // In a real app, this might be a separate table
        // For now, we'll just return success and let the frontend update signals
        return new Observable(observer => {
            observer.next({ success: true, category: categoryName });
            observer.complete();
        });
    }

    // Polls
    getPolls(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/polls`);
    }

    createPoll(pollData: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/polls`, pollData);
    }

    votePoll(pollId: number, optionId: number, playerId: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}/polls/${pollId}/vote/${optionId}`, { playerId });
    }

    getPlayers(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/players-master`);
    }

    togglePollStatus(id: number): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/polls/${id}/toggle`, {});
    }

    deletePoll(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/polls/${id}`);
    }
}
