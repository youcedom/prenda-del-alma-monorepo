import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { User } from '../types/payload-types';

interface AuthResponse {
    message: string;
    user: User;
    token?: string;
    exp?: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/users';

    readonly currentUser = signal<User | null>(null);

    constructor() {
        this.checkAuth().subscribe();
    }

    // Check if user is already logged in (via cookie)
    checkAuth(): Observable<User | null> {
        return this.http.get<{ user: User }>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
            map(response => response.user),
            tap(user => this.currentUser.set(user || null)),
            catchError(() => {
                this.currentUser.set(null);
                return of(null);
            })
        );
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
            map(response => response.user),
            tap(user => this.currentUser.set(user))
        );
    }

    resetPassword(token: string, password: string): Observable<User> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/reset-password`, { token, password }, { withCredentials: true }).pipe(
            map(response => response.user),
            tap(user => this.currentUser.set(user))
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
            tap(() => this.currentUser.set(null))
        );
    }

    updateProfile(data: Partial<User>): Observable<User> {
        const userId = this.currentUser()?.id;
        if (!userId) return of(null as any);

        return this.http.patch<{ doc: User, message: string }>(`${this.apiUrl}/${userId}`, data, { withCredentials: true }).pipe(
            map(response => response.doc),
            tap(user => this.currentUser.set(user))
        );
    }

    // Interaction Helpers
    private getIds(items: (string | any)[] | undefined | null): string[] {
        if (!items) return [];
        return items.map(item => typeof item === 'string' ? item : item.id);
    }

    private toggleId(currentIds: string[], id: string): string[] {
        const index = currentIds.indexOf(id);
        if (index > -1) {
            return currentIds.filter(i => i !== id);
        } else {
            return [...currentIds, id];
        }
    }

    toggleLikeArtwork(artworkId: string): Observable<User> {
        const user = this.currentUser();
        if (!user) return of(null as any);

        // Cast to any because TS might complain about generated types union if not precise, 
        // but User type should have likedArtworks now.
        const current = this.getIds((user as any).likedArtworks);
        const updated = this.toggleId(current, artworkId);
        return this.updateProfile({ likedArtworks: updated } as any);
    }

    toggleFollowArtist(artistId: string): Observable<User> {
        const user = this.currentUser();
        if (!user) return of(null as any);

        const current = this.getIds((user as any).followedArtists);
        const updated = this.toggleId(current, artistId);
        return this.updateProfile({ followedArtists: updated } as any);
    }

    toggleFollowGallery(galleryId: string): Observable<User> {
        const user = this.currentUser();
        if (!user) return of(null as any);

        const current = this.getIds((user as any).followedGalleries);
        const updated = this.toggleId(current, galleryId);
        return this.updateProfile({ followedGalleries: updated } as any);
    }

    toggleSaveEvent(eventId: string): Observable<User> {
        const user = this.currentUser();
        if (!user) return of(null as any);

        const current = this.getIds((user as any).savedEvents);
        const updated = this.toggleId(current, eventId);
        return this.updateProfile({ savedEvents: updated } as any);
    }
}
