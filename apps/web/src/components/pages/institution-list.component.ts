
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
  selector: 'app-institution-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, RouterLink, UiSelectComponent, UiPaginationComponent],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="pt-16 pb-12 max-w-[1800px] mx-auto px-6 md:px-12">
        <h1 class="font-serif text-5xl md:text-6xl mb-4 text-prenda-dark">Instituciones Culturales</h1>
        <p class="text-xl text-gray-500 font-light max-w-2xl">
          Explora museos, fundaciones, archivos y centros de arte en Latinoamérica.
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

             <!-- Institution Type Filter -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Tipo de Institución</h3>
              <app-ui-select 
                [options]="availableTypes()"
                [value]="selectedType()"
                placeholder="Todos los tipos"
                (valueChange)="selectedType.set($event); onFilterChange()"
              ></app-ui-select>
            </div>

            <!-- Country Filter -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Ubicación</h3>
              <app-ui-select 
                [options]="latamCountries"
                [value]="selectedCountry()"
                placeholder="Todos los países"
                (valueChange)="selectedCountry.set($event); onFilterChange()"
              ></app-ui-select>
            </div>

            <!-- Stats -->
             <div class="pt-6 border-t border-gray-100">
                <div class="text-xs text-gray-500">
                   Mostrando <span class="font-bold text-prenda-dark">{{ filteredMuseums().length }}</span> resultados
                </div>
                 <button (click)="clearFilters()" class="text-xs text-prenda-secondary hover:underline mt-2" [class.hidden]="!hasActiveFilters()">
                    Limpiar filtros
                </button>
             </div>

          </div>

          <!-- Results Grid -->
          <div class="flex-1">
             @if (paginatedMuseums().length > 0) {
               <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                @for (institution of paginatedMuseums(); track institution.id) {
                  <div [routerLink]="['/museum', institution.id]" class="group cursor-pointer flex flex-col h-full hover:bg-gray-50 transition-colors p-4 -ml-4 rounded-lg">
                    <div class="relative w-full aspect-[4/3] bg-gray-100 mb-6 overflow-hidden rounded-sm">
                       <img 
                        [ngSrc]="institution.imageUrl || institution.image" 
                        fill 
                        class="object-cover transition-transform duration-700 group-hover:scale-105" 
                        [alt]="institution.name"
                      />

                      <!-- Quick Follow Button -->
                      @if (currentUser()) {
                        <button 
                          (click)="toggleFollow($event, institution.id)"
                          class="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full transition-all duration-300 shadow-sm hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                          [class.opacity-100]="isFollowed(institution.id)"
                          [class.text-prenda-secondary]="isFollowed(institution.id)"
                          [class.text-gray-400]="!isFollowed(institution.id)"
                          title="Seguir institución"
                        >
                           @if (isFollowed(institution.id)) {
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
                    
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary mb-1 block">
                            {{ institution.institutionType || 'Institución' }}
                        </span>
                        <h2 class="font-serif text-2xl text-prenda-dark mb-1 group-hover:text-prenda-secondary transition-colors">{{ institution.name }}</h2>
                        <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{{ institution.location }}</p>
                        <p class="text-gray-600 font-light text-sm line-clamp-3 mb-4">{{ institution.description }}</p>
                    </div>
                    
                    <button class="mt-auto text-xs font-medium uppercase tracking-wider text-prenda-dark border border-gray-200 py-2 px-4 hover:border-prenda-dark hover:bg-prenda-dark hover:text-white transition-colors w-max rounded-full">
                      Ver Perfil
                    </button>
                  </div>
                }
              </div>

               <app-ui-pagination
                 [currentPage]="currentPage()"
                 [totalItems]="filteredMuseums().length"
                 [pageSize]="pageSize"
                 (pageChange)="currentPage.set($event)"
               ></app-ui-pagination>

             } @else {
               <div class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                  <h3 class="font-medium text-gray-900 mb-1">No se encontraron instituciones</h3>
                  <button (click)="clearFilters()" class="mt-4 text-sm font-medium text-prenda-secondary underline">Limpiar filtros</button>
               </div>
             }
          </div>

        </div>
      </div>
    </div>
  `
})
export class InstitutionListComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  currentUser = this.auth.currentUser;

  searchQuery = signal('');
  selectedCountry = signal<string | null>(null);
  selectedType = signal<string | null>(null);

  // Pagination
  currentPage = signal(1);
  readonly pageSize = 20;

  readonly latamCountries = [
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
    'República Dominicana', 'Ecuador', 'El Salvador', 'Guatemala', 'Haití',
    'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela'
  ];

  galleries = toSignal(
    this.api.getGalleries({ limit: 1000 }).pipe(
      map(res => res.docs.map(doc => {
        const image = doc.image as any;
        return {
          id: String(doc.id),
          name: doc.name,
          location: doc.location || '',
          image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
          imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
          description: doc.description || '',
          type: (doc.type as 'Gallery' | 'Museum') || 'Gallery',
          institutionType: doc.institutionType || ''
        };
      }))
    ),
    { initialValue: [] }
  );

  // Filter for Museums only
  baseInstitutions = computed(() => this.galleries().filter(g => g.type === 'Museum'));

  availableTypes = computed(() => {
    const types = new Set<string>();
    this.baseInstitutions().forEach(i => {
      if (i.institutionType) types.add(i.institutionType);
    });
    return Array.from(types).sort();
  });

  filteredMuseums = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const country = this.selectedCountry();
    const type = this.selectedType();
    const all = this.baseInstitutions();

    return all.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(query) || g.location.toLowerCase().includes(query);
      let matchesCountry = true;
      let matchesType = true;

      if (country) {
        matchesCountry = g.location.includes(country);
      }
      if (type) {
        matchesType = g.institutionType === type;
      }
      return matchesSearch && matchesCountry && matchesType;
    });
  });

  paginatedMuseums = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredMuseums().slice(startIndex, startIndex + this.pageSize);
  });

  // Computed set of followed IDs
  followedGalleryIds = computed(() => {
    const user = this.currentUser();
    const ids = new Set<string>();
    if (user?.followedGalleries) {
      user.followedGalleries.forEach(item => {
        if (typeof item === 'string') ids.add(item);
        else if (item && typeof item === 'object' && 'id' in item) ids.add(String(item.id));
      });
    }
    return ids;
  });

  onFilterChange() {
    this.currentPage.set(1);
  }

  hasActiveFilters = computed(() => {
    return this.searchQuery() !== '' || this.selectedCountry() !== null || this.selectedType() !== null;
  });

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCountry.set(null);
    this.selectedType.set(null);
    this.currentPage.set(1);
  }

  isFollowed(id: string) {
    return this.followedGalleryIds().has(id);
  }

  toggleFollow(event: Event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.auth.toggleFollowGallery(id).subscribe();
  }
}
