
import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-editorial',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-[1800px] mx-auto px-6 md:px-12">
        <div class="flex justify-between items-baseline mb-10">
          <h2 class="font-serif text-4xl text-gray-900">Editorial</h2>
          <a routerLink="/articles" class="text-sm font-medium underline decoration-1 underline-offset-4 hover:text-prenda-secondary text-prenda-dark">Ver artículos</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <!-- Main Feature Article (Left, spanning 7 cols) -->
          @if (mainArticle(); as main) {
            <div [routerLink]="['/article', main.id]" class="md:col-span-7 group cursor-pointer">
              <div class="relative w-full aspect-[16/9] overflow-hidden mb-4 bg-gray-100">
                 <img 
                [ngSrc]="main.imageUrl" 
                fill
                priority
                class="object-cover transition-transform duration-700 group-hover:scale-105"
                [alt]="main.title"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-bold tracking-widest uppercase text-prenda-olive mb-2">{{ main.category }}</span>
              <h3 class="font-serif text-3xl md:text-4xl leading-tight mb-3 group-hover:underline decoration-1 underline-offset-4">{{ main.title }}</h3>
              <p class="text-gray-600 mb-2 line-clamp-2 text-lg font-light">{{ main.summary }}</p>
              <div class="text-xs text-gray-400">Por {{ main.author }} • {{ main.date | date:'MMM dd, yyyy' }}</div>
            </div>
          </div>
          }

          <!-- Side Articles (Right, spanning 5 cols) -->
          <div class="md:col-span-5 flex flex-col space-y-8">
            @for (article of sideArticleList(); track article.id) {
              <div [routerLink]="['/article', article.id]" class="flex gap-4 group cursor-pointer border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <div class="relative w-1/3 aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
                   <img 
                    [ngSrc]="article.imageUrl" 
                    fill
                    class="object-cover transition-transform duration-500 group-hover:scale-105"
                    [alt]="article.title"
                  />
                </div>
                <div class="w-2/3 flex flex-col justify-center">
                  <span class="text-[10px] font-bold tracking-widest uppercase text-prenda-olive mb-1">{{ article.category }}</span>
                  <h4 class="font-serif text-xl leading-snug mb-2 group-hover:underline decoration-1 underline-offset-4">{{ article.title }}</h4>
                  <div class="text-xs text-gray-400 mt-auto">Por {{ article.author }}</div>
                </div>
              </div>
            }
          </div>

        </div>
      </div>
    </section>
  `
})
export class EditorialComponent {
  private api = inject(ApiService);

  // Fetch 4 articles (1 main + 3 side)
  articles = toSignal(
    this.api.getArticles({ limit: 4 }).pipe(
      map(res => res.docs.map(article => {
        const image = article.image as any;
        const imageUrl = image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '';
        return {
          ...article,
          imageUrl: imageUrl // Use a distinct property name
        };
      }))
    ),
    { initialValue: [] }
  );

  mainArticle = computed(() => this.articles()[0]);
  sideArticleList = computed(() => this.articles().slice(1, 4));
}
