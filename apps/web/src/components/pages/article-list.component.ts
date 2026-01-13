
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiPaginationComponent } from '../ui/ui-pagination.component';

@Component({
   selector: 'app-article-list',
   standalone: true,
   imports: [CommonModule, NgOptimizedImage, RouterLink, FormsModule, UiPaginationComponent],
   template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="pt-16 pb-12 max-w-[1800px] mx-auto px-6 md:px-12 bg-white">
        <h1 class="font-serif text-5xl md:text-6xl mb-4 text-prenda-dark">Prenda Editorial</h1>
        <p class="text-xl text-gray-500 font-light max-w-2xl">
          Análisis, críticas, entrevistas y noticias sobre la escena del arte contemporáneo en Latinoamérica.
        </p>
      </div>

      <div class="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
        
        <!-- Featured Sections (Always visible on Page 1) -->
        @if (currentPage() === 1) {
            
            <!-- 1. Main Featured Hero Article -->
            @if (heroArticle(); as hero) {
              <div class="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer group" [routerLink]="['/article', hero.id]">
                  <div class="lg:col-span-8 relative aspect-[16/9] lg:aspect-[2/1] bg-gray-100 overflow-hidden">
                    <img 
                        [ngSrc]="hero.imageUrl || hero.image" 
                        fill 
                        priority
                        class="object-cover transition-transform duration-700 group-hover:scale-105" 
                        [alt]="hero.title"
                    />
                  </div>
                  <div class="lg:col-span-4 flex flex-col justify-center">
                    <span class="text-xs font-bold uppercase tracking-widest text-prenda-secondary mb-3">{{ hero.category }}</span>
                    <h2 class="font-serif text-3xl md:text-5xl leading-tight text-prenda-dark mb-4 group-hover:underline decoration-1 underline-offset-4">{{ hero.title }}</h2>
                    <p class="text-gray-600 font-light text-lg mb-4 line-clamp-3">{{ hero.summary }}</p>
                    <div class="flex items-center text-xs text-gray-400 uppercase tracking-wide">
                        <span class="font-medium text-prenda-dark mr-1">{{ hero.author }}</span>
                        <span>• {{ hero.date | date:'MMM dd, yyyy' }}</span>
                    </div>
                  </div>
              </div>
            }

            <!-- 2. Secondary Featured Articles (2 Columns) -->
            @if (subFeaturedArticles().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                  @for (sub of subFeaturedArticles(); track sub.id) {
                     <div [routerLink]="['/article', sub.id]" class="group cursor-pointer">
                        <div class="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden mb-5">
                          <img 
                              [ngSrc]="sub.imageUrl || sub.image" 
                              fill 
                              class="object-cover transition-transform duration-700 group-hover:scale-105" 
                              [alt]="sub.title"
                          />
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary mb-2 block">{{ sub.category }}</span>
                        <h3 class="font-serif text-2xl md:text-3xl text-prenda-dark mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4">{{ sub.title }}</h3>
                        <p class="text-gray-600 font-light text-sm mb-4 line-clamp-3">{{ sub.summary }}</p>
                        <div class="flex items-center text-[10px] text-gray-400 uppercase tracking-wide">
                            <span>{{ sub.author }}</span>
                            <span class="mx-2">•</span>
                            <span>{{ sub.date | date:'MMM dd, yyyy' }}</span>
                        </div>
                     </div>
                  }
              </div>
            }

        }

        <!-- Filter Bar -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-y border-gray-100 py-6 mb-12 sticky top-16 bg-white z-20">
           <div class="flex flex-wrap gap-4 mb-4 md:mb-0">
              <button 
                 (click)="selectedCategory.set(null); onFilterChange()"
                 [class.text-prenda-secondary]="selectedCategory() === null"
                 [class.font-bold]="selectedCategory() === null"
                 class="text-sm text-gray-500 hover:text-prenda-secondary transition-colors"
              >
                 Todo
              </button>
              @for (cat of categories(); track cat) {
                 <button 
                    (click)="selectedCategory.set(cat); onFilterChange()"
                    [class.text-prenda-secondary]="selectedCategory() === cat"
                    [class.font-bold]="selectedCategory() === cat"
                    class="text-sm text-gray-500 hover:text-prenda-secondary transition-colors"
                 >
                    {{ cat }}
                 </button>
              }
           </div>
           
           <div class="text-xs text-gray-400 uppercase tracking-wide">
              {{ filteredArticles().length }} {{ filteredArticles().length === 1 ? 'Publicación' : 'Publicaciones' }}
           </div>
        </div>

        <!-- 3. Remaining Articles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
           @for (article of paginatedGridArticles(); track article.id) {
              <div [routerLink]="['/article', article.id]" class="group cursor-pointer flex flex-col">
                 <div class="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden mb-5">
                    <img 
                       [ngSrc]="article.imageUrl || article.image" 
                       fill 
                       class="object-cover transition-transform duration-500 group-hover:scale-110" 
                       [alt]="article.title"
                    />
                 </div>
                 <div class="flex flex-col flex-1">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary mb-2">{{ article.category }}</span>
                    <h3 class="font-serif text-2xl text-prenda-dark mb-3 leading-snug group-hover:underline decoration-1 underline-offset-4">{{ article.title }}</h3>
                    <p class="text-gray-600 font-light text-sm mb-4 line-clamp-3">{{ article.summary }}</p>
                    <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wide">
                       <span>{{ article.author }}</span>
                       <span>{{ article.date | date:'MMM dd, yyyy' }}</span>
                    </div>
                 </div>
              </div>
           } @empty {
             <div class="col-span-full py-20 text-center">
                <p class="text-gray-500">No se encontraron artículos.</p>
             </div>
           }
        </div>
        
        <app-ui-pagination
           [currentPage]="currentPage()"
           [totalItems]="gridSourceArticles().length" 
           [pageSize]="pageSize"
           (pageChange)="currentPage.set($event)"
        ></app-ui-pagination>

      </div>
    </div>
  `
})
export class ArticleListComponent {
   private api = inject(ApiService);

   // State
   selectedCategory = signal<string | null>(null);

   // Pagination
   currentPage = signal(1);
   readonly pageSize = 9;

   // Fetch full collection
   allArticles = toSignal(
      this.api.getArticles({ limit: 1000 }).pipe(
         map(res => res.docs.map(doc => {
            const image = doc.image as any;
            return {
               id: String(doc.id),
               title: doc.title,
               category: doc.category || '',
               author: doc.author || '',
               date: doc.date || '',
               image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
               imageUrl: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '', // Explicit imageUrl
               summary: doc.summary || '',
               featured: doc.featured || false
            };
         }))
      ),
      { initialValue: [] }
   );

   categories = computed(() => {
      const cats = new Set<string>();
      this.allArticles().forEach(a => cats.add(a.category));
      return Array.from(cats).sort();
   });

   // Computed: Featured Logic (Global Featured)
   // These are always displayed on page 1, regardless of filter
   globalFeaturedArticles = computed(() => {
      return this.allArticles().filter(a => a.featured).slice(0, 3);
   });

   heroArticle = computed(() => this.globalFeaturedArticles()[0]);

   subFeaturedArticles = computed(() => this.globalFeaturedArticles().slice(1, 3));

   // Computed: Filtered Grid Source
   // This logic ensures the Grid (below) contains everything NOT in the Featured (above).
   // When filtering, we filter the "remaining" pool of articles.
   // The Featured section stays visible (handled in template) and is disjoint from the grid results.

   filteredArticles = computed(() => {
      const category = this.selectedCategory();
      const all = this.allArticles();

      // Always exclude global featured articles from the grid source to avoid duplication
      // since the featured section is now always visible on page 1.
      const featuredIds = this.globalFeaturedArticles().map(a => a.id);
      let result = all.filter(a => !featuredIds.includes(a.id));

      // If category selected, filter the result set
      if (category) {
         result = result.filter(a => a.category === category);
      }

      return result;
   });

   // Alias for pagination source
   gridSourceArticles = this.filteredArticles;

   // Paginated Grid
   paginatedGridArticles = computed(() => {
      const start = (this.currentPage() - 1) * this.pageSize;
      return this.gridSourceArticles().slice(start, start + this.pageSize);
   });

   onFilterChange() {
      this.currentPage.set(1);
   }
}
