
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-api-coming-soon',
   standalone: true,
   imports: [CommonModule, FormsModule],
   template: `
    <div class="min-h-screen bg-prenda-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <!-- Background Abstract -->
      <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-prenda-secondary rounded-full blur-[120px]"></div>
         <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
      </div>

      <div class="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         
         <!-- Left Column: Content & Form -->
         <div class="text-left order-2 lg:order-1">
             <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-6">
                <div class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                <span class="font-mono text-[10px] uppercase tracking-widest text-white/80">Status: En Desarrollo</span>
             </div>
             
             <h1 class="font-serif text-5xl md:text-6xl mb-6 leading-tight">
               Ordenar, conectar y preservar la información del arte latinoamericano.
             </h1>
             
             <p class="text-white/70 text-lg font-light mb-10 leading-relaxed max-w-lg">
               Estamos diseñando la primera API dedicada a estructurar y conectar el ecosistema artístico de la región. Sé el primero en saber cuando estemos listos.
             </p>

             <!-- Waitlist Form -->
             <div class="mb-12">
                @if (!submitted()) {
                  <form (submit)="onSubmit($event)" class="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input 
                      type="email" 
                      [(ngModel)]="email" 
                      name="email"
                      required
                      placeholder="tu@email.com" 
                      class="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-prenda-secondary focus:bg-white/10 transition-all text-sm"
                    >
                    <button type="submit" class="bg-white text-prenda-dark px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-prenda-secondary hover:text-white transition-colors shadow-lg whitespace-nowrap">
                       Notificarme
                    </button>
                  </form>
                  <p class="text-xs text-white/30 mt-3 ml-1">Únete a la lista de espera para desarrolladores e investigadores.</p>
                } @else {
                   <div class="bg-green-500/20 border border-green-500/30 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-green-400">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                      </svg>
                      <div>
                         <p class="text-sm font-bold text-white">¡Estás en la lista!</p>
                         <p class="text-xs text-white/60">Te avisaremos apenas abramos el acceso a la beta.</p>
                      </div>
                   </div>
                }
             </div>

             <!-- Roadmap / Features Grid -->
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-8 border-t border-white/10">
                <div class="flex gap-4">
                   <div class="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 text-prenda-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                   </div>
                   <div>
                      <h4 class="font-bold text-white text-sm mb-1">Datos Estructurados</h4>
                      <p class="text-xs text-white/50 leading-relaxed">Normalización de biografías, historiales y catálogos razonados.</p>
                   </div>
                </div>
                
                <div class="flex gap-4">
                   <div class="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 text-prenda-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                      </svg>
                   </div>
                   <div>
                      <h4 class="font-bold text-white text-sm mb-1">Interconexión</h4>
                      <p class="text-xs text-white/50 leading-relaxed">Mapeo de relaciones entre artistas, movimientos y espacios culturales.</p>
                   </div>
                </div>

                <div class="flex gap-4">
                   <div class="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 text-prenda-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                   </div>
                   <div>
                      <h4 class="font-bold text-white text-sm mb-1">Recursos Digitales</h4>
                      <p class="text-xs text-white/50 leading-relaxed">Acceso a imágenes y documentación optimizada.</p>
                   </div>
                </div>

                <div class="flex gap-4">
                   <div class="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 text-prenda-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                   </div>
                   <div>
                      <h4 class="font-bold text-white text-sm mb-1">Contexto Regional</h4>
                      <p class="text-xs text-white/50 leading-relaxed">Taxonomías adaptadas a las realidades del arte en LatAm.</p>
                   </div>
                </div>
             </div>
         </div>

         <!-- Right Column: Code Snippet -->
         <div class="order-1 lg:order-2">
            <div class="bg-black/40 backdrop-blur-md rounded-xl p-6 md:p-8 font-mono text-xs md:text-sm text-gray-300 shadow-2xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
               
               <!-- Mac window dots -->
               <div class="flex gap-2 mb-6 opacity-50">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
               </div>

               <div class="space-y-2">
                  <p class="text-gray-500 italic select-none"># Concepto de consulta</p>
                  <p class="mb-4">
                    <span class="text-purple-400">const</span> 
                    <span class="text-blue-300"> results</span> 
                    <span class="text-white">=</span> 
                    <span class="text-purple-400">await</span> 
                    <span class="text-yellow-300">prenda</span>.<span class="text-blue-400">query</span>({{ '{' }}
                  </p>
                  
                  <div class="pl-6 space-y-1 border-l-2 border-white/5 ml-1">
                    <p>
                       <span class="text-cyan-300">context</span>: 
                       <span class="text-orange-300">'movement'</span>,
                    </p>
                    <p>
                       <span class="text-cyan-300">slug</span>: 
                       <span class="text-orange-300">'tropicalismo'</span>,
                    </p>
                    <p>
                       <span class="text-cyan-300">relations</span>: [
                       <span class="text-orange-300">'artists'</span>, 
                       <span class="text-orange-300">'exhibitions'</span>
                       ]
                    </p>
                  </div>

                  <p class="mt-4">{{ '}' }});</p>
                  
                  <p class="mt-8 text-gray-500 italic select-none"># Output Structure</p>
                  <p class="text-white">{{ '{' }}</p>
                  <p class="pl-4"><span class="text-blue-300">"data"</span>: <span class="text-white">[</span></p>
                  <p class="pl-8"><span class="text-white">{{ '{' }}</span> <span class="text-blue-300">"id"</span>: <span class="text-orange-300">"..."</span>, <span class="text-blue-300">"name"</span>: <span class="text-orange-300">"Hélio Oiticica"</span> <span class="text-white">{{ '}' }}</span>,</p>
                  <p class="pl-8"><span class="text-white">{{ '{' }}</span> <span class="text-blue-300">"id"</span>: <span class="text-orange-300">"..."</span>, <span class="text-blue-300">"name"</span>: <span class="text-orange-300">"Lygia Clark"</span> <span class="text-white">{{ '}' }}</span></p>
                  <p class="pl-4"><span class="text-white">]</span></p>
                  <p class="text-white">{{ '}' }}</p>
               </div>
            </div>
         </div>

      </div>
    </div>
  `
})
export class ApiComingSoonComponent {
   email = '';
   submitted = signal(false);

   onSubmit(e: Event) {
      e.preventDefault();
      if (this.email) {
         this.submitted.set(true);
      }
   }
}
