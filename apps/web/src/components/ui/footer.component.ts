
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-prenda-primary-dark text-prenda-primary-light pt-16 pb-8 px-6 md:px-12">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <!-- Brand Column -->
        <div class="space-y-4">
          <h3 class="font-serif text-2xl mb-6 text-white">Prenda del Alma</h3>
          <p class="text-prenda-primary-light/80 text-sm leading-relaxed">
            La biblioteca viva del arte contemporáneo en Latinoamérica.
          </p>
          <div class="flex space-x-4 pt-2">
             <a href="https://instagram.com/prendadelalma" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">IG</a>
             <a href="https://threads.com/prendadelalma" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">TH</a>
             <a href="https://x.com/prendadelalma" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">X</a>
          </div>
          
          <!-- Submit Button -->
          <div class="pt-4">
             <a routerLink="/submit" class="inline-flex items-center justify-center px-6 py-3 border border-prenda-secondary-light/50 rounded-full text-xs font-bold uppercase tracking-wider text-prenda-secondary-light hover:bg-prenda-secondary-light hover:text-prenda-primary-dark transition-all duration-300 shadow-sm hover:shadow-md">
               Enviar Propuesta
             </a>
          </div>
        </div>

        <!-- 1. Explorar -->
        <div>
          <h4 class="font-medium text-sm uppercase tracking-wider mb-6 text-prenda-secondary-light">Explorar</h4>
          <ul class="space-y-3 text-sm text-prenda-primary-light/80">
            <li><a routerLink="/category/pintura" class="hover:text-white transition-colors">Pintura</a></li>
            <li><a routerLink="/category/escultura" class="hover:text-white transition-colors">Escultura</a></li>
            <li><a routerLink="/category/fotografia" class="hover:text-white transition-colors">Fotografía</a></li>
            <li><a routerLink="/category/grabado" class="hover:text-white transition-colors">Grabado</a></li>
            <li><a routerLink="/category/instalacion" class="hover:text-white transition-colors">Instalación</a></li>
          </ul>
        </div>

        <!-- 2. Directorio -->
        <div>
          <h4 class="font-medium text-sm uppercase tracking-wider mb-6 text-prenda-secondary-light">Directorio</h4>
          <ul class="space-y-3 text-sm text-prenda-primary-light/80">
            <li><a routerLink="/artists" class="hover:text-white transition-colors">Artistas</a></li>
            <li><a routerLink="/disciplines" class="hover:text-white transition-colors">Disciplinas</a></li>
            <li><a routerLink="/galleries" class="hover:text-white transition-colors">Galerías</a></li>
            <li><a routerLink="/museums" class="hover:text-white transition-colors">Instituciones</a></li>
            <li><a routerLink="/events" class="hover:text-white transition-colors">Calendario</a></li>
          </ul>
        </div>

        <!-- 3. Comunidad -->
        <div>
          <h4 class="font-medium text-sm uppercase tracking-wider mb-6 text-prenda-secondary-light">Comunidad</h4>
          <ul class="space-y-3 text-sm text-prenda-primary-light/80">
            <li><a routerLink="/login" class="hover:text-white transition-colors">Iniciar Sesión</a></li>
            <li><a routerLink="/register" class="hover:text-white transition-colors">Registrarse</a></li>
            <li><a routerLink="/articles" class="hover:text-white transition-colors">Editorial</a></li>
            <li><a routerLink="/contact" class="hover:text-white transition-colors">Contacto</a></li>
            <li><a routerLink="/partners" class="hover:text-white transition-colors">Partners</a></li>
          </ul>
        </div>

      </div>

      <div class="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-prenda-primary-light/60">
        <div class="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-4 md:mb-0">
          <span>© {{ currentYear }} Prenda del Alma • una marca <a href="https://cox3.io" target="_blank" class="hover:text-white transition-colors">COx3</a></span>
          <a routerLink="/about" class="hover:text-white">Nosotros</a>
          <a routerLink="/terms" class="hover:text-white">Términos</a>
          <a routerLink="/privacy" class="hover:text-white">Privacidad</a>
          <a routerLink="/api" class="hover:text-white">API</a>
        </div>
        <div class="flex items-center space-x-2">
           <span>Hecho con &lt;3 para LatAm</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
