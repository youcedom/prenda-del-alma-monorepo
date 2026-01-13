
import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
   selector: 'app-article-detail',
   imports: [CommonModule, NgOptimizedImage, RouterLink, FormsModule],
   template: `
    @if (article(); as a) {
      <div class="bg-white min-h-screen pb-24">
         
         <!-- Article Header -->
         <div class="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-12 text-center">
            <span class="inline-block text-xs font-bold uppercase tracking-widest text-prenda-secondary mb-4 px-3 py-1 bg-gray-50 rounded">{{ a.category }}</span>
            <h1 class="font-serif text-4xl md:text-6xl text-prenda-dark leading-tight mb-8">{{ a.title }}</h1>
            <div class="flex flex-col md:flex-row items-center justify-center text-sm text-gray-500 space-y-2 md:space-y-0 md:space-x-6">
               <span class="font-medium text-prenda-dark">Por {{ a.author }}</span>
               <span class="hidden md:inline">•</span>
               <span>{{ a.date | date:'MMM dd, yyyy' }}</span>
               <span class="hidden md:inline">•</span>
               <span>5 min de lectura</span>
            </div>
         </div>

         <!-- Hero Image -->
         <div class="w-full max-w-[1400px] mx-auto mb-16 px-0 md:px-6">
            <div class="relative aspect-[16/9] md:aspect-[21/9] bg-gray-100 overflow-hidden md:rounded-lg">
               <img 
                  [ngSrc]="a.image" 
                  fill 
                  priority
                  class="object-cover" 
                  [alt]="a.title"
               />
            </div>
            <p class="text-center text-xs text-gray-400 mt-2">Imagen cortesía del artista y galería.</p>
         </div>

         <!-- Article Content -->
         <article class="prose prose-lg prose-headings:font-serif prose-headings:text-prenda-dark prose-p:text-gray-700 prose-p:font-light prose-p:leading-loose prose-a:text-prenda-secondary hover:prose-a:text-prenda-dark mx-auto px-6 md:px-12 max-w-3xl">
            <p class="lead font-medium text-xl text-gray-900 mb-8 border-b border-gray-100 pb-8">{{ a.summary }}</p>
            
            @if (a.content) {
               @for (paragraph of a.content; track $index) {
                  <p>{{ paragraph }}</p>
               }
            } @else {
               <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
               </p>
               <h3>Una nueva perspectiva</h3>
               <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
               </p>
               <blockquote>
                  "El arte latinoamericano no es un género, es una declaración de principios."
               </blockquote>
               <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
               </p>
            }
         </article>

         <!-- Share & Tags -->
         <div class="max-w-3xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
            <div class="flex space-x-2">
               <span class="text-xs font-bold uppercase tracking-wide text-gray-400 mr-2">Compartir:</span>
               <button class="text-gray-500 hover:text-prenda-dark transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
               <button class="text-gray-500 hover:text-prenda-dark transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></button>
            </div>
         </div>

         <!-- Comments Section -->
         <div class="max-w-3xl mx-auto px-6 md:px-12 mt-16 pt-12 border-t border-gray-100">
             <div class="flex items-center justify-between mb-8">
               <h3 class="font-serif text-2xl text-prenda-dark">Comentarios</h3>
               <span class="text-sm text-gray-500">{{ a.comments?.length || 0 }} comentarios</span>
             </div>
             
             <div class="space-y-8 mb-8">
                @for (comment of a.comments; track comment.id) {
                   <div class="flex gap-4">
                      <img [src]="comment.userAvatar" class="w-10 h-10 rounded-full object-cover shrink-0" alt="">
                      <div>
                         <div class="flex items-baseline gap-2 mb-1">
                            <span class="font-bold text-gray-900">{{ comment.userName }}</span>
                            <span class="text-xs text-gray-400">{{ comment.date }}</span>
                         </div>
                         <p class="text-gray-600 leading-relaxed">{{ comment.text }}</p>
                      </div>
                   </div>
                } @empty {
                   <p class="text-gray-400 italic">No hay comentarios aún. Únete a la conversación.</p>
                }
             </div>

             @if (currentUser()) {
                <div class="flex gap-4 items-start">
                   <img [src]="currentUser()?.avatar" class="w-10 h-10 rounded-full object-cover shrink-0" alt="">
                   <div class="flex-1">
                      <textarea 
                         rows="3" 
                         placeholder="Comparte tu opinión..."
                         class="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:border-prenda-secondary focus:ring-1 focus:ring-prenda-secondary/50 transition-all resize-none"
                      ></textarea>
                      <div class="flex justify-end mt-3">
                         <button class="px-6 py-2 bg-prenda-dark text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-prenda-primary-dark transition-colors">Publicar</button>
                      </div>
                   </div>
                </div>
             } @else {
                <div class="bg-gray-50 p-8 rounded-lg text-center border border-gray-100">
                  <h4 class="font-serif text-lg text-prenda-dark mb-2">Participa en la discusión</h4>
                  <p class="text-gray-600 font-light mb-6">Inicia sesión para compartir tus reflexiones sobre este artículo.</p>
                  <a routerLink="/login" class="inline-block px-6 py-3 bg-white border border-gray-300 rounded-full text-xs font-bold uppercase tracking-widest text-prenda-dark hover:border-prenda-dark transition-colors">
                    Iniciar Sesión
                  </a>
                </div>
             }
          </div>

         <!-- Read Next -->
         <div class="max-w-[1400px] mx-auto px-6 md:px-12 mt-24">
            <h3 class="font-serif text-3xl text-prenda-dark mb-8 text-center">Seguir Leyendo</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
               @for (next of otherArticles(); track next.id) {
                  <div [routerLink]="['/article', next.id]" class="group cursor-pointer">
                     <div class="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden mb-4">
                        <img [ngSrc]="next.image" fill class="object-cover transition-transform duration-500 group-hover:scale-105" [alt]="next.title" />
                     </div>
                     <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary block mb-2">{{ next.category }}</span>
                     <h4 class="font-serif text-xl text-prenda-dark group-hover:underline decoration-1 underline-offset-4">{{ next.title }}</h4>
                  </div>
               }
            </div>
         </div>

      </div>
    }
  `
})
export class ArticleDetailComponent {
   private route = inject(ActivatedRoute);
   private api = inject(ApiService);
   private auth = inject(AuthService);

   // Convert route params observable to a signal
   private params = toSignal(this.route.params);

   currentUser = this.auth.currentUser;

   // Reactive Article Data
   article = toSignal(
      this.route.params.pipe(
         switchMap(params => {
            const id = params['id'];
            if (!id) return of(undefined);
            return this.api.getArticle(id).pipe(
               map(doc => {
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     title: doc.title,
                     summary: doc.summary || '',
                     content: [], // Rich text handling might be needed, or split strings
                     // Payload rich text is complex JSON. Assuming summary for now or raw content if string.
                     // If content is missing in schema, use summary.
                     // For now, mapping simplified structure.
                     category: doc.category || 'Editorial',
                     author: doc.author || 'Equipo Prenda',
                     date: doc.createdAt || '',
                     image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : '',
                     comments: []
                  };
               })
            );
         })
      )
   );

   // Recommendations: Fetch 3 recent articles excluding current
   otherArticles = toSignal(
      this.route.params.pipe(
         switchMap(params => {
            const id = params['id'];
            return this.api.getArticles({ limit: 3, 'where[id][not_equals]': id }).pipe(
               map(res => res.docs.map(doc => {
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     title: doc.title,
                     category: doc.category || '',
                     image: image?.url ? `${environment.apiUrl.replace('/api', '')}${image.url}` : ''
                  };
               }))
            );
         })
      ),
      { initialValue: [] }
   );
}
