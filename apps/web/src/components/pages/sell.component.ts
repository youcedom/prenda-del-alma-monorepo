
import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      
      <!-- Minimalist Hero -->
      <section class="relative pt-24 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto text-center">
         <span class="text-xs font-bold uppercase tracking-widest text-prenda-secondary mb-4 block">Comunidad</span>
         <h1 class="font-serif text-5xl md:text-7xl text-prenda-dark mb-8 leading-tight">Partners del Alma</h1>
         <p class="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
           Una invitación abierta a galerías, instituciones y artistas para construir juntos el archivo digital más completo de América Latina.
         </p>
      </section>

      <!-- Value Props -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1800px] mx-auto px-6 md:px-12 mb-24">
         <div class="relative aspect-[4/5] md:aspect-[3/4] bg-gray-100 overflow-hidden">
             <img 
              ngSrc="https://picsum.photos/id/449/800/1200" 
              fill 
              class="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              alt="Collaboration Art"
            />
         </div>
         <div class="flex flex-col justify-center space-y-12 py-12">
            <div>
               <h3 class="font-serif text-3xl text-prenda-dark mb-4">Visibilidad Editorial</h3>
               <p class="text-gray-600 font-light leading-relaxed">
                 Sus exposiciones y artistas integrados en nuestra narrativa editorial. Conectamos su programa con una audiencia global de curadores y coleccionistas.
               </p>
            </div>
            <div>
               <h3 class="font-serif text-3xl text-prenda-dark mb-4">Gestión de Archivo</h3>
               <p class="text-gray-600 font-light leading-relaxed">
                 Digitalice su inventario con estándares museísticos. Ofrecemos herramientas para la catalogación y preservación de la memoria histórica de su institución.
               </p>
            </div>
            <div>
               <h3 class="font-serif text-3xl text-prenda-dark mb-4">Alianzas Comerciales</h3>
               <p class="text-gray-600 font-light leading-relaxed">
                 ¿Interesado en consignar o vender? Facilitamos conexiones transparentes entre su acervo y nuestra red de coleccionistas privados.
               </p>
            </div>
         </div>
      </section>

      <!-- Contact Form -->
      <section class="bg-prenda-primary-light/20 py-24 px-6 md:px-12">
         <div class="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100">
            <h2 class="font-serif text-3xl text-center text-prenda-dark mb-2">Colabora con Nosotros</h2>
            <p class="text-center text-gray-500 text-sm mb-10">
              Cuéntanos sobre tu proyecto o institución y exploremos cómo trabajar juntos.
            </p>

            <form class="space-y-6">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre / Institución</label>
                    <input type="text" class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none" placeholder="Ej. Galería Sur">
                  </div>
                   <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tipo de Partner</label>
                    <select class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent">
                      <option>Galería</option>
                      <option>Artista</option>
                      <option>Museo / Fundación</option>
                      <option>Coleccionista Privado</option>
                      <option>Otro</option>
                    </select>
                  </div>
               </div>

               <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Correo de Contacto</label>
                  <input type="email" class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none" placeholder="contacto@ejemplo.com">
               </div>

               <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mensaje / Propuesta</label>
                  <textarea rows="4" class="w-full border border-gray-200 rounded-sm p-3 text-prenda-dark focus:border-prenda-secondary focus:outline-none text-sm" placeholder="¿En qué te gustaría colaborar? (Consignación, archivo, prensa...)"></textarea>
               </div>

               <div class="pt-6">
                  <button class="w-full bg-prenda-dark text-white py-4 rounded-full font-medium hover:bg-prenda-primary-dark transition-colors uppercase tracking-wider text-xs">
                     Enviar Mensaje
                  </button>
               </div>
            </form>
         </div>
      </section>

    </div>
  `
})
export class SellComponent {}
