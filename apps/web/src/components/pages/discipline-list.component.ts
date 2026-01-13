
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';
import { ArtworkCardComponent } from '../ui/artwork-card.component';
import { UiSelectComponent } from '../ui/ui-select.component';
import { UiPaginationComponent } from '../ui/ui-pagination.component';
import { FormsModule } from '@angular/forms';

// Local interface until backend provides categories
interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

@Component({
  selector: 'app-discipline-list',
  standalone: true,
  imports: [CommonModule, ArtworkCardComponent, UiSelectComponent, UiPaginationComponent, FormsModule],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="pt-16 pb-12 max-w-[1800px] mx-auto px-6 md:px-12 bg-white">
        <h1 class="font-serif text-5xl md:text-6xl mb-4 text-prenda-dark">Archivo de Obras</h1>
        <p class="text-xl text-gray-500 font-light max-w-2xl">
          Explora la colección completa a través de disciplinas, artistas y movimientos.
        </p>
      </div>

      <div class="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
        <div class="flex flex-col lg:flex-row gap-12">
          
          <!-- Sidebar Filters -->
          <div class="w-full lg:w-64 shrink-0 space-y-8">
            
            <!-- Search Filter -->
            <div>
               <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Buscar Obra</h3>
               <div class="relative">
                 <input 
                   type="text" 
                   [(ngModel)]="searchQuery"
                   (ngModelChange)="onFilterChange()"
                   placeholder="Título..." 
                   class="w-full border border-gray-200 rounded-sm py-2.5 px-3 text-sm focus:outline-none focus:border-prenda-dark focus:ring-1 focus:ring-prenda-dark/50"
                 >
               </div>
            </div>

            <!-- Discipline Filter -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Disciplina</h3>
              <div class="space-y-2">
                 <app-ui-select 
                  [options]="availableDisciplines()"
                  [value]="selectedDiscipline()"
                  placeholder="Todas"
                  (valueChange)="selectedDiscipline.set($event); onFilterChange()"
                ></app-ui-select>
              </div>
            </div>

            <!-- Artist Filter -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Artista</h3>
              <app-ui-select 
                [options]="availableArtists()"
                [value]="selectedArtist()"
                placeholder="Todos"
                (valueChange)="selectedArtist.set($event); onFilterChange()"
              ></app-ui-select>
            </div>

            <!-- Stats & Reset -->
             <div class="pt-6 border-t border-gray-100">
                <div class="text-xs text-gray-500 mb-2">
                   Mostrando <span class="font-bold text-prenda-dark">{{ filteredArtworks().length }}</span> obras
                </div>
                <button 
                  (click)="clearFilters()" 
                  class="text-xs text-prenda-secondary hover:underline" 
                  [class.hidden]="!hasActiveFilters()"
                >
                    Limpiar filtros
                </button>
             </div>

          </div>

          <!-- Results Grid -->
          <div class="flex-1">
             @if (paginatedArtworks().length > 0) {
               <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                  @for (work of paginatedArtworks(); track work.id) {
                     <app-artwork-card [artwork]="work"></app-artwork-card>
                  }
               </div>
               
               <app-ui-pagination
                 [currentPage]="currentPage()"
                 [totalItems]="filteredArtworks().length"
                 [pageSize]="pageSize"
                 (pageChange)="currentPage.set($event)"
               ></app-ui-pagination>

             } @else {
               <div class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                  <h3 class="font-medium text-gray-900 mb-1">No se encontraron obras</h3>
                  <p class="text-sm text-gray-500 mt-2">Intenta ajustar tus filtros.</p>
                  <button (click)="clearFilters()" class="mt-4 text-sm font-medium text-prenda-secondary underline">Limpiar filtros</button>
               </div>
             }
          </div>

        </div>
      </div>
    </div>
  `
})

export class DisciplineListComponent {
  private api = inject(ApiService);

  // State Signals
  searchQuery = signal('');
  selectedDiscipline = signal<string | null>(null);
  selectedArtist = signal<string | null>(null);

  // Pagination State
  currentPage = signal(1);
  readonly pageSize = 20;

  // Static Categories (Data from DisciplinesGrid/MockData)
  readonly categories = signal<Category[]>([
    { id: '1', name: 'Pintura', slug: 'pintura', image: 'https://picsum.photos/id/10/500/500' },
    { id: '2', name: 'Fotografía', slug: 'fotografia', image: 'https://picsum.photos/id/16/500/500' },
    { id: '3', name: 'Escultura', slug: 'escultura', image: 'https://picsum.photos/id/24/500/500' },
    { id: '4', name: 'Grabado', slug: 'grabado', image: 'https://picsum.photos/id/34/500/500' },
    { id: '5', name: 'Instalación', slug: 'instalacion', image: 'https://picsum.photos/id/40/500/500' },
    { id: '6', name: 'Video Arte', slug: 'video-arte', image: 'https://picsum.photos/id/48/500/500' },
    { id: '7', name: 'Performance', slug: 'performance', image: 'https://picsum.photos/id/52/500/500' },
    { id: '8', name: 'Dibujo', slug: 'dibujo', image: 'https://picsum.photos/id/60/500/500' }
  ]);

  // Fetch Full Artworks
  artworks = toSignal(
    this.api.getArtworks({ limit: 1000 }).pipe(
      map(res => res.docs.map(doc => {
        const artist = doc.artist as any;
        const gallery = doc.gallery as any;
        const image = doc.image as any;

        return {
          id: String(doc.id),
          title: doc.title,
          artistId: artist?.id ? String(artist.id) : '',
          artistName: artist?.name || 'Unknown',
          gallery: gallery?.name || 'Unknown',
          year: doc.year || 0,
          image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
          imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
          medium: doc.medium || '',
          dimensions: doc.dimensions || '',
          category: doc.category || undefined,
          description: doc.description || undefined,
          likes: doc.likes || 0
        };
      }))
    ),
    { initialValue: [] }
  );

  // Computed Options
  availableDisciplines = computed(() => {
    return this.categories().map(c => c.name);
  });

  availableArtists = computed(() => {
    const artists = new Set<string>();
    this.artworks().forEach(w => artists.add(w.artistName));
    return Array.from(artists).sort();
  });

  // Filter Logic
  filteredArtworks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const discipline = this.selectedDiscipline();
    const artist = this.selectedArtist();

    return this.artworks().filter(work => {
      const matchesSearch = work.title.toLowerCase().includes(query);

      let matchesDiscipline = true;
      if (discipline) {
        const cat = this.categories().find(c => c.name === discipline);
        if (cat) {
          matchesDiscipline = work.category === cat.slug;
        } else {
          matchesDiscipline = false;
        }
      }

      const matchesArtist = artist ? work.artistName === artist : true;

      return matchesSearch && matchesDiscipline && matchesArtist;
    });
  });

  paginatedArtworks = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredArtworks().slice(startIndex, startIndex + this.pageSize);
  });

  hasActiveFilters = computed(() => {
    return this.searchQuery() !== '' || this.selectedDiscipline() !== null || this.selectedArtist() !== null;
  });

  onFilterChange() {
    this.currentPage.set(1);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedDiscipline.set(null);
    this.selectedArtist.set(null);
    this.currentPage.set(1);
  }
}
