
import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  template: `
    <section class="py-20 bg-prenda-primary-light/10">
      <div class="max-w-[1800px] mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row justify-between md:items-end mb-12">
          <div class="mb-4 md:mb-0">
             <span class="text-xs font-bold tracking-widest uppercase text-prenda-secondary mb-2 block">Calendario</span>
             <h2 class="font-serif text-4xl text-prenda-dark">Conoce la agenda del arte</h2>
          </div>
          <a routerLink="/events" class="text-sm font-medium px-6 py-3 border border-prenda-dark rounded-full hover:bg-prenda-dark hover:text-white transition-colors text-prenda-dark inline-block text-center">Ver calendario</a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Featured Event -->
          @if (events()[0]; as featured) {
            <div [routerLink]="['/event', featured.id]" class="relative aspect-[16/9] lg:aspect-auto bg-gray-200 overflow-hidden group cursor-pointer lg:h-full">
               <img 
                 [ngSrc]="featured.imageUrl || featured.image" 
                 fill
                 class="object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90"
                 [alt]="featured.name"
               />
               <div class="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <span class="bg-white text-prenda-dark text-xs font-bold px-3 py-1 uppercase tracking-wider inline-block w-max mb-3">{{ featured.type }}</span>
                  <h3 class="font-serif text-4xl mb-2">{{ featured.name }}</h3>
                  <div class="flex items-center text-sm font-medium">
                    <span class="mr-4">{{ featured.startDate | date:'MMM d' }} - {{ featured.endDate | date:'MMM d, y' }}</span>
                    <span>{{ featured.location }}</span>
                  </div>
               </div>
            </div>
          }

          <!-- List (Limited to 4 items) -->
          <div class="flex flex-col space-y-2">
            @for (event of events().slice(1, 5); track event.id) {
              <div [routerLink]="['/event', event.id]" class="flex bg-white p-6 border border-gray-200 hover:border-prenda-secondary transition-colors cursor-pointer group">
                 <div class="flex flex-col justify-center items-center text-center w-16 md:w-24 border-r border-gray-100 pr-6 mr-6 shrink-0">
                    <span class="text-xs text-gray-400 uppercase tracking-wider block">Inicio</span>
                    <span class="font-serif text-xl md:text-2xl text-prenda-dark">{{ event.startDate | date:'d' }}</span>
                    <span class="text-xs font-bold uppercase text-prenda-secondary">{{ event.startDate | date:'MMM' }}</span>
                 </div>
                 <div class="flex flex-col justify-center">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{{ event.type }}</span>
                    <h4 class="font-serif text-xl text-prenda-dark group-hover:text-prenda-secondary transition-colors mb-1">{{ event.name }}</h4>
                    <p class="text-sm text-gray-500">{{ event.location }}</p>
                 </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class UpcomingEventsComponent {
  private api = inject(ApiService);

  // Fetch 5 events (1 featured + 4 list items)
  events = toSignal(
    this.api.getEvents({ limit: 5, sort: 'startDate' }).pipe(
      map(res => res.docs.map(doc => {
        const image = doc.image as any;
        return {
          id: String(doc.id),
          name: doc.name,
          location: doc.location || '',
          startDate: doc.startDate || '',
          endDate: doc.endDate || '',
          image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Flattens to string URL
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
}
