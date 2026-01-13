
import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  template: `
    <div class="min-h-screen bg-white text-prenda-dark">
      
      <!-- Emotional Hero -->
      <div class="relative w-full h-[80vh] bg-gray-900 overflow-hidden">
        <img 
          ngSrc="https://picsum.photos/id/1015/1600/1000" 
          fill
          priority
          class="object-cover opacity-60"
          alt="Latin American Landscape"
        />
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <span class="text-white/80 font-bold uppercase tracking-[0.2em] text-xs mb-6 animate-fade-in">Nuestra Identidad</span>
          <h1 class="text-white font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight max-w-4xl animate-fade-in-up">
            Prenda Querida
          </h1>
          <p class="text-white/90 text-lg md:text-xl font-light max-w-2xl leading-relaxed animate-fade-in-up-delay">
            Una carta de amor a la memoria y la belleza de nuestro continente.
          </p>
        </div>
      </div>

      <!-- The Open Letter -->
      <section class="max-w-4xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div class="prose prose-lg md:prose-xl prose-headings:font-serif prose-p:font-light prose-p:text-gray-600 prose-p:leading-loose mx-auto text-justify">
          <h2 class="font-serif text-4xl md:text-5xl text-prenda-dark mb-12 text-center not-prose">A ti, Latinoamérica.</h2>
          
          <p class="first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-prenda-secondary">
            Nacimos de la grieta y del oro. Somos el resultado de un choque de mundos que, aunque doloroso, forjó una identidad inquebrantable. Prenda del Alma no es una empresa, ni siquiera es solo un archivo; es un intento desesperado y hermoso por no olvidar quiénes somos.
          </p>

          <p>
            Te miramos a través de tus artistas porque ellos son los únicos que han sabido traducirte. Desde el muralismo que gritó las injusticias en las paredes de México, hasta el cinetismo que intentó ordenar el caos en Venezuela. Desde la tropicalia brasileña que devoró la cultura extranjera para hacerla suya, hasta el conceptualismo político que resistió en el Cono Sur.
          </p>

          <div class="my-16 -mx-6 md:-mx-24 relative aspect-[21/9] bg-gray-100 not-prose">
             <img ngSrc="https://picsum.photos/id/1040/1200/600" fill class="object-cover" alt="Artistic texture">
             <p class="absolute bottom-4 right-4 text-xs text-white/80 italic">Detalle de textura, Archivo Prenda.</p>
          </div>

          <p>
            Creemos que el arte es la "prenda" más valiosa de tu alma. Es el testigo silencioso de tus revoluciones, tus fiestas patronales, tus selvas devoradas y tus ciudades de concreto infinito.
          </p>

          <p>
            Este espacio digital existe para que esa memoria no se disperse. Para que un estudiante en Lima pueda dialogar con la obra de un maestro en La Habana. Para que el mercado entienda que aquí no solo hay "color", hay discurso, hay herida y hay una sofisticación intelectual que desafía los cánones hegemónicos.
          </p>

          <p>
            Somos curadores, historiadores y soñadores construyendo la biblioteca viva que te mereces. Porque amarte es preservarte, y preservarte es la única forma de seguir existiendo.
          </p>

          <div class="mt-16 text-right not-prose">
            <p class="font-serif text-2xl text-prenda-dark italic">— El Equipo de Prenda del Alma</p>
            <p class="text-sm text-gray-400 uppercase tracking-widest mt-2">LatAm para el mundo</p>
          </div>
        </div>
      </section>

      <!-- The Manifesto / Values -->
      <section class="bg-prenda-primary-light/10 py-24 border-t border-prenda-primary-light/20">
        <div class="max-w-[1400px] mx-auto px-6 md:px-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            
            <div class="space-y-4">
              <span class="text-prenda-secondary text-5xl font-serif block mb-6">I.</span>
              <h3 class="text-xl font-bold uppercase tracking-widest text-prenda-dark">Descentralización</h3>
              <p class="text-gray-600 font-light leading-relaxed">
                Rompemos la hegemonía de las capitales tradicionales. El arte sucede tanto en la galería de Nueva York como en el taller comunitario de Oaxaca.
              </p>
            </div>

            <div class="space-y-4">
              <span class="text-prenda-secondary text-5xl font-serif block mb-6">II.</span>
              <h3 class="text-xl font-bold uppercase tracking-widest text-prenda-dark">Memoria</h3>
              <p class="text-gray-600 font-light leading-relaxed">
                Contra la amnesia digital y la inmediatez de las redes sociales, proponemos la profundidad del archivo y la lentitud de la reflexión crítica.
              </p>
            </div>

            <div class="space-y-4">
              <span class="text-prenda-secondary text-5xl font-serif block mb-6">III.</span>
              <h3 class="text-xl font-bold uppercase tracking-widest text-prenda-dark">Comunidad</h3>
              <p class="text-gray-600 font-light leading-relaxed">
                El arte no es un objeto estático, es una conversación. Conectamos a los creadores con quienes buscan entender el mundo a través de sus ojos.
              </p>
            </div>

          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-24 text-center bg-prenda-dark text-white">
         <div class="max-w-2xl mx-auto px-6">
            <h2 class="font-serif text-4xl mb-6">Sé parte de la historia</h2>
            <p class="text-white/70 text-lg mb-10 font-light">
              Ya sea que crees, colecciones o simplemente admires, tu mirada completa esta obra.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
               <a routerLink="/register" class="bg-white text-prenda-dark px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-prenda-secondary hover:text-white transition-colors">Unirse a la Comunidad</a>
               <a routerLink="/artists" class="border border-white/30 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white/10 transition-colors">Explorar el Archivo</a>
            </div>
         </div>
      </section>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 1s ease-out forwards; opacity: 0; }
    .animate-fade-in-up { animation: fadeInUp 1s ease-out 0.3s forwards; opacity: 0; }
    .animate-fade-in-up-delay { animation: fadeInUp 1s ease-out 0.6s forwards; opacity: 0; }
    
    @keyframes fadeIn { to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AboutComponent {}
