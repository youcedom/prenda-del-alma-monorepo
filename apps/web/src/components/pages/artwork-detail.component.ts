
import { Component, inject, computed, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artwork-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, FormsModule],
  template: `
    @if (artwork(); as work) {
      <div class="pt-8 pb-20 max-w-[1600px] mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          <!-- Image & Main Content Section -->
          <div class="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
             
             <!-- Image Container -->
             <div class="relative w-full aspect-auto min-h-[500px] bg-gray-50 flex items-center justify-center p-8">
               <img 
              [ngSrc]="work.imageUrl || work.image" 
              [alt]="work.title" 
              fill 
              priority
              class="object-contain"
            />
             </div>
             
             <!-- Actions -->
             <div class="flex justify-center mt-6 text-sm text-gray-500">
               <button class="flex items-center hover:text-prenda-dark transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                  Compartir
               </button>
             </div>

             <!-- Post / Description Section -->
             @if (work.description) {
                <div class="mt-16 w-full max-w-4xl text-left self-start">
                   <h3 class="font-serif text-2xl text-prenda-dark mb-6">Sobre la obra</h3>
                   <div class="prose prose-lg text-gray-600 font-light leading-relaxed whitespace-pre-line max-w-none">
                      {{ work.description }}
                   </div>
                </div>
             }

             <!-- Comments Section (Moved here) -->
             <div class="mt-16 pt-12 border-t border-gray-100 w-full max-w-4xl text-left self-start">
                 <h3 class="font-serif text-2xl mb-8 text-prenda-dark">Comentarios</h3>
                 
                 <!-- Comments List -->
                 <div class="space-y-6 mb-8">
                    @for (comment of work.comments; track comment.id) {
                       <div class="flex gap-4">
                          <img [src]="comment.userAvatar" class="w-10 h-10 rounded-full object-cover shrink-0" alt="">
                          <div>
                             <div class="flex items-baseline gap-2 mb-1">
                                <span class="font-bold text-sm text-gray-900">{{ comment.userName }}</span>
                                <span class="text-xs text-gray-400">{{ comment.date }}</span>
                             </div>
                             <p class="text-sm text-gray-600 leading-relaxed">{{ comment.text }}</p>
                          </div>
                       </div>
                    } @empty {
                       <p class="text-sm text-gray-400 italic">Sé el primero en comentar sobre esta obra.</p>
                    }
                 </div>

                 <!-- Comment Input -->
                 @if (currentUser()) {
                    <div class="flex gap-4">
                       <img [src]="currentUser()?.avatar" class="w-10 h-10 rounded-full object-cover shrink-0" alt="">
                       <div class="flex-1">
                          <textarea 
                             rows="3" 
                             placeholder="Agrega un comentario..."
                             class="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-prenda-secondary focus:ring-1 focus:ring-prenda-secondary/50 transition-all resize-none"
                          ></textarea>
                          <div class="flex justify-end mt-2">
                             <button class="px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors uppercase tracking-wider">Publicar</button>
                          </div>
                       </div>
                    </div>
                 }
             </div>
          </div>

          <!-- Details Sidebar -->
          <div class="lg:col-span-5 xl:col-span-4 flex flex-col pt-4">
            
            <!-- Header -->
            <div class="mb-8 pb-8 border-b border-gray-200">
              <h1 class="font-serif text-4xl md:text-5xl text-prenda-dark mb-2 italic leading-tight">{{ work.title }}</h1>
              <a [routerLink]="['/artist', work.artistId]" class="text-xl text-gray-600 hover:text-prenda-secondary transition-colors block">
                {{ work.artistName }}
              </a>
            </div>

            <!-- Details Grid -->
            <div class="space-y-4 text-sm text-gray-600 mb-8">
              <div class="grid grid-cols-3">
                <span class="font-medium text-prenda-dark">Año</span>
                <span class="col-span-2">{{ work.year }}</span>
              </div>
              <div class="grid grid-cols-3">
                <span class="font-medium text-prenda-dark">Medio</span>
                <span class="col-span-2">{{ work.medium }}</span>
              </div>
              <div class="grid grid-cols-3">
                <span class="font-medium text-prenda-dark">Dimensiones</span>
                <span class="col-span-2">{{ work.dimensions }}</span>
              </div>
              <div class="grid grid-cols-3">
                <span class="font-medium text-prenda-dark">Colección</span>
                <span class="col-span-2">{{ work.gallery }}</span>
              </div>
            </div>

            <!-- Library/Social Actions -->
            <div class="mb-12">
               <!-- Stats -->
               <div class="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-red-500 mr-1">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    <span>{{ (work.likes || 0) + (isLiked() ? 1 : 0) }} Me gusta</span>
                  </div>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                    <span>{{ work.comments?.length || 0 }} Comentarios</span>
                  </div>
               </div>

              @if (currentUser()) {
                <div class="space-y-3 relative">
                  <button (click)="toggleLike()" class="w-full border border-gray-300 py-4 rounded-full font-medium hover:border-prenda-secondary hover:text-prenda-secondary transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" [class.fill-current]="isLiked()" [class.text-red-500]="isLiked()" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    {{ isLiked() ? 'Te gusta esta obra' : 'Me gusta' }}
                  </button>
                  
                  <!-- List Button Container with Ref for Click Outside -->
                   <div class="relative" #listManagerContainer>
                      <button 
                        (click)="showListSelector.set(!showListSelector())" 
                        class="w-full py-4 rounded-full font-medium transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2 border"
                        [class.bg-prenda-dark]="!isInAnyList()"
                        [class.text-white]="!isInAnyList()"
                        [class.border-transparent]="!isInAnyList()"
                        [class.hover:bg-prenda-primary-dark]="!isInAnyList()"
                        [class.bg-white]="isInAnyList()"
                        [class.text-prenda-dark]="isInAnyList()"
                        [class.border-prenda-dark]="isInAnyList()"
                      >
                        @if (isInAnyList()) {
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                             <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                           </svg>
                           Guardado en listas
                        } @else {
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 8.586 0Z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5h.008v.008H12V10.5Z" />
                           </svg>
                           Guardar en lista
                        }
                      </button>

                      @if (showListSelector()) {
                        <div class="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-lg p-3 z-20">
                           <p class="text-xs font-bold uppercase text-gray-400 mb-2">Seleccionar Listas</p>
                           <div class="max-h-48 overflow-y-auto custom-scrollbar">
                               @for (list of userLists(); track list.id) {
                                  <button 
                                    (click)="toggleListAssignment(list.id)" 
                                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-sm mb-1 flex justify-between items-center transition-colors"
                                    [class.bg-gray-50]="isArtworkInList(list.id)"
                                  >
                                     <span [class.font-medium]="isArtworkInList(list.id)">{{ list.name }}</span>
                                     @if (isArtworkInList(list.id)) {
                                        <div class="flex items-center text-prenda-secondary">
                                            <span class="text-[10px] uppercase font-bold mr-2">Guardado</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                     } @else {
                                         <span class="text-[10px] uppercase text-gray-300 group-hover:text-gray-400">Añadir</span>
                                     }
                                  </button>
                               }
                           </div>
                           <div class="border-t border-gray-100 my-2 pt-2">
                              <input 
                                type="text" 
                                placeholder="Crear nueva lista..." 
                                #newListInput
                                (keydown.enter)="createNewList(newListInput.value); newListInput.value = ''"
                                class="w-full text-sm border border-gray-200 rounded px-2 py-2 focus:outline-none focus:border-prenda-secondary"
                              >
                           </div>
                        </div>
                      }
                   </div>
                </div>
              } @else {
                 <div class="bg-gray-50 p-6 rounded-lg text-center">
                    <p class="text-sm text-gray-600 mb-4">Ingresa a tu cuenta para guardar esta obra, dar me gusta o participar en la discusión.</p>
                    <a routerLink="/login" class="text-xs font-bold uppercase tracking-widest text-prenda-secondary hover:underline">Iniciar Sesión</a>
                 </div>
              }
            </div>
            
          </div>
        </div>
      </div>
    }
  `
})
export class ArtworkDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private auth = inject(AuthService);

  // Convert route params observable to a signal
  private params = toSignal(this.route.params);

  @ViewChild('listManagerContainer') listContainer!: ElementRef;

  currentUser = this.auth.currentUser;

  // UI State
  showListSelector = signal(false);

  // Reactive Artwork Data
  artwork = toSignal(
    this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        if (!id) return of(undefined);

        return this.api.getArtwork(id).pipe(
          map(doc => {
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
              category: doc.category || '',
              description: doc.description || '',
              likes: doc.likes || 0,
              comments: [] // Comments not yet in backend
            };
          })
        );
      })
    )
  );

  isLiked = computed(() => {
    const work = this.artwork();
    const user = this.currentUser();
    if (!work || !user) return false;

    const likedIds = (user as any).likedArtworks || [];
    return likedIds.some((item: any) => (typeof item === 'string' ? item : item.id) === work.id);
  });

  // Lists feature not yet supported in Backend/AuthService
  userLists = signal<{ id: string, name: string, artworkIds: string[] }[]>([]);

  // Computed to check if current artwork is in ANY user list
  isInAnyList = computed(() => {
    return false; // Stubbed
  });

  toggleLike() {
    const work = this.artwork();
    if (work) this.auth.toggleLikeArtwork(work.id).subscribe();
  }

  isArtworkInList(listId: string) {
    return false;
  }

  toggleListAssignment(listId: string) {
    console.warn('Lists feature coming soon');
  }

  createNewList(name: string) {
    console.warn('Lists feature coming soon');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showListSelector() && this.listContainer) {
      if (!this.listContainer.nativeElement.contains(event.target)) {
        this.showListSelector.set(false);
      }
    }
  }
}
