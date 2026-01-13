import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-featured-galleries',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-[1800px] mx-auto px-6 md:px-12">
        <div class="flex justify-between items-end mb-10">
          <div>
             <h2 class="font-serif text-3xl text-prenda-dark mb-2">Explorar galerías</h2>
             <p class="text-gray-500 font-light text-sm">Los espacios más importantes de la región.</p>
          </div>
          <a routerLink="/galleries" class="text-sm font-medium underline decoration-1 underline-offset-4 hover:text-prenda-secondary text-prenda-dark">Ver galerías</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (gallery of galleries(); track gallery.id) {
            <div class="group cursor-pointer">
              <div class="relative aspect-[3/2] overflow-hidden bg-gray-100 mb-4 rounded-sm">
                <img 
                  [ngSrc]="gallery.imageUrl" 
                  [alt]="gallery.name"
                  fill
                  class="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 class="font-serif text-xl text-prenda-dark group-hover:underline decoration-1 underline-offset-4">{{ gallery.name }}</h3>
              <p class="text-xs uppercase tracking-wide text-gray-500 mt-1">{{ gallery.location }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class FeaturedGalleriesComponent {
  private api = inject(ApiService);

  galleries = toSignal(
    this.api.getGalleries({ limit: 4 }).pipe(
      map(res => res.docs.map(gallery => {
        const image = gallery.image as any;
        return {
          ...gallery,
          imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : ''
        };
      }))
    ),
    { initialValue: [] }
  );
}