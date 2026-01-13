import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-fair-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="pt-16 pb-24 max-w-[1200px] mx-auto px-6 md:px-12">
      <div class="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-prenda-grey pb-8">
        <div>
          <h1 class="font-serif text-5xl md:text-6xl mb-4 text-prenda-dark">Ferias de Arte</h1>
          <p class="text-xl text-gray-500 font-light">
            El circuito comercial más importante de América Latina.
          </p>
        </div>
      </div>

      <div class="space-y-8">
        @for (event of fairs(); track event.id) {
          <div class="group flex flex-col md:flex-row bg-white border border-gray-200 hover:border-prenda-secondary transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md">
            
            <!-- Image (Left on Desktop for Fairs to distinguish from Agenda) -->
             <div class="md:w-80 shrink-0 relative overflow-hidden aspect-video md:aspect-auto">
               <img 
                [ngSrc]="event.image" 
                fill 
                class="object-cover transition-transform duration-700 group-hover:scale-110 opacity-95 group-hover:opacity-100" 
                [alt]="event.name"
              />
            </div>

            <!-- Content -->
            <div class="p-8 flex-1 flex flex-col justify-center">
               <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary mb-2">{{ event.type }}</span>
               <h2 class="font-serif text-3xl md:text-4xl text-prenda-dark mb-3 group-hover:text-prenda-secondary transition-colors">{{ event.name }}</h2>
               <div class="flex items-center text-gray-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span class="font-medium">{{ event.location }}</span>
               </div>
               
               <div class="flex items-center space-x-6">
                   <div class="flex flex-col">
                       <span class="text-xs text-gray-400 uppercase tracking-wide">Inicio</span>
                       <span class="text-lg font-serif">{{ event.startDate }}</span>
                   </div>
                   <div class="w-px h-8 bg-gray-200"></div>
                   <div class="flex flex-col">
                       <span class="text-xs text-gray-400 uppercase tracking-wide">Fin</span>
                       <span class="text-lg font-serif">{{ event.endDate }}</span>
                   </div>
               </div>
               
               <div class="mt-6 pt-6 border-t border-gray-100 flex gap-4">
                  <button class="px-6 py-2 bg-prenda-dark text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-prenda-primary-dark transition-colors">
                      Comprar Entradas
                  </button>
                  <button class="px-6 py-2 border border-gray-300 text-prenda-dark text-xs font-bold uppercase tracking-wider rounded-full hover:border-prenda-dark transition-colors">
                      Ver Expositores
                  </button>
               </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class FairListComponent {
  private api = inject(ApiService);

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
          image: image?.url || '', // Flattens to string URL
          type: doc.type || '',
          rawDate: doc.rawDate || doc.startDate || '',
          description: doc.description || undefined,
          galleryId: typeof doc.gallery === 'object' ? String((doc.gallery as any)?.id) : String(doc.gallery)
        };
      }))
    ),
    { initialValue: [] }
  );

  // Filter only Fairs
  fairs = computed(() => this.events().filter(e => e.type === 'Feria de Arte'));
}