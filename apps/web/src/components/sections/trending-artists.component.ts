
import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-trending-artists',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <section class="py-16 border-t border-gray-100">
      <div class="max-w-[1800px] mx-auto px-6 md:px-12">
        <div class="flex justify-between items-center mb-8">
           <h2 class="font-serif text-3xl text-gray-900">Últimos artistas en llegar</h2>
           
           <!-- Navigation Arrows -->
           <div class="flex gap-2">
              <button 
                (click)="scroll('left')"
                class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-prenda-dark transition-all text-gray-500 hover:text-prenda-dark focus:outline-none"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                (click)="scroll('right')"
                class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-prenda-dark transition-all text-gray-500 hover:text-prenda-dark focus:outline-none"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
           </div>
        </div>
        
        <div 
          #scrollContainer
          class="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 gap-8 hide-scrollbar snap-x cursor-grab active:cursor-grabbing select-none"
          (mousedown)="onMouseDown($event)"
          (mouseleave)="onMouseLeave()"
          (mouseup)="onMouseUp()"
          (mousemove)="onMouseMove($event)"
        >
          @for (artist of artists(); track artist.id) {
            <div 
              (click)="onCardClick(artist.id)"
              class="flex-shrink-0 w-64 snap-start group relative"
            >
              <!-- Clean Image Container -->
              <div class="relative w-full aspect-[4/5] mb-4 overflow-hidden bg-gray-100 pointer-events-none">
                <img 
                  [ngSrc]="artist.imageUrl || artist.image" 
                  fill
                  class="object-cover transition-transform duration-700 group-hover:scale-105"
                  [alt]="artist.name"
                  draggable="false"
                />
              </div>
              
              <!-- Minimalist Info -->
              <div class="flex flex-col pointer-events-none">
                 <h3 class="font-serif text-xl text-gray-900 leading-tight group-hover:underline decoration-1 underline-offset-4">{{ artist.name }}</h3>
                 <p class="text-xs text-gray-500 mt-1 uppercase tracking-wide">{{ artist.country }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class TrendingArtistsComponent {
  private api = inject(ApiService);
  router = inject(Router);

  artists = toSignal(
    this.api.getArtists({ limit: 10, sort: '-createdAt' }).pipe(
      map(res => res.docs.map(doc => {
        const image = doc.image as any;
        return {
          id: String(doc.id),
          name: doc.name,
          country: doc.country || '',
          image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
          imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
          bio: doc.bio || '',
          // disciplines: doc.disciplines // not used in this view?
          // type: doc.type 
        };
      }))
    ),
    { initialValue: [] }
  );

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  isDown = false;
  startX = 0;
  scrollLeft = 0;
  isDragging = false;

  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.isDragging = false;
    this.startX = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseUp() {
    this.isDown = false;
    // Delay resetting isDragging to ensure click handler sees the correct state
    setTimeout(() => {
      this.isDragging = false;
    }, 50);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll speed multiplier
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;

    // Determine if it's a drag or a click
    if (Math.abs(walk) > 5) {
      this.isDragging = true;
    }
  }

  scroll(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  onCardClick(artistId: string) {
    if (!this.isDragging) {
      this.router.navigate(['/artist', artistId]);
    }
  }
}
