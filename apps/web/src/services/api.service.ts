import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Artist, Artwork, Gallery, Event, Article, PaginatedDocs } from '../types/payload-types';

import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // Artists
    getArtists(params?: any): Observable<PaginatedDocs<Artist>> {
        return this.http.get<PaginatedDocs<Artist>>(`${this.apiUrl}/artists`, { params: { depth: 1, ...params } });
    }

    getArtist(id: string, params?: any): Observable<Artist> {
        return this.http.get<Artist>(`${this.apiUrl}/artists/${id}`, { params: { depth: 1, ...params } });
    }

    // Artworks
    getArtworks(params?: any): Observable<PaginatedDocs<Artwork>> {
        return this.http.get<PaginatedDocs<Artwork>>(`${this.apiUrl}/artworks`, { params: { depth: 1, ...params } });
    }

    getArtwork(id: string, params?: any): Observable<Artwork> {
        return this.http.get<Artwork>(`${this.apiUrl}/artworks/${id}`, { params: { depth: 1, ...params } });
    }

    // Galleries
    getGalleries(params?: any): Observable<PaginatedDocs<Gallery>> {
        return this.http.get<PaginatedDocs<Gallery>>(`${this.apiUrl}/galleries`, { params: { depth: 1, ...params } });
    }

    getGallery(id: string, params?: any): Observable<Gallery> {
        return this.http.get<Gallery>(`${this.apiUrl}/galleries/${id}`, { params: { depth: 1, ...params } });
    }

    // Events
    getEvents(params?: any): Observable<PaginatedDocs<Event>> {
        return this.http.get<PaginatedDocs<Event>>(`${this.apiUrl}/events`, { params: { depth: 1, ...params } });
    }

    getEvent(id: string, params?: any): Observable<Event> {
        return this.http.get<Event>(`${this.apiUrl}/events/${id}`, { params: { depth: 1, ...params } });
    }

    // Articles
    getArticles(params?: any): Observable<PaginatedDocs<Article>> {
        return this.http.get<PaginatedDocs<Article>>(`${this.apiUrl}/articles`, { params: { depth: 1, ...params } });
    }

    getArticle(id: string, params?: any): Observable<Article> {
        return this.http.get<Article>(`${this.apiUrl}/articles/${id}`, { params: { depth: 1, ...params } });
    }
}
