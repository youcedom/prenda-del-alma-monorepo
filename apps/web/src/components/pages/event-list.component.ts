
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UiPaginationComponent } from '../ui/ui-pagination.component';

interface FrontendEvent {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  image: string;
  type: string;
  rawDate: string;
  description?: string;
  galleryId?: string;
}

interface EventGroup {
  monthYear: string;
  events: FrontendEvent[];
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, RouterLink, UiPaginationComponent],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="pt-16 pb-12 max-w-[1800px] mx-auto px-6 md:px-12 bg-white">
        <h1 class="font-serif text-5xl md:text-6xl mb-4 text-prenda-dark">Agenda de Arte</h1>
        <p class="text-xl text-gray-500 font-light max-w-2xl">
          Ferias, bienales y exposiciones imperdibles en toda Latinoamérica.
        </p>
      </div>

      <div class="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
        <div class="flex flex-col lg:flex-row gap-12">
          
          <!-- Sidebar Filters -->
          <div class="w-full lg:w-64 shrink-0 space-y-8">
            
            <!-- Search Filter -->
            <div>
               <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Buscar Evento</h3>
               <div class="relative">
                 <input 
                   type="text" 
                   [(ngModel)]="searchQuery"
                   (ngModelChange)="onFilterChange()"
                   placeholder="Nombre, ciudad..." 
                   class="w-full border border-gray-200 rounded-sm py-2.5 px-3 text-sm focus:outline-none focus:border-prenda-dark focus:ring-1 focus:ring-prenda-dark/50"
                 >
               </div>
            </div>

            <!-- Type Filter -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400">Tipo de Evento</h3>
                @if (selectedType()) {
                  <button (click)="selectedType.set(null); onFilterChange()" class="text-[10px] text-prenda-secondary hover:underline">
                    Borrar
                  </button>
                }
              </div>
              
              <div class="space-y-2">
                @for (type of availableTypes(); track type) {
                  <label class="flex items-center space-x-3 cursor-pointer group">
                    <div class="relative flex items-center">
                      <input 
                        type="radio" 
                        name="type" 
                        [value]="type" 
                        [checked]="selectedType() === type"
                        (change)="selectedType.set(type); onFilterChange()"
                        class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-prenda-dark checked:bg-prenda-dark transition-all"
                      />
                      <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100">
                        <svg class="h-2.5 w-2.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                           <circle cx="8" cy="8" r="8" />
                        </svg>
                      </div>
                    </div>
                    <span class="text-sm text-gray-600 group-hover:text-prenda-dark transition-colors">{{ type }}</span>
                  </label>
                }
              </div>
            </div>

             <!-- Stats & Reset -->
             <div class="pt-6 border-t border-gray-100">
                <div class="text-xs text-gray-500 mb-2">
                   Mostrando <span class="font-bold text-prenda-dark">{{ filteredEvents().length }}</span> eventos
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

          <!-- Main Content List -->
          <div class="flex-1 space-y-16">
             
             @if (groupedEvents().length > 0) {
               @for (group of groupedEvents(); track group.monthYear) {
                 <div>
                    <h2 class="font-serif text-3xl text-prenda-dark mb-6 border-b border-gray-200 pb-2">{{ group.monthYear }}</h2>
                    
                    <div class="grid grid-cols-1 gap-6">
                      @for (event of group.events; track event.id) {
                        <div [routerLink]="['/event', event.id]" class="group flex flex-col md:flex-row bg-white border border-gray-100 hover:border-prenda-secondary transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md relative">
                          
                          <!-- Quick Save Button for Desktop (on image) -->
                           @if (currentUser()) {
                               <div class="hidden md:block absolute top-2 right-2 z-10">
                                  <button 
                                    (click)="toggleSave($event, event.id)"
                                    class="p-2 bg-white/90 rounded-full transition-all duration-300 shadow-sm hover:scale-110 opacity-0 group-hover:opacity-100"
                                    [class.opacity-100]="isSaved(event.id)"
                                    [class.text-prenda-secondary]="isSaved(event.id)"
                                    [class.text-gray-400]="!isSaved(event.id)"
                                    title="Agendar evento"
                                  >
                                    @if (isSaved(event.id)) {
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                        <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                                      </svg>
                                    } @else {
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 8.586 0Z" />
                                      </svg>
                                    }
                                  </button>
                               </div>
                           }

                          <!-- Date Column -->
                          <div class="w-full md:w-32 bg-gray-50 flex flex-col justify-center items-center py-4 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                            <span class="text-2xl font-serif text-prenda-dark">{{ event.startDate.split(' ')[1] }}</span>
                            <span class="text-xs font-bold uppercase text-prenda-secondary tracking-widest">{{ event.startDate.split(' ')[0] }}</span>
                          </div>

                          <!-- Content -->
                          <div class="p-6 flex-1 flex flex-col justify-center relative">
                              <!-- Quick Save Button for Mobile (in content area) -->
                             @if (currentUser()) {
                               <div class="md:hidden absolute top-4 right-4">
                                  <button 
                                    (click)="toggleSave($event, event.id)"
                                    class="text-gray-400 hover:text-prenda-secondary transition-colors"
                                    [class.text-prenda-secondary]="isSaved(event.id)"
                                  >
                                    @if (isSaved(event.id)) {
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                        <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                                      </svg>
                                    } @else {
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 8.586 0Z" />
                                      </svg>
                                    }
                                  </button>
                               </div>
                             }

                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pr-8 md:pr-0">
                               <h3 class="font-serif text-2xl text-prenda-dark group-hover:text-prenda-secondary transition-colors">{{ event.name }}</h3>
                               <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 border border-gray-200 px-2 py-1 rounded w-max">{{ event.type }}</span>
                            </div>
                            
                            <div class="flex items-center text-gray-500 text-sm mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                {{ event.location }}
                             </div>
                             
                             <div class="text-xs text-gray-400">
                               Del {{ event.startDate }} al {{ event.endDate }}
                             </div>
                          </div>

                          <!-- Image -->
                          <div class="hidden md:block w-48 shrink-0 relative overflow-hidden bg-gray-100">
                            <img 
                              [ngSrc]="event.imageUrl || event.image" 
                              fill 
                              class="object-cover transition-transform duration-700 group-hover:scale-105" 
                              [alt]="event.name"
                            />
                          </div>
                        </div>
                      }
                    </div>
                 </div>
               }

               <app-ui-pagination
                 [currentPage]="currentPage()"
                 [totalItems]="filteredEvents().length"
                 [pageSize]="pageSize"
                 (pageChange)="currentPage.set($event)"
               ></app-ui-pagination>

             } @else {
               <div class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                  <h3 class="font-medium text-gray-900 mb-1">No se encontraron eventos</h3>
                  <p class="text-sm text-gray-500 mt-2">Intenta ajustar tus criterios de búsqueda.</p>
                  <button (click)="clearFilters()" class="mt-4 text-sm font-medium text-prenda-secondary underline">Limpiar filtros</button>
               </div>
             }

          </div>

        </div>
      </div>
    </div>
  `
})
export class EventListComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  currentUser = this.auth.currentUser;

  // State
  searchQuery = signal('');
  selectedType = signal<string | null>(null);

  // Pagination
  currentPage = signal(1);
  readonly pageSize = 20;

  // Fetch full collection
  events = toSignal(
    this.api.getEvents({ limit: 1000 }).pipe(
      map(res => res.docs.map(doc => {
        const image = doc.image as any;
        return {
          id: String(doc.id),
          name: doc.name,
          location: doc.location || '',
          startDate: doc.startDate || '',
          endDate: doc.endDate || '',
          image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
          imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
          type: doc.type || '',
          rawDate: doc.rawDate || doc.startDate || '',
          description: doc.description || undefined,
          galleryId: typeof doc.gallery === 'object' ? String((doc.gallery as any)?.id) : String(doc.gallery)
        };
      }))
    ),
    { initialValue: [] }
  );

  // Computed set of saved IDs
  savedEventIds = computed(() => {
    const user = this.currentUser();
    const ids = new Set<string>();
    if (user?.savedEvents) {
      user.savedEvents.forEach(item => {
        if (typeof item === 'string') ids.add(item);
        else if (item && typeof item === 'object' && 'id' in item) ids.add(String(item.id));
      });
    }
    return ids;
  });

  // Computed: Available Types
  availableTypes = computed(() => {
    const events = this.events();
    const types = new Set<string>();
    events.forEach(e => types.add(e.type));
    return Array.from(types).sort();
  });

  // Computed: Helpers
  hasActiveFilters = computed(() => {
    return this.searchQuery() !== '' || this.selectedType() !== null;
  });

  // Computed: Filtered Events Sorted by Date
  filteredEvents = computed(() => {
    const type = this.selectedType();
    const query = this.searchQuery().toLowerCase();
    let events = this.events();

    // Type Filter
    if (type) {
      events = events.filter(e => e.type === type);
    }

    // Search Filter
    if (query) {
      events = events.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }

    // Sort by rawDate
    return events.sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
  });

  paginatedEvents = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredEvents().slice(startIndex, startIndex + this.pageSize);
  });

  // Computed: Grouped by Month/Year based on PAGINATED events
  groupedEvents = computed(() => {
    const events = this.paginatedEvents();
    const groups: EventGroup[] = [];

    // Spanish Month Names
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    events.forEach(event => {
      const date = new Date(event.rawDate);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      let group = groups.find(g => g.monthYear === key);
      if (!group) {
        group = { monthYear: key, events: [] };
        groups.push(group);
      }
      group.events.push(event);
    });

    return groups;
  });

  onFilterChange() {
    this.currentPage.set(1);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedType.set(null);
    this.currentPage.set(1);
  }

  isSaved(id: string) {
    return this.savedEventIds().has(id);
  }

  toggleSave(event: Event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.auth.toggleSaveEvent(id).subscribe();
  }
}
