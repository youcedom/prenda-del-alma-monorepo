
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white pt-16 pb-24">
      <div class="max-w-4xl mx-auto px-6 md:px-12">
        <h1 class="font-serif text-4xl md:text-5xl text-prenda-dark mb-6">Contacto</h1>
        <p class="text-xl text-gray-500 font-light mb-12 max-w-2xl">
          ¿Tienes alguna pregunta, sugerencia o simplemente quieres saludar? Estamos aquí para escucharte.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Contact Info -->
          <div class="md:col-span-1 space-y-8">
             <div>
                <h3 class="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Email General</h3>
                <a href="mailto:hola@prendadelalma.com" class="text-prenda-secondary hover:underline">hola@prendadelalma.com</a>
             </div>
             <div>
                <h3 class="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Prensa</h3>
                <a href="mailto:prensa@prendadelalma.com" class="text-prenda-secondary hover:underline">prensa@prendadelalma.com</a>
             </div>
             <div>
                <h3 class="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Oficina</h3>
                <p class="text-gray-600 text-sm leading-relaxed">
                  Av. Reforma 123, Piso 4<br>
                  Col. Juárez, 06600<br>
                  Ciudad de México, México
                </p>
             </div>
          </div>

          <!-- Form -->
          <div class="md:col-span-2">
             <form (submit)="onSubmit($event)" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre</label>
                      <input type="text" class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent" placeholder="Tu nombre">
                   </div>
                   <div>
                      <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                      <input type="email" class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent" placeholder="tu@email.com">
                   </div>
                </div>
                
                <div>
                   <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Asunto</label>
                   <select class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent">
                      <option>Consulta General</option>
                      <option>Soporte Técnico</option>
                      <option>Editorial</option>
                      <option>Alianzas</option>
                      <option>Otro</option>
                   </select>
                </div>

                <div>
                   <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mensaje</label>
                   <textarea rows="5" class="w-full border border-gray-200 rounded-sm p-3 text-prenda-dark focus:border-prenda-secondary focus:outline-none text-sm resize-none" placeholder="Escribe tu mensaje aquí..."></textarea>
                </div>

                <div class="pt-2">
                   <button type="submit" class="bg-prenda-dark text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-prenda-primary-dark transition-colors shadow-md">
                      Enviar Mensaje
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  onSubmit(e: Event) {
    e.preventDefault();
    alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
  }
}
