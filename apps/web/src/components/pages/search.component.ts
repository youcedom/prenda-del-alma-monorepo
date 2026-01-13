
import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ArtworkCardComponent } from '../ui/artwork-card.component';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map, debounceTime, startWith } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, ArtworkCardComponent],
  template: `
    <div class="min-h-screen bg-white pt-16 pb-24">
      <div class="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <!-- Header -->
        <div class="mb-12 border-b border-gray-100 pb-8">
           <p class="text-sm text-gray-500 uppercase tracking-wide mb-2">Resultados de búsqueda</p>
           <h1 class="font-serif text-4xl md:text-5xl text-prenda-dark break-words">
             @if (query()) {
               "{{ query() }}"
             } @else {
               Explorar
             }
           </h1>
           <p class="text-gray-400 mt-2">
             {{ totalResults() }} resultados encontrados
           </p>
        </div>

        @if (totalResults() === 0 && query()) {
          <div class="py-20 text-center">
             <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
             </div>
             <h3 class="text-xl font-serif text-gray-900 mb-2">Sin resultados</h3>
             <p class="text-gray-500 max-w-md mx-auto">No pudimos encontrar nada que coincida con tu búsqueda. Intenta con otros términos o verifica la ortografía.</p>
          </div>
        }

        <div class="space-y-20">
        
          <!-- Artists -->
          @if (artists().length > 0) {
            <section>
               <div class="flex items-center justify-between mb-8 border-b border-gray-100 pb-2">
                 <h2 class="font-serif text-3xl text-prenda-dark">Artistas</h2>
                 <a routerLink="/artists" class="text-sm font-medium text-prenda-secondary hover:underline">Ver Directorio</a>
               </div>
               <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  @for (artist of artists(); track artist.id) {
                     <div [routerLink]="['/artist', artist.id]" class="group cursor-pointer text-center">
                        <div class="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 border border-gray-100 group-hover:border-prenda-secondary transition-colors">
                           <img [ngSrc]="artist.image" fill class="object-cover transition-transform duration-500 group-hover:scale-105" [alt]="artist.name">
                        </div>
                        <h3 class="font-serif text-lg text-prenda-dark group-hover:text-prenda-secondary transition-colors">{{ artist.name }}</h3>
                        <p class="text-xs text-gray-500 uppercase tracking-wide">{{ artist.country }}</p>
                     </div>
                  }
               </div>
            </section>
          }

          <!-- Artworks -->
          @if (artworks().length > 0) {
            <section>
               <div class="flex items-center justify-between mb-8 border-b border-gray-100 pb-2">
                 <h2 class="font-serif text-3xl text-prenda-dark">Obras</h2>
               </div>
               <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  @for (work of artworks(); track work.id) {
                     <app-artwork-card [artwork]="work"></app-artwork-card>
                  }
               </div>
            </section>
          }

          <!-- Galleries & Museums -->
          @if (galleries().length > 0) {
            <section>
               <div class="flex items-center justify-between mb-8 border-b border-gray-100 pb-2">
                 <h2 class="font-serif text-3xl text-prenda-dark">Galerías y Museos</h2>
               </div>
               <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  @for (g of galleries(); track g.id) {
                     <div [routerLink]="[g.type === 'Museum' ? '/museum' : '/gallery', g.id]" class="group cursor-pointer flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-prenda-secondary transition-colors bg-white">
                        <div class="relative w-20 h-20 shrink-0 bg-gray-100 overflow-hidden rounded-md">
                           <img [ngSrc]="g.image" fill class="object-cover" [alt]="g.name">
                        </div>
                        <div>
                           <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{{ g.type === 'Museum' ? 'Museo' : 'Galería' }}</span>
                           <h3 class="font-serif text-lg text-prenda-dark leading-tight group-hover:text-prenda-secondary transition-colors">{{ g.name }}</h3>
                           <p class="text-xs text-gray-500">{{ g.location }}</p>
                        </div>
                     </div>
                  }
               </div>
            </section>
          }

          <!-- Events -->
          @if (events().length > 0) {
            <section>
               <div class="flex items-center justify-between mb-8 border-b border-gray-100 pb-2">
                 <h2 class="font-serif text-3xl text-prenda-dark">Eventos</h2>
               </div>
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  @for (e of events(); track e.id) {
                     <div [routerLink]="['/event', e.id]" class="group cursor-pointer">
                        <div class="relative w-full aspect-[2/1] bg-gray-100 overflow-hidden rounded-sm mb-3">
                           <img [ngSrc]="e.image" fill class="object-cover transition-transform duration-500 group-hover:scale-105" [alt]="e.name">
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary">{{ e.type }}</span>
                        <h3 class="font-serif text-xl text-prenda-dark group-hover:underline decoration-1 underline-offset-4">{{ e.name }}</h3>
                        <p class="text-sm text-gray-500">{{ e.startDate }} - {{ e.endDate }}</p>
                     </div>
                  }
               </div>
            </section>
          }

          <!-- Articles -->
           @if (articles().length > 0) {
            <section>
               <div class="flex items-center justify-between mb-8 border-b border-gray-100 pb-2">
                 <h2 class="font-serif text-3xl text-prenda-dark">Editorial</h2>
               </div>
               <div class="flex flex-col space-y-6">
                  @for (a of articles(); track a.id) {
                     <div [routerLink]="['/article', a.id]" class="group cursor-pointer flex gap-6 md:items-center">
                        <div class="relative w-32 md:w-48 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden">
                           <img [ngSrc]="a.image" fill class="object-cover transition-transform duration-500 group-hover:scale-105" [alt]="a.title">
                        </div>
                        <div>
                           <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">{{ a.category }}</span>
                           <h3 class="font-serif text-xl md:text-2xl text-prenda-dark group-hover:text-prenda-secondary transition-colors mb-2">{{ a.title }}</h3>
                           <p class="text-sm text-gray-600 line-clamp-2 md:line-clamp-none">{{ a.summary }}</p>
                        </div>
                     </div>
                  }
               </div>
            </section>
          }

        </div>
      </div>
    </div>
  `
})
export class SearchComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  queryParams = toSignal(this.route.queryParams);
  query = computed(() => this.queryParams()?.['q'] || ''); // Keep case for display

  // Reactive Search
  searchResults = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      switchMap(q => {
        if (!q) return of({ artists: [], artworks: [], galleries: [], events: [], articles: [] });

        const term = q; // Payload 'like' handles case insensitivity usually? Or we hope so.

        return forkJoin({
          artists: this.api.getArtists({ 'where[name][like]': term, limit: 5 }),
          artworks: this.api.getArtworks({ 'where[title][like]': term, limit: 12 }), // Title only for now
          galleries: this.api.getGalleries({ 'where[name][like]': term, limit: 6 }),
          events: this.api.getEvents({ 'where[name][like]': term, limit: 6 }),
          articles: this.api.getArticles({ 'where[title][like]': term, limit: 5 })
        }).pipe(
          map(({ artists, artworks, galleries, events, articles }) => {
            return {
              artists: artists.docs.map((doc: any) => ({
                id: String(doc.id),
                name: doc.name,
                country: doc.country || '',
                image: doc.image?.url || ''
              })),
              artworks: artworks.docs.map((doc: any) => ({
                id: String(doc.id),
                title: doc.title,
                artistId: doc.artist?.id,
                artistName: doc.artist?.name,
                image: doc.image?.url || '',
                year: doc.year,
                medium: doc.medium,
                dimensions: doc.dimensions,
                price: doc.price
              })),
              galleries: galleries.docs.map((doc: any) => ({
                id: String(doc.id),
                name: doc.name,
                type: doc.type,
                location: doc.location || '',
                image: doc.image?.url || ''
              })),
              events: events.docs.map((doc: any) => ({
                id: String(doc.id),
                name: doc.name,
                type: doc.type,
                startDate: doc.startDate,
                endDate: doc.endDate,
                image: doc.image?.url || ''
              })),
              articles: articles.docs.map((doc: any) => ({
                id: String(doc.id),
                title: doc.title,
                category: doc.category,
                summary: doc.summary,
                image: doc.image?.url || ''
              }))
            };
          })
        );
      })
    ),
    { initialValue: { artists: [], artworks: [], galleries: [], events: [], articles: [] } }
  );

  artists = computed(() => this.searchResults().artists);
  artworks = computed(() => this.searchResults().artworks);
  galleries = computed(() => this.searchResults().galleries);
  events = computed(() => this.searchResults().events);
  articles = computed(() => this.searchResults().articles);

  totalResults = computed(() => {
    const res = this.searchResults();
    return res.artists.length + res.artworks.length + res.galleries.length + res.events.length + res.articles.length;
  });
}
