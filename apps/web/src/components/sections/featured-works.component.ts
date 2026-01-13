
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';
import { ArtworkCardComponent } from '../ui/artwork-card.component';

@Component({
  selector: 'app-featured-works',
  standalone: true,
  imports: [CommonModule, ArtworkCardComponent, RouterLink],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-[1800px] mx-auto px-6 md:px-12">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="font-serif text-3xl text-gray-900 mb-2">Últimas selecciones</h2>
            <p class="text-gray-500 text-sm font-light">Conoce las nuevas adiciones a la biblioteca.</p>
          </div>
          <a routerLink="/disciplines" class="text-sm font-medium underline decoration-1 underline-offset-4 hover:text-prenda-olive">Ver obras</a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
          @for (work of artworks(); track work.id) {
            <app-artwork-card [artwork]="work"></app-artwork-card>
          }
        </div>
      </div>
    </section>
  `
})
export class FeaturedWorksComponent {
  private api = inject(ApiService);

  // Create a signal for the artworks using toSignal
  // We fetch 5 items as per the original slice(0, 5)
  artworks = toSignal(
    this.api.getArtworks({ limit: 5 }).pipe(
      map(res => res.docs.map(work => {
        const image = work.image as any;
        const imageUrl = image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '';
        return {
          ...work,
          imageUrl: imageUrl
        };
      }))
    ),
    { initialValue: [] }
  );
}
