
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from '../sections/hero.component';
import { FeaturedWorksComponent } from '../sections/featured-works.component';
import { EditorialComponent } from '../sections/editorial.component';
import { TrendingArtistsComponent } from '../sections/trending-artists.component';
import { DisciplinesGridComponent } from '../sections/disciplines-grid.component';
import { FeaturedGalleriesComponent } from '../sections/featured-galleries.component';
import { UpcomingEventsComponent } from '../sections/upcoming-events.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeroComponent,
    FeaturedWorksComponent,
    EditorialComponent,
    TrendingArtistsComponent,
    DisciplinesGridComponent,
    FeaturedGalleriesComponent,
    UpcomingEventsComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-featured-works></app-featured-works>
    <app-upcoming-events></app-upcoming-events>
    <app-featured-galleries></app-featured-galleries>
    <app-editorial></app-editorial>
    <app-trending-artists></app-trending-artists>
    <app-disciplines-grid></app-disciplines-grid>
    
    <!-- Newsletter / Join Section -->
    <section class="py-24 px-6 bg-prenda-primary text-white text-center relative overflow-hidden">
       <!-- Decorative background element -->
       <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-prenda-secondary blur-2xl"></div>
       </div>

       <div class="max-w-2xl mx-auto relative z-10">
         <span class="text-white/80 font-bold uppercase tracking-widest text-xs mb-4 block">Newsletter</span>
         <h2 class="font-serif text-4xl md:text-5xl mb-6">Mantente Informado</h2>
         <p class="text-lg text-white/90 mb-10 font-light leading-relaxed">
           Recibe actualizaciones semanales sobre nuevas exposiciones, artistas emergentes y análisis del mercado de arte latinoamericano directamente en tu correo.
         </p>
         
         @if (status() === 'success') {
             <div class="bg-white/10 border border-white/20 p-8 rounded-lg animate-fade-in backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-4 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 class="font-serif text-2xl mb-2">¡Gracias por suscribirte!</h3>
                <p class="text-white/80 font-light">Pronto recibirás nuestras mejores selecciones en tu bandeja de entrada.</p>
             </div>
         } @else {
             <form (submit)="subscribe($event)" class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
                <div class="flex-1">
                    <input 
                      type="email" 
                      name="email"
                      [(ngModel)]="email"
                      required
                      placeholder="tu@correo.com" 
                      [disabled]="status() === 'loading'"
                      (input)="status() === 'error' ? status.set('idle') : null"
                      class="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white transition-all text-sm disabled:opacity-50"
                      [class.ring-2]="status() === 'error'"
                      [class.ring-white]="status() === 'error'"
                      [class.bg-white/20]="status() === 'error'"
                    >
                </div>
                <button 
                  type="submit" 
                  [disabled]="status() === 'loading'"
                  class="bg-white text-prenda-primary-dark px-8 py-4 font-bold rounded-full hover:bg-prenda-primary-light transition-colors uppercase tracking-wider text-xs shadow-lg disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] flex justify-center items-center"
                >
                  @if (status() === 'loading') {
                    <svg class="animate-spin h-4 w-4 text-prenda-primary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  } @else {
                    Suscribirse
                  }
                </button>
             </form>

             @if (status() === 'error') {
                 <div class="mt-4 animate-fade-in">
                    <span class="bg-white text-prenda-primary-dark px-4 py-2 rounded-full text-xs font-bold shadow-sm inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-2 text-red-500">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                        </svg>
                        Por favor ingresa un correo electrónico válido
                    </span>
                 </div>
             }
         }
       </div>
    </section>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HomeComponent {
  email = signal('');
  status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  subscribe(e: Event) {
    e.preventDefault();
    const email = this.email();
    
    // Basic validation
    if (!email || !email.includes('@') || !email.includes('.')) {
        this.status.set('error');
        return;
    }

    this.status.set('loading');
    
    // Simulate API call
    setTimeout(() => {
        this.status.set('success');
        this.email.set('');
    }, 1500);
  }

  resetForm() {
    this.status.set('idle');
    this.email.set('');
  }
}
