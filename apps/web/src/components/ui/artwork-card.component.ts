
import { Component, input, inject, computed, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, FormsModule],
  template: `
    <div class="group cursor-pointer flex flex-col h-full relative" [routerLink]="['/artwork', artwork().id]">
      <div class="relative w-full aspect-[4/5] bg-gray-100 mb-3 overflow-hidden rounded-sm">
        <img 
          [ngSrc]="artwork().imageUrl || artwork().image" 
          [alt]="artwork().title"
          fill
          class="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <!-- Hover Actions Container - Only visible if logged in -->
        @if (auth.currentUser()) {
            <div 
               class="absolute top-2 right-2 flex items-center justify-end z-20" 
               (click)="$event.stopPropagation(); $event.preventDefault()"
               (mouseenter)="isHovered.set(true)" 
               (mouseleave)="isHovered.set(false)"
            >
                <!-- Wrapper for hover visual effect -->
                <div class="flex items-center rounded-full transition-all duration-300" [class.bg-black-10]="isHovered()">
                    
                    <!-- List Button (Hidden by default, reveals on hover) -->
                    <button 
                      (click)="toggleListSelector()"
                      class="h-8 rounded-full bg-white/90 text-gray-500 hover:text-prenda-dark flex items-center justify-center shadow-sm transition-all duration-300 mr-2 overflow-hidden"
                      [class.w-8]="showActions()"
                      [class.w-0]="!showActions()"
                      [class.opacity-100]="showActions()"
                      [class.opacity-0]="!showActions()"
                      [class.mr-2]="showActions()"
                      [class.mr-0]="!showActions()"
                      [class.text-prenda-secondary]="isInAnyList()"
                      title="Guardar en lista"
                    >
                       @if (isInAnyList()) {
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                           <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                         </svg>
                       } @else {
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 8.586 0Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5h.008v.008H12V10.5Z" />
                         </svg>
                       }
                    </button>

                    <!-- Like Button (Always visible) -->
                    <button 
                      (click)="toggleLike()"
                      class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-300 z-10"
                      [class.text-red-500]="isLiked()"
                      [class.text-gray-400]="!isLiked()"
                      title="Me gusta"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" [attr.fill]="isLiked() ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                </div>
            </div>

            <!-- List Selector Overlay -->
            @if (isListSelectorOpen()) {
               <div class="absolute inset-0 bg-white/95 z-30 flex flex-col animate-fade-in" (click)="$event.stopPropagation(); $event.preventDefault()">
                  <!-- Header -->
                  <div class="flex justify-between items-center p-3 border-b border-gray-100">
                     <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Guardar en...</span>
                     <button (click)="isListSelectorOpen.set(false)" class="text-gray-400 hover:text-prenda-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                     </button>
                  </div>
                  
                  <!-- Lists -->
                  <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                     @for (list of userLists(); track list.id) {
                        <button 
                          (click)="toggleList(list.id)"
                          class="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center justify-between group/item transition-colors"
                          [class.bg-gray-50]="isInList(list.id)"
                        >
                           <span class="text-sm text-gray-700 truncate font-medium">{{ list.name }}</span>
                           @if (isInList(list.id)) {
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-prenda-secondary shrink-0 ml-2">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                              </svg>
                           }
                        </button>
                     }
                  </div>

                  <!-- Create New -->
                  <div class="p-3 border-t border-gray-100">
                     <input 
                       type="text" 
                       [(ngModel)]="newListName"
                       (keydown.enter)="createList()"
                       placeholder="Nueva lista..." 
                       class="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-prenda-secondary mb-2"
                     >
                     <button (click)="createList()" class="w-full bg-prenda-dark text-white text-[10px] font-bold uppercase py-2 rounded hover:bg-prenda-primary-dark transition-colors">
                        Crear
                     </button>
                  </div>
               </div>
            }
        }
      </div>
      
      <div class="flex flex-col space-y-0.5">
        <div class="flex justify-between items-start">
           <h3 class="font-semibold text-gray-900 text-sm truncate pr-2 hover:underline">{{ artwork().artistName }}</h3>
        </div>
        
        <p class="text-gray-500 text-xs italic truncate">
          {{ artwork().title }}, {{ artwork().year }}
        </p>
        
        <p class="text-gray-500 text-xs truncate">
          {{ artwork().gallery }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ArtworkCardComponent {
  artwork = input.required<any>(); // Update type if shared type available or use 'any' for now to match detail usage
  auth = inject(AuthService);
  router = inject(Router);

  // Lists stub
  userLists = signal<any[]>([]);

  isHovered = signal(false);
  isListSelectorOpen = signal(false);
  newListName = signal('');

  isLiked = computed(() => {
    const user = this.auth.currentUser();
    const work = this.artwork();
    if (!user || !work) return false;

    // Check if ID is in likedArtworks (array of strings or objects)
    const likedIds = (user as any).likedArtworks || [];
    return likedIds.some((item: any) => (typeof item === 'string' ? item : item.id) === work.id);
  });

  showActions = computed(() => this.isHovered() || this.isListSelectorOpen());

  // Stubbed Lists Logic
  isInAnyList = computed(() => false);

  isInList(listId: string) {
    return false;
  }

  toggleLike() {
    if (!this.auth.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    this.auth.toggleLikeArtwork(this.artwork().id).subscribe();
  }

  toggleListSelector() {
    if (!this.auth.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    // Lists not supported yet
    console.warn('Lists feature coming soon');
  }

  toggleList(listId: string) {
    console.warn('Lists feature coming soon');
  }

  createList() {
    console.warn('Lists feature coming soon');
  }
}
