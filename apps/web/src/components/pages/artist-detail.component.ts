
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { ArtworkCardComponent } from '../ui/artwork-card.component';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ArtworkCardComponent],
  template: `
    @if (artist(); as a) {
      <div class="pt-12 pb-20 max-w-[1600px] mx-auto px-6 md:px-12">
        <!-- Header -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          <!-- Sidebar / Info Column -->
          <div class="md:col-span-4 lg:col-span-3">
            <div class="relative w-full aspect-[3/4] bg-gray-100 mb-6 border border-gray-100">
               <img [ngSrc]="a.imageUrl || a.image" fill class="object-cover" [alt]="a.name" priority />
            </div>
            
            <span class="inline-block text-xs font-bold uppercase tracking-widest text-prenda-secondary mb-2 bg-prenda-secondary/10 px-2 py-1 rounded">
                {{ a.type === 'Collective' ? 'Colectivo' : 'Artista' }}
            </span>
            <h1 class="font-serif text-4xl mb-1 text-prenda-dark">{{ a.name }}</h1>
            <p class="text-gray-500 mb-6 text-lg font-light">{{ a.country }}, {{ a.birthYear }}</p>
            
            @if (currentUser()) {
              <button 
                (click)="toggleFollow()"
                class="w-full py-3.5 rounded-full text-sm font-medium transition-colors mb-8 shadow-sm flex items-center justify-center gap-2"
                [class.bg-white]="isFollowed()"
                [class.text-prenda-dark]="isFollowed()"
                [class.border]="isFollowed()"
                [class.border-gray-300]="isFollowed()"
                [class.bg-prenda-dark]="!isFollowed()"
                [class.text-white]="!isFollowed()"
                [class.hover:bg-prenda-primary-dark]="!isFollowed()"
              >
                @if(isFollowed()) {
                  Siguiendo
                } @else {
                  Seguir {{ a.type === 'Collective' ? 'Colectivo' : 'Artista' }}
                }
              </button>
            } @else {
               <button disabled class="w-full bg-gray-200 text-gray-500 py-3.5 rounded-full text-sm font-medium mb-8 cursor-not-allowed">
                  Ingresa para seguir
               </button>
            }
            
            <!-- Enhanced Metadata -->
            <div class="space-y-6">
              
              <!-- Disciplines -->
              @if (a.disciplines.length > 0) {
                <div>
                   <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Disciplinas</h3>
                   <div class="flex flex-wrap gap-2">
                     @for (disc of a.disciplines; track disc) {
                       <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-prenda-primary-light/30 text-prenda-primary-dark border border-prenda-primary-light/50">
                         {{ disc }}
                       </span>
                     }
                   </div>
                </div>
              }

              <!-- Movements -->
              @if (a.movements.length > 0) {
                <div>
                   <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Movimientos</h3>
                   <div class="flex flex-col space-y-1">
                     @for (mov of a.movements; track mov) {
                       <span class="text-sm text-gray-700 hover:text-prenda-secondary cursor-pointer transition-colors">{{ mov }}</span>
                     }
                   </div>
                </div>
              }
            </div>

            <div class="mt-8 pt-8 border-t border-gray-100">
               <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Estadísticas</h3>
               <div class="flex justify-between text-sm mb-3">
                 <span class="text-gray-500">Obras Archivadas</span>
                 <span class="font-medium text-prenda-dark">{{ artworks().length }}</span>
               </div>
               <div class="flex justify-between text-sm">
                 <span class="text-gray-500">Seguidores</span>
                 <span class="font-medium text-prenda-dark">
                   {{ 1200 + (isFollowed() ? 1 : 0) }}
                 </span>
               </div>
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="md:col-span-8 lg:col-span-9">
            <h2 class="font-serif text-2xl mb-6 text-prenda-dark border-b border-gray-100 pb-2 inline-block">Biografía</h2>
            
            <div class="prose prose-lg text-gray-600 font-light max-w-3xl leading-relaxed">
              <p>
                @if (!isBioExpanded() && a.bio.length > 500) {
                  {{ a.bio | slice:0:500 }}...
                } @else {
                  {{ a.bio }}
                }
              </p>
              
              @if (isBioExpanded()) {
                <p class="mt-4 animate-fade-in">
                  {{ a.name }} ha expuesto en las instituciones más prestigiosas del mundo, incluyendo el MoMA de Nueva York, la Tate Modern de Londres y el Centro Pompidou de París. Su obra forma parte de colecciones públicas y privadas fundamentales para entender el desarrollo del arte contemporáneo en América Latina.
                </p>
              }

              <button 
                (click)="toggleBio()" 
                class="mt-4 text-sm font-bold text-prenda-secondary hover:text-prenda-dark transition-colors focus:outline-none flex items-center group"
              >
                {{ isBioExpanded() ? 'Leer menos' : 'Leer más' }}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="2" 
                  stroke="currentColor" 
                  class="w-4 h-4 ml-1 transition-transform duration-300"
                  [class.rotate-180]="isBioExpanded()"
                  [class.group-hover:translate-y-0.5]="!isBioExpanded()"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            <div class="mt-20">
              <div class="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                 <h2 class="font-serif text-3xl text-prenda-dark">Archivo de Obras</h2>
                 <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Ordenar por:</span>
                    <select class="border-none bg-transparent font-medium text-prenda-dark focus:ring-0 cursor-pointer">
                      <option>Recientes</option>
                      <option>Año: Antiguo a Reciente</option>
                      <option>Año: Reciente a Antiguo</option>
                    </select>
                 </div>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
                @for (work of artworks(); track work.id) {
                  <app-artwork-card [artwork]="work"></app-artwork-card>
                } @empty {
                  <div class="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                    <p class="text-gray-500 italic mb-4">No hay obras registradas en este momento.</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ArtistDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private auth = inject(AuthService);

  currentUser = this.auth.currentUser;

  // State for Bio Read More
  isBioExpanded = signal(false);

  toggleBio() {
    this.isBioExpanded.update(v => !v);
  }

  // Reactive Artist Data
  artist = toSignal(
    this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        if (!id) return of(undefined);

        return this.api.getArtist(id).pipe(
          map(doc => {
            const image = doc.image as any;
            return {
              id: String(doc.id),
              name: doc.name,
              country: doc.country || '',
              birthYear: doc.birthYear || 0,
              image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
              imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
              bio: doc.bio || '',
              disciplines: doc.disciplines?.map(d => d.name || '').filter(Boolean) as string[] || [],
              movements: doc.movements?.map(m => m.name || '').filter(Boolean) as string[] || [],
              type: (doc.type as 'Individual' | 'Collective') || 'Individual'
            };
          })
        );
      })
    )
  );

  // Reactive Artworks Data (Related to Artist)
  artworks = toSignal(
    this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        if (!id) return of([]);

        // Query: where[artist][equals]=id
        return this.api.getArtworks({ 'where[artist][equals]': id }).pipe(
          map(res => res.docs.map(doc => {
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

  // Computed set of followed IDs
  followedArtistIds = computed(() => {
    const user = this.currentUser();
    const ids = new Set<string>();
    if (user?.followedArtists) {
      user.followedArtists.forEach(item => {
        if (typeof item === 'string') ids.add(item);
        else if (item && typeof item === 'object' && 'id' in item) ids.add(String(item.id));
      });
    }
    return ids;
  });

  isFollowed = computed(() => {
    const a = this.artist();
    return a ? this.followedArtistIds().has(a.id) : false;
  });

  toggleFollow() {
    const a = this.artist();
    if (a) this.auth.toggleFollowArtist(a.id).subscribe();
  }
}
