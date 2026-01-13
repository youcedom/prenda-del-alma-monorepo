
import { Component, inject, computed, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-event-detail',
   standalone: true,
   imports: [CommonModule, NgOptimizedImage, RouterLink],
   template: `
    @if (event(); as e) {
      <div class="min-h-screen bg-white">
        
        <!-- Hero Image -->
        <div class="relative w-full h-[50vh] md:h-[60vh] bg-gray-900">
           <img 
             [ngSrc]="e.image" 
             fill
             class="object-cover opacity-70"
             priority
             [alt]="e.name"
           />
           <div class="absolute inset-0 flex flex-col justify-end pb-12 px-6 md:px-12 max-w-[1800px] mx-auto">
              <span class="text-white font-bold uppercase tracking-widest text-sm mb-3 bg-prenda-secondary px-3 py-1 w-max rounded">{{ e.type }}</span>
              <h1 class="text-white font-serif text-5xl md:text-7xl mb-4">{{ e.name }}</h1>
              <div class="flex flex-col md:flex-row md:items-center text-white/90 text-lg space-y-2 md:space-y-0 md:space-x-8">
                 <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0h18M5.25 12h13.5" />
                    </svg>
                    <span>{{ e.startDate | date:'MMM d' }} - {{ e.endDate | date:'MMM d, y' }}</span>
                 </div>
                 <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-4 mr-2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span>{{ e.location }}</span>
                 </div>
              </div>
           </div>
        </div>

        <div class="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
           <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
              
              <!-- Main Description -->
              <div class="lg:col-span-2">
                 <h2 class="font-serif text-3xl mb-6 text-prenda-dark">Sobre el Evento</h2>
                 <div class="prose prose-lg text-gray-600 font-light leading-relaxed">
                    <p>{{ e.description }}</p>
                    <p>
                      Este evento reúne a los exponentes más destacados de la escena artística actual, ofreciendo una plataforma única para el diálogo, la exhibición y el intercambio cultural.
                    </p>
                 </div>

                  <!-- Comments Section -->
                <div class="mt-16 pt-12 border-t border-gray-100">
                   <div class="flex items-center justify-between mb-8">
                     <h3 class="font-serif text-2xl text-prenda-dark">Comentarios</h3>
                     <span class="text-sm text-gray-500">{{ e.comments?.length || 0 }} comentarios</span>
                   </div>
                   
                   <div class="space-y-8 mb-8">
                      @for (comment of e.comments; track comment.id) {
                         <div class="flex gap-4">
                            <img [src]="comment.userAvatar" class="w-10 h-10 rounded-full object-cover shrink-0" alt="">
                            <div>
                               <div class="flex items-baseline gap-2 mb-1">
                                  <span class="font-bold text-gray-900">{{ comment.userName }}</span>
                                  <span class="text-xs text-gray-400">{{ comment.date }}</span>
                               </div>
                               <p class="text-gray-600 leading-relaxed">{{ comment.text }}</p>
                            </div>
                         </div>
                      } @empty {
                         <p class="text-gray-400 italic">No hay comentarios aún. Únete a la conversación.</p>
                      }
                   </div>

                   @if (currentUser()) {
                      <div class="flex gap-4 items-start">
                         <img [src]="currentUser()?.avatar" class="w-10 h-10 rounded-full object-cover shrink-0" alt="">
                         <div class="flex-1">
                            <textarea 
                               rows="3" 
                               placeholder="Comparte tu opinión o pregunta algo..."
                               class="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:border-prenda-secondary focus:ring-1 focus:ring-prenda-secondary/50 transition-all resize-none"
                            ></textarea>
                            <div class="flex justify-end mt-3">
                               <button class="px-6 py-2 bg-prenda-dark text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-prenda-primary-dark transition-colors">Publicar</button>
                            </div>
                         </div>
                      </div>
                   } @else {
                      <div class="bg-gray-50 p-8 rounded-lg text-center border border-gray-100">
                        <h4 class="font-serif text-lg text-prenda-dark mb-2">Participa en la discusión</h4>
                        <p class="text-gray-600 font-light mb-6">Inicia sesión para compartir tus experiencias y preguntas sobre este evento.</p>
                        <a routerLink="/login" class="inline-block px-6 py-3 bg-white border border-gray-300 rounded-full text-xs font-bold uppercase tracking-widest text-prenda-dark hover:border-prenda-dark transition-colors">
                          Iniciar Sesión
                        </a>
                      </div>
                   }
                </div>
              </div>

              <!-- Sidebar Actions -->
              <div class="lg:col-span-1 space-y-6">
                 
                 <div class="bg-gray-50 border border-gray-200 p-8 rounded-lg sticky top-24">
                    <h3 class="font-serif text-xl mb-6 text-prenda-dark">Información de Visita</h3>
                    
                    <div class="space-y-6">
                       <div>
                          <h4 class="font-bold text-xs uppercase tracking-wide text-gray-500 mb-1">Fechas</h4>
                          <p class="text-sm text-gray-800">{{ e.startDate | date:'MMM d' }} - {{ e.endDate | date:'MMM d, y' }}</p>
                          <button class="text-xs text-prenda-secondary hover:underline mt-1 inline-block">Añadir a Calendario</button>
                       </div>

                       <div>
                          <h4 class="font-bold text-xs uppercase tracking-wide text-gray-500 mb-1">Ubicación</h4>
                          <p class="text-sm text-gray-800">{{ e.location }}</p>
                          <a href="#" class="text-xs text-prenda-secondary hover:underline mt-1 inline-block">Ver en Mapa</a>
                       </div>

                       @if (hostGallery(); as host) {
                         <div>
                            <h4 class="font-bold text-xs uppercase tracking-wide text-gray-500 mb-1">Organizado por</h4>
                            <a [routerLink]="[host.type === 'Museum' ? '/museum' : '/gallery', host.id]" class="flex items-center gap-3 mt-2 group">
                               <div class="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                  <img [ngSrc]="host.image" fill class="object-cover" [alt]="host.name">
                               </div>
                               <div>
                                  <p class="text-sm font-medium text-prenda-dark group-hover:text-prenda-secondary transition-colors leading-tight">{{ host.name }}</p>
                                  <p class="text-xs text-gray-500">Ver Perfil</p>
                               </div>
                            </a>
                         </div>
                       }
                    </div>

                    <div class="mt-8 pt-8 border-t border-gray-200 space-y-3">
                       @if (currentUser()) {
                         <!-- Status Selection Dropdown -->
                         <div class="relative" #dropdownWrapper>
                            <button 
                              (click)="toggleMenu()"
                              class="w-full py-3 rounded-full font-medium transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                              [class.bg-prenda-dark]="!currentStatus()"
                              [class.text-white]="!currentStatus()"
                              [class.hover:bg-prenda-primary-dark]="!currentStatus()"
                              [class.bg-white]="currentStatus()"
                              [class.text-prenda-dark]="currentStatus()"
                              [class.border]="currentStatus()"
                              [class.border-prenda-dark]="currentStatus()"
                            >
                               @if (currentStatus() === 'going') {
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-prenda-secondary">
                                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                                    </svg>
                                    Ahí estaré
                               } @else if (currentStatus() === 'interested') {
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-prenda-secondary">
                                      <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                                    </svg>
                                    Me interesa
                               } @else {
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 8.586 0Z" />
                                  </svg>
                                  Asistir
                               }
                            </button>

                            @if (isMenuOpen()) {
                              <div class="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-20 animate-fade-in-up">
                                 <button (click)="toggleStatus('going')" class="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center justify-between gap-2" [class.text-prenda-secondary]="currentStatus() === 'going'">
                                    <div class="flex items-center gap-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" [class.opacity-100]="currentStatus() === 'going'" [class.opacity-50]="currentStatus() !== 'going'">
                                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                      </svg>
                                      Ahí estaré
                                    </div>
                                    @if(currentStatus() === 'going') {
                                        <span class="text-[10px] text-gray-400 font-normal normal-case">Click para quitar</span>
                                    }
                                 </button>
                                 <button (click)="toggleStatus('interested')" class="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center justify-between gap-2" [class.text-prenda-secondary]="currentStatus() === 'interested'">
                                     <div class="flex items-center gap-2">
                                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" [class.opacity-100]="currentStatus() === 'interested'" [class.opacity-50]="currentStatus() !== 'interested'">
                                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                      </svg>
                                      Me interesa
                                     </div>
                                     @if(currentStatus() === 'interested') {
                                        <span class="text-[10px] text-gray-400 font-normal normal-case">Click para quitar</span>
                                    }
                                 </button>
                              </div>
                            }
                         </div>
                       } @else {
                          <button routerLink="/login" class="w-full bg-prenda-dark text-white py-3 rounded-full font-medium hover:bg-prenda-primary-dark transition-colors uppercase tracking-wider text-xs">
                            Asistir
                         </button>
                       }
                       
                       <button class="w-full bg-white border border-gray-300 text-prenda-dark py-3 rounded-full font-medium hover:border-prenda-dark transition-colors uppercase tracking-wider text-xs">
                          Visitar Sitio Web
                       </button>

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
export class EventDetailComponent {
   private route = inject(ActivatedRoute);
   private api = inject(ApiService);
   private auth = inject(AuthService);
   private elementRef = inject(ElementRef);

   @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;

   currentUser = this.auth.currentUser;

   // UI State
   isMenuOpen = signal(false);

   // Reactive Data
   eventData = toSignal(
      this.route.params.pipe(
         switchMap(params => {
            const id = params['id'];
            if (!id) return of(null);
            return this.api.getEvent(id).pipe(
               switchMap(eventDoc => {
                  const galleryVal = eventDoc.gallery as any;
                  // Resolve gallery/host if it's an ID or object
                  if (galleryVal && galleryVal.name) {
                     return of({ event: eventDoc, host: galleryVal });
                  }
                  if (typeof galleryVal === 'string') {
                     return this.api.getGallery(galleryVal).pipe(
                        map(g => ({ event: eventDoc, host: g })),
                        catchError(() => of({ event: eventDoc, host: null }))
                     );
                  }
                  return of({ event: eventDoc, host: null });
               }),
               map(({ event, host }) => {
                  const image = event.image as any;
                  const hostImage = host?.image as any;

                  const adaptedEvent = {
                     id: String(event.id),
                     name: event.name,
                     location: event.location || '',
                     startDate: event.startDate || '',
                     endDate: event.endDate || '',
                     image: image?.url || '',
                     type: event.type || '',
                     description: event.description || '',
                     galleryId: host ? String(host.id) : undefined,
                     comments: [] // Comments not yet in API
                  };

                  const adaptedHost = host ? {
                     id: String(host.id),
                     name: host.name,
                     type: (host.type as 'Gallery' | 'Museum') || 'Gallery',
                     image: hostImage?.url || ''
                  } : undefined;

                  return { event: adaptedEvent, host: adaptedHost };
               })
            );
         })
      )
   );

   event = computed(() => this.eventData()?.event);
   hostGallery = computed(() => this.eventData()?.host);

   // Status Logic (Mapped to Saved Events)
   currentStatus = computed(() => {
      const e = this.event();
      const user = this.currentUser();
      if (!e || !user) return undefined;

      const isSaved = (user.savedEvents || []).some((item: any) =>
         (typeof item === 'string' ? item : item.id) === e.id
      );
      // Backend only supports 'saved', so we map to 'interested' for UI feedback if saved
      return isSaved ? 'interested' : undefined;
   });

   @HostListener('document:click', ['$event'])
   onDocumentClick(event: MouseEvent) {
      if (this.isMenuOpen() && this.dropdownWrapper) {
         if (!this.dropdownWrapper.nativeElement.contains(event.target)) {
            this.isMenuOpen.set(false);
         }
      }
   }

   toggleMenu() {
      this.isMenuOpen.update(v => !v);
   }

   toggleStatus(status: 'going' | 'interested') {
      const e = this.event();
      if (e) {
         // Binary toggle via AuthService
         this.auth.toggleSaveEvent(e.id).subscribe();
         this.isMenuOpen.set(false);
      }
   }
}
