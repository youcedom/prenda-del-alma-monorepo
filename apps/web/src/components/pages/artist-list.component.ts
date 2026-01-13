
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UiSelectComponent } from '../ui/ui-select.component';
import { UiPaginationComponent } from '../ui/ui-pagination.component';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, RouterLink, UiSelectComponent, UiPaginationComponent],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="pt-16 pb-12 max-w-[1800px] mx-auto px-6 md:px-12 bg-white">
        <h1 class="font-serif text-5xl md:text-6xl mb-4 text-prenda-dark">
          Directorio de Artistas
        </h1>
        <p class="text-xl text-gray-500 font-light max-w-2xl">
          La base de datos definitiva de creadores contemporáneos y colectivos artísticos de América Latina.
        </p>
      </div>

      <div class="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
        <div class="flex flex-col lg:flex-row gap-12">
          
          <!-- Sidebar Filters -->
          <div class="w-full lg:w-64 shrink-0 space-y-8">
            
            <!-- Search -->
            <div>
               <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Buscar</h3>
               <div class="relative">
                 <input 
                   type="text" 
                   [(ngModel)]="searchQuery"
                   (ngModelChange)="onFilterChange()"
                   placeholder="Nombre..." 
                   class="w-full border border-gray-200 rounded-sm py-2.5 px-3 text-sm focus:outline-none focus:border-prenda-dark focus:ring-1 focus:ring-prenda-dark/50"
                 >
               </div>
            </div>

            <!-- Type Filter -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400">Tipo</h3>
                @if (selectedType()) {
                  <button (click)="selectedType.set(null); onFilterChange()" class="text-[10px] text-prenda-secondary hover:underline">
                    Borrar
                  </button>
                }
              </div>
              <div class="space-y-2">
                  <label class="flex items-center space-x-3 cursor-pointer group">
                    <div class="relative flex items-center">
                      <input 
                        type="radio" 
                        name="type" 
                        value="Individual" 
                        [checked]="selectedType() === 'Individual'"
                        (change)="selectedType.set('Individual'); onFilterChange()"
                        class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-prenda-dark checked:bg-prenda-dark transition-all"
                      />
                        <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100">
                        <svg class="h-2.5 w-2.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="8" r="8" />
                        </svg>
                      </div>
                    </div>
                    <span class="text-sm text-gray-600 group-hover:text-prenda-dark transition-colors">Individual</span>
                  </label>
                  <label class="flex items-center space-x-3 cursor-pointer group">
                    <div class="relative flex items-center">
                        <input 
                        type="radio" 
                        name="type" 
                        value="Collective" 
                        [checked]="selectedType() === 'Collective'"
                        (change)="selectedType.set('Collective'); onFilterChange()"
                        class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-prenda-dark checked:bg-prenda-dark transition-all"
                      />
                        <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100">
                        <svg class="h-2.5 w-2.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="8" r="8" />
                        </svg>
                      </div>
                    </div>
                    <span class="text-sm text-gray-600 group-hover:text-prenda-dark transition-colors">Colectivo</span>
                  </label>
              </div>
            </div>

            <!-- Country Filter -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">País</h3>
              <app-ui-select 
                [options]="latamCountries"
                [value]="selectedCountry()"
                placeholder="Todos los países"
                (valueChange)="selectedCountry.set($event); onFilterChange()"
              ></app-ui-select>
            </div>

            <!-- Disciplines Filter -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Disciplina</h3>
              <app-ui-select 
                [options]="availableDisciplines()"
                [value]="selectedDiscipline()"
                placeholder="Todas las disciplinas"
                (valueChange)="selectedDiscipline.set($event); onFilterChange()"
              ></app-ui-select>
            </div>

            <!-- Movements Filter -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Movimiento</h3>
              <app-ui-select 
                [options]="availableMovements()"
                [value]="selectedMovement()"
                placeholder="Todos los movimientos"
                (valueChange)="selectedMovement.set($event); onFilterChange()"
              ></app-ui-select>
            </div>

            <!-- Stats -->
             <div class="pt-6 border-t border-gray-100">
                <div class="text-xs text-gray-500">
                   Mostrando <span class="font-bold text-prenda-dark">{{ filteredArtists().length }}</span> resultados
                </div>
                <button (click)="clearFilters()" class="text-xs text-prenda-secondary hover:underline mt-2" [class.hidden]="!hasActiveFilters()">
                    Limpiar todos los filtros
                </button>
             </div>

          </div>

          <!-- Results Grid -->
          <div class="flex-1">
             @if (paginatedArtists().length > 0) {
               <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                @for (artist of paginatedArtists(); track artist.id) {
                  <div [routerLink]="['/artist', artist.id]" class="group cursor-pointer flex flex-col h-full bg-white transition-colors">
                    <div class="relative w-full aspect-square bg-gray-100 mb-4 overflow-hidden rounded-full md:rounded-sm transition-all duration-500">
                       <img 
                        [ngSrc]="artist.imageUrl || artist.image" 
                        fill 
                        class="object-cover transition-transform duration-700 group-hover:scale-105" 
                        [alt]="artist.name"
                      />
                      
                      <!-- Quick Follow Button -->
                      @if (currentUser()) {
                        <button 
                          (click)="toggleFollow($event, artist.id)"
                          class="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full transition-all duration-300 shadow-sm hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                          [class.opacity-100]="isFollowed(artist.id)"
                          [class.text-prenda-secondary]="isFollowed(artist.id)"
                          [class.text-gray-400]="!isFollowed(artist.id)"
                          title="Seguir artista"
                        >
                           @if (isFollowed(artist.id)) {
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                              </svg>
                           } @else {
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                           }
                        </button>
                      }
                    </div>
                    <div class="text-center md:text-left">
                       <h2 class="font-serif text-xl text-prenda-dark mb-0.5 group-hover:text-prenda-secondary transition-colors">{{ artist.name }}</h2>
                       <p class="text-xs uppercase tracking-wider text-gray-500 mb-2">{{ artist.country }}, {{ artist.birthYear }}</p>
                       <div class="flex flex-wrap justify-center md:justify-start gap-1">
                          @for (disc of artist.disciplines.slice(0, 2); track disc) {
                             <span class="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">{{ disc }}</span>
                          }
                       </div>
                    </div>
                  </div>
                }
              </div>

               <app-ui-pagination
                 [currentPage]="currentPage()"
                 [totalItems]="filteredArtists().length"
                 [pageSize]="pageSize"
                 (pageChange)="currentPage.set($event)"
               ></app-ui-pagination>

             } @else {
               <div class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                  <h3 class="font-medium text-gray-900 mb-1">No se encontraron artistas</h3>
                  <p class="text-sm text-gray-500 mt-2 max-w-sm text-center">Intenta ajustar tus filtros de búsqueda para encontrar lo que buscas.</p>
                  <button (click)="clearFilters()" class="mt-4 text-sm font-medium text-prenda-secondary underline">Limpiar filtros</button>
               </div>
             }
          </div>

        </div>
      </div>
    </div>
  `
})
export class ArtistListComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  currentUser = this.auth.currentUser;

  readonly latamCountries = [
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
    'República Dominicana', 'Ecuador', 'El Salvador', 'Guatemala', 'Haití',
    'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela'
  ];

  searchQuery = signal('');
  selectedCountry = signal<string | null>(null);
  selectedType = signal<'Individual' | 'Collective' | null>(null);
  selectedDiscipline = signal<string | null>(null);
  selectedMovement = signal<string | null>(null);

  currentPage = signal(1);
  readonly pageSize = 20;

  // Fetch full collection for client-side filtering (per implementation plan)
  artists = toSignal(
    this.api.getArtists({ limit: 1000 }).pipe(
      map(res => res.docs.map(doc => {
        const image = doc.image as any;
        return {
          id: String(doc.id),
          name: doc.name,
          country: doc.country || '',
          birthYear: doc.birthYear || 0,
          image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
          imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
          bio: doc.bio || '',
          disciplines: doc.disciplines?.map(d => d.name || '').filter(Boolean) as string[] || [],
          movements: doc.movements?.map(m => m.name || '').filter(Boolean) as string[] || [],
          type: (doc.type as 'Individual' | 'Collective') || 'Individual'
        };
      }))
    ),
    { initialValue: [] }
  );

  // Computed set of followed IDs for efficient lookup
  followedArtistIds = computed(() => {
    const user = this.currentUser();
    const ids = new Set<string>();
    if (user?.followedArtists) {
      user.followedArtists.forEach(item => {
        if (typeof item === 'string') ids.add(item);
        else if (item && typeof item === 'object' && 'id' in item) ids.add(String(item.id));
      });
    }
    return ids;
  });

  availableDisciplines = computed(() => {
    const artists = this.artists();
    const disciplines = new Set<string>();
    artists.forEach(a => a.disciplines.forEach(d => disciplines.add(d)));
    return Array.from(disciplines).sort();
  });

  availableMovements = computed(() => {
    const artists = this.artists();
    const movements = new Set<string>();
    artists.forEach(a => a.movements.forEach(m => movements.add(m)));
    return Array.from(movements).sort();
  });

  hasActiveFilters = computed(() => {
    return this.searchQuery() !== '' ||
      this.selectedCountry() !== null ||
      this.selectedType() !== null ||
      this.selectedDiscipline() !== null ||
      this.selectedMovement() !== null;
  });

  filteredArtists = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const country = this.selectedCountry();
    const type = this.selectedType();
    const discipline = this.selectedDiscipline();
    const movement = this.selectedMovement();

    return this.artists().filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(query) || a.bio.toLowerCase().includes(query);
      const matchesCountry = country ? a.country === country : true;
      const matchesType = type ? a.type === type : true;
      const matchesDiscipline = discipline ? a.disciplines.includes(discipline) : true;
      const matchesMovement = movement ? a.movements.includes(movement) : true;

      return matchesSearch && matchesCountry && matchesType && matchesDiscipline && matchesMovement;
    });
  });

  paginatedArtists = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredArtists().slice(startIndex, startIndex + this.pageSize);
  });

  onFilterChange() {
    this.currentPage.set(1);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCountry.set(null);
    this.selectedDiscipline.set(null);
    this.selectedMovement.set(null);
    this.selectedType.set(null);
    this.currentPage.set(1);
  }

  isFollowed(id: string) {
    return this.followedArtistIds().has(id);
  }

  toggleFollow(event: Event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.auth.toggleFollowArtist(id).subscribe();
  }
}
