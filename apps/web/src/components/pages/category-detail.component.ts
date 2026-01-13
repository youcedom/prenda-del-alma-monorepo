import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';
import { ArtworkCardComponent } from '../ui/artwork-card.component';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, ArtworkCardComponent],
  template: `
    <div class="min-h-screen">
       @if (category(); as cat) {
         <!-- Header -->
         <div class="relative h-[300px] overflow-hidden bg-gray-900">
            <img [src]="cat.image" class="w-full h-full object-cover opacity-50" />
            <div class="absolute inset-0 flex items-center justify-center">
               <h1 class="text-white font-serif text-5xl md:text-6xl">{{ cat.name }}</h1>
            </div>
         </div>

         <div class="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
            <!-- Filter Bar Mockup -->
            <div class="flex flex-wrap items-center justify-between border-b border-gray-200 pb-4 mb-8 sticky top-20 bg-white z-10 pt-4">
               <div class="flex space-x-4 text-sm">
                 <button class="px-4 py-2 border border-gray-300 rounded-full hover:border-black transition-colors">Precio</button>
                 <button class="px-4 py-2 border border-gray-300 rounded-full hover:border-black transition-colors">Tamaño</button>
                 <button class="px-4 py-2 border border-gray-300 rounded-full hover:border-black transition-colors">Medio</button>
               </div>
               <div class="text-sm text-gray-500">
                 {{ artworks().length }} Resultados
               </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
               @for (work of artworks(); track work.id) {
                 <app-artwork-card [artwork]="work"></app-artwork-card>
               } @empty {
                  <div class="col-span-full py-20 text-center text-gray-500">
                    <p class="text-lg">No se encontraron obras en esta categoría.</p>
                  </div>
               }
            </div>
         </div>
       }
    </div>
  `
})
export class CategoryDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private params = toSignal(this.route.params);

  categorySlug = computed(() => this.params()?.['slug']);

  // Static Category Map (Temporary until Backend supports Categories Collection)
  private categoryMap: Record<string, { name: string, image: string }> = {
    'pintura': { name: 'Pintura', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop' },
    'escultura': { name: 'Escultura', image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=2000&auto=format&fit=crop' },
    'fotografia': { name: 'Fotografía', image: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=2000&auto=format&fit=crop' },
    'grabado': { name: 'Grabado', image: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=2000&auto=format&fit=crop' },
    'instalacion': { name: 'Instalación', image: 'https://images.unsplash.com/photo-1518998053901-5348d3969104?q=80&w=2000&auto=format&fit=crop' }
  };

  category = computed(() => {
    const slug = this.categorySlug();
    if (!slug) return undefined;
    return this.categoryMap[slug.toLowerCase()] || { name: slug, image: 'https://via.placeholder.com/1500' };
  });

  artworksData = toSignal(
    toObservable(this.categorySlug).pipe(
      switchMap(slug => {
        if (!slug) return of([]);
        // Map slug to likely category string in DB (Capitalized?)
        // The seed data uses capitalized Spanish: 'Pintura', 'Escultura'.
        // We'll try to match exact or use 'like'.
        // Ideally backend has 'category' field.
        const catName = this.categoryMap[slug.toLowerCase()]?.name || slug;
        return this.api.getArtworks({ 'where[category][equals]': catName }).pipe(
          map(res => res.docs.map(doc => {
            const artist = doc.artist as any;
            const image = doc.image as any;
            return {
              id: String(doc.id),
              title: doc.title,
              artistId: artist?.id ? String(artist.id) : '',
              artistName: artist?.name || 'Unknown',
              gallery: '', // Not needed for card?
              year: doc.year || 0,
              image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
              imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
              medium: doc.medium || '',
              dimensions: doc.dimensions || ''
            };
          }))
        );
      })
    ),
    { initialValue: [] }
  );

  artworks = computed(() => this.artworksData());
}