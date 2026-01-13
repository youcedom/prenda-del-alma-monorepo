
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="w-full grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
      
      <!-- Text Content -->
      <div class="flex flex-col justify-center px-6 md:px-16 py-12 md:py-20 bg-stone-50 order-2 md:order-1">
        <h1 class="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight text-prenda-dark mb-6">
          Lo que está pasando en el arte latinoamericano.
        </h1>
        <p class="text-lg md:text-xl text-gray-600 mb-10 max-w-md font-light leading-relaxed">
          Artistas, obras, galerías, instituciones y eventos del arte contemporáneo de la región en un solo lugar.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a routerLink="/register" class="text-center bg-prenda-dark text-white px-8 py-3.5 rounded-full font-medium hover:bg-prenda-primary-dark transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gray-200 cursor-pointer">
            Unirse a la Comunidad
          </a>
          <a routerLink="/artists" class="text-center px-8 py-3.5 rounded-full border border-gray-300 font-medium hover:bg-prenda-primary-light/20 transition-colors text-prenda-dark hover:border-prenda-primary cursor-pointer">
            Descubrir Artistas
          </a>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative h-[400px] md:h-auto bg-gray-200 order-1 md:order-2 overflow-hidden">
        <img 
          src="https://picsum.photos/id/160/1200/1200" 
          alt="Featured Art" 
          class="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div class="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur-sm px-4 py-3 max-w-xs shadow-sm border border-gray-100">
          <p class="font-serif text-lg leading-none mb-1 text-prenda-dark">Nueva Perspectiva</p>
          <p class="text-xs text-gray-500 uppercase tracking-wide">Colección Enero 2025</p>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {}
