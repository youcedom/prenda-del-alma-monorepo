
import { Component, inject, computed, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { ArtworkCardComponent } from '../ui/artwork-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-institution-detail',
   standalone: true,
   imports: [CommonModule, NgOptimizedImage, RouterLink, ArtworkCardComponent],
   template: `
    @if (gallery(); as g) {
      <div class="min-h-screen bg-white">
        
        <!-- Hero Section -->
        <div class="relative w-full h-[50vh] md:h-[60vh] bg-gray-900">
           <img 
             [ngSrc]="gallery().imageUrl || gallery().image" 
             fill 
             priority 
             class="object-cover" 
             [alt]="gallery().name"
           />
           <div class="absolute inset-0 flex flex-col justify-end pb-12 px-6 md:px-12 max-w-[1800px] mx-auto">
              <span class="text-white font-bold uppercase tracking-widest text-sm mb-3 bg-prenda-secondary px-3 py-1 w-max rounded">
                {{ g.institutionType ? g.institutionType : (g.type === 'Museum' ? 'Museo / Institución' : 'Galería') }}
              </span>
              <h1 class="text-white font-serif text-5xl md:text-7xl mb-4">{{ g.name }}</h1>
              <div class="flex items-center text-white/90 text-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                   <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                 </svg>
                 <span>{{ g.location }}</span>
              </div>
           </div>
        </div>

        <div class="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
           <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              <!-- Main Content -->
              <div class="lg:col-span-8">
                 <h2 class="font-serif text-3xl mb-6 text-prenda-dark border-b border-gray-100 pb-2">Acerca de</h2>
                 <div class="prose prose-lg text-gray-600 font-light leading-relaxed max-w-none mb-12">
                    <p>{{ g.description }}</p>
                    <p>
                      Con una trayectoria destacada en la escena local e internacional, {{ g.name }} se ha consolidado como un referente para curadores, coleccionistas y amantes del arte. Su programa incluye exposiciones individuales y colectivas que exploran las nuevas narrativas del arte latinoamericano.
                    </p>
                 </div>

                 <!-- Unified Events Section -->
                 @if (events().length > 0) {
                    <div class="mb-16">
                       <h2 class="font-serif text-3xl text-prenda-dark mb-8">
                          {{ g.type === 'Museum' ? 'Exposiciones Actuales' : 'Exposiciones' }}
                       </h2>
                       <div class="flex flex-col gap-8">
                         @for (event of events(); track event.id) {
                           <div [routerLink]="['/event', event.id]" class="bg-gray-50 p-6 md:p-8 rounded-lg border border-gray-100 flex flex-col md:flex-row gap-6 items-start cursor-pointer hover:border-prenda-secondary transition-colors group">
                              <div class="relative w-full md:w-1/3 aspect-video bg-gray-200 shrink-0 overflow-hidden">
                                 <img [ngSrc]="event.image" fill class="object-cover transition-transform duration-500 group-hover:scale-105" [alt]="event.name" />
                              </div>
                              <div class="flex-1">
                                 <span class="text-xs font-bold uppercase tracking-widest text-prenda-secondary mb-1 block">{{ event.type }}</span>
                                 <h3 class="font-serif text-2xl mb-2 text-prenda-dark group-hover:text-prenda-secondary transition-colors">{{ event.name }}</h3>
                                 <p class="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                                    {{ event.description }}
                                 </p>
                                 <div class="text-xs text-gray-500 font-medium mb-4">
                                    {{ event.startDate }} - {{ event.endDate }}
                                 </div>
                                 
                                 <div class="flex gap-4" (click)="$event.stopPropagation()">
                                    @if (currentUser()) {
                                       <div class="relative">
                                          <button 
                                             (click)="toggleEventMenu($event, event.id)"
                                             class="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors border flex items-center gap-2"
                                             [class.bg-prenda-dark]="!getEventStatus(event.id)"
                                             [class.text-white]="!getEventStatus(event.id)"
                                             [class.border-transparent]="!getEventStatus(event.id)"
                                             [class.hover:bg-prenda-primary-dark]="!getEventStatus(event.id)"
                                             [class.bg-white]="getEventStatus(event.id)"
                                             [class.text-prenda-dark]="getEventStatus(event.id)"
                                             [class.border-prenda-dark]="getEventStatus(event.id)"
                                          >
                                             @if (getEventStatus(event.id) === 'going') {
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-prenda-secondary">
                                                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                                                </svg>
                                                Ahí estaré
                                             } @else if (getEventStatus(event.id) === 'interested') {
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-prenda-secondary">
                                                  <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                                                </svg>
                                                Me interesa
                                             } @else {
                                                Asistir
                                             }
                                          </button>

                                          @if (openEventMenuId() === event.id) {
                                             <div class="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-20 animate-fade-in-up">
                                                <button (click)="setEventStatus(event.id, 'going')" class="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center justify-between gap-2" [class.text-prenda-secondary]="getEventStatus(event.id) === 'going'">
                                                   <div class="flex items-center gap-2">
                                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3" [class.opacity-100]="getEventStatus(event.id) === 'going'" [class.opacity-50]="getEventStatus(event.id) !== 'going'">
                                                         <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                                      </svg>
                                                      Ahí estaré
                                                   </div>
                                                   @if(getEventStatus(event.id) === 'going') {
                                                      <span class="text-gray-400 font-normal normal-case">x</span>
                                                   }
                                                </button>
                                                <button (click)="setEventStatus(event.id, 'interested')" class="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center justify-between gap-2" [class.text-prenda-secondary]="getEventStatus(event.id) === 'interested'">
                                                   <div class="flex items-center gap-2">
                                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3" [class.opacity-100]="getEventStatus(event.id) === 'interested'" [class.opacity-50]="getEventStatus(event.id) !== 'interested'">
                                                         <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                                      </svg>
                                                      Me interesa
                                                   </div>
                                                   @if(getEventStatus(event.id) === 'interested') {
                                                      <span class="text-gray-400 font-normal normal-case">x</span>
                                                   }
                                                </button>
                                             </div>
                                          }
                                       </div>
                                    } @else {
                                       <button routerLink="/login" class="text-xs font-bold uppercase tracking-wider text-white bg-prenda-dark px-4 py-2 rounded-full hover:bg-prenda-primary-dark transition-colors">
                                          Asistir
                                       </button>
                                    }
                                 </div>
                              </div>
                           </div>
                         }
                       </div>
                    </div>
                 }

                 <!-- Unified Artworks Section -->
                 <div class="mb-16">
                     <div class="flex justify-between items-center mb-8">
                        <h2 class="font-serif text-3xl text-prenda-dark">
                          {{ g.type === 'Museum' ? 'Colección Destacada' : 'Obras en Archivo' }}
                        </h2>
                        @if (artworks().length > 0 && g.type === 'Gallery') {
                          <a routerLink="/disciplines" class="text-sm font-medium text-prenda-secondary hover:underline">Ver todas</a>
                        }
                     </div>
                     
                     <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                        @for (work of artworks(); track work.id) {
                           <app-artwork-card [artwork]="work"></app-artwork-card>
                        } @empty {
                           <div class="col-span-full py-12 bg-gray-50 text-center rounded-lg">
                              <p class="text-gray-500 italic mb-2">
                                {{ g.type === 'Museum' ? 'No hay obras de la colección digitalizadas actualmente.' : 'No hay obras listadas en línea actualmente.' }}
                              </p>
                           </div>
                        }
                     </div>
                  </div>

              </div>

              <!-- Sidebar Info -->
              <div class="lg:col-span-4 space-y-8">
                 <div class="bg-gray-50 border border-gray-200 p-8 rounded-lg sticky top-24">
                    <h3 class="font-serif text-xl mb-6 text-prenda-dark">Información de Visita</h3>
                    
                    <div class="space-y-6">
                       <div>
                          <h4 class="font-bold text-xs uppercase tracking-wide text-gray-500 mb-1">Dirección</h4>
                          <p class="text-sm text-gray-800">{{ g.location }}</p>
                          <a href="#" class="text-xs text-prenda-secondary hover:underline mt-1 inline-block">Ver en Mapa</a>
                       </div>
                       
                       <div>
                          <h4 class="font-bold text-xs uppercase tracking-wide text-gray-500 mb-1">Horarios</h4>
                          <ul class="text-sm text-gray-800 space-y-1">
                             <li class="flex justify-between"><span>Lun - Vie:</span> <span>10:00 - 18:00</span></li>
                             <li class="flex justify-between"><span>Sáb:</span> <span>11:00 - 19:00</span></li>
                             <li class="flex justify-between text-gray-400"><span>Dom:</span> <span>Cerrado</span></li>
                          </ul>
                       </div>
                       
                       <div>
                          <h4 class="font-bold text-xs uppercase tracking-wide text-gray-500 mb-1">Contacto</h4>
                          <p class="text-sm text-gray-800 mb-1">info&#64;{{ g.id }}.com</p>
                          <p class="text-sm text-gray-800">+52 55 1234 5678</p>
                       </div>
                    </div>

                    <div class="mt-8 pt-8 border-t border-gray-200 space-y-3">
                       
                       <!-- Primary Action: Follow -->
                       @if (currentUser()) {
                         <button 
                           (click)="toggleFollow()"
                           class="w-full py-3 rounded-full font-medium transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                           [class.bg-prenda-dark]="!isFollowed()"
                           [class.text-white]="!isFollowed()"
                           [class.hover:bg-prenda-primary-dark]="!isFollowed()"
                           [class.bg-white]="isFollowed()"
                           [class.text-prenda-dark]="isFollowed()"
                           [class.border]="isFollowed()"
                           [class.border-prenda-dark]="isFollowed()"
                         >
                            @if (isFollowed()) {
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-prenda-secondary">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                              </svg>
                              Siguiendo
                            } @else {
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              Seguir
                            }
                         </button>
                       } @else {
                          <button routerLink="/login" class="w-full bg-prenda-dark text-white py-3 rounded-full font-medium hover:bg-prenda-primary-dark transition-colors uppercase tracking-wider text-xs">
                            Seguir
                         </button>
                       }

                       <!-- Secondary Action: Website -->
                       <button class="w-full bg-white border border-gray-300 text-prenda-dark py-3 rounded-full font-medium hover:border-prenda-dark transition-colors uppercase tracking-wider text-xs">
                          Visitar Sitio Web
                       </button>

                        <!-- Share -->
                       <button class="w-full flex items-center justify-center text-gray-500 hover:text-prenda-dark text-xs uppercase tracking-wider mt-4 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                             <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                          </svg>
                          Compartir
                       </button>

                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    }
  `,
   styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.2s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class InstitutionDetailComponent {
   private route = inject(ActivatedRoute);
   private api = inject(ApiService);
   private auth = inject(AuthService);
   private elementRef = inject(ElementRef);

   // Convert route params observable to a signal
   private params = toSignal(this.route.params);

   galleryId = computed(() => this.params()?.['id']);
   currentUser = this.auth.currentUser;

   // Manage which dropdown is open (by event ID)
   openEventMenuId = signal<string | null>(null);

   // Reactive Gallery Data
   gallery = toSignal(
      this.route.params.pipe(
         switchMap(params => {
            const id = params['id'];
            if (!id) return of(undefined);
            return this.api.getGallery(id).pipe(
               map(doc => {
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     name: doc.name,
                     type: (doc.type as 'Gallery' | 'Museum') || 'Gallery',
                     institutionType: doc.type === 'Museum' ? 'Museo / Institución' : 'Galería',
                     location: doc.location || '',
                     description: doc.description || '',
                     image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
                     imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : ''
                  };
               })
            );
         })
      )
   );

   // Related Artworks (by Gallery ID)
   artworks = toSignal(
      this.route.params.pipe(
         switchMap(params => {
            const id = params['id'];
            if (!id) return of([]);
            return this.api.getArtworks({ 'where[gallery][equals]': id }).pipe(
               map(res => res.docs.map(doc => {
                  const artist = doc.artist as any;
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     title: doc.title,
                     artistId: artist?.id ? String(artist.id) : '',
                     artistName: artist?.name || 'Unknown',
                     gallery: '', // Context is clear
                     year: doc.year || 0,
                     image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
                     imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
                     medium: doc.medium || '',
                     dimensions: doc.dimensions || '',
                     category: doc.category || undefined,
                     description: doc.description || undefined,
                     likes: doc.likes || 0
                  };
               }))
            );
         })
      ),
      { initialValue: [] }
   );

   // Related Events (by Gallery ID)
   events = toSignal(
      this.route.params.pipe(
         switchMap(params => {
            const id = params['id'];
            if (!id) return of([]);
            // Assuming Event has 'gallery' field
            return this.api.getEvents({ 'where[gallery][equals]': id }).pipe(
               map(res => res.docs.map(doc => {
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     name: doc.name,
                     type: doc.type || 'Event',
                     description: doc.description || '',
                     startDate: doc.startDate || '',
                     endDate: doc.endDate || '',
                     image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : ''
                  };
               }))
            );
         })
      ),
      { initialValue: [] }
   );

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

   isFollowed = computed(() => {
      const id = this.galleryId();
      return id ? this.followedGalleryIds().has(id) : false;
   });

   toggleFollow() {
      const id = this.galleryId();
      if (id) {
         this.auth.toggleFollowGallery(id).subscribe();
      }
   }

   // --- Event Attendance Logic (Saved Events) ---

   getEventStatus(eventId: string): 'interested' | undefined {
      const user = this.currentUser();
      if (!user) return undefined;
      const isSaved = (user.savedEvents || []).some((item: any) =>
         (typeof item === 'string' ? item : item.id) === eventId
      );
      return isSaved ? 'interested' : undefined;
   }

   toggleEventMenu(event: MouseEvent, eventId: string) {
      event.stopPropagation();
      if (this.openEventMenuId() === eventId) {
         this.openEventMenuId.set(null);
      } else {
         this.openEventMenuId.set(eventId);
      }
   }

   setEventStatus(eventId: string, status: 'going' | 'interested') {
      // Binary toggleSaveEvent
      this.auth.toggleSaveEvent(eventId).subscribe();
      this.openEventMenuId.set(null);
   }

   @HostListener('document:click', ['$event'])
   onDocumentClick(event: MouseEvent) {
      // Close any open menu if clicking outside
      if (this.openEventMenuId()) {
         this.openEventMenuId.set(null);
      }
   }
}
