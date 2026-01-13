
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
          <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-prenda-secondary/10 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-prenda-primary/10 blur-3xl"></div>
      </div>

      <div class="w-full max-w-md relative z-10 bg-white p-8 md:p-12 rounded-lg border border-gray-100 shadow-sm text-center">
        
        <h1 class="font-serif text-3xl text-prenda-dark mb-4">Recuperar Contraseña</h1>
        
        @if (status() === 'success') {
           <div class="animate-fade-in">
              <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p class="text-gray-600 mb-8 font-light text-sm">
                Si existe una cuenta asociada a <strong class="text-prenda-dark">{{ email() }}</strong>, recibirás un correo con las instrucciones para restablecer tu contraseña en unos momentos.
              </p>
              <a routerLink="/login" class="inline-block w-full bg-prenda-dark text-white py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-prenda-primary-dark transition-colors">
                Volver a Iniciar Sesión
              </a>
           </div>
        } @else {
           <p class="text-gray-500 font-light mb-8 text-sm leading-relaxed">
             Ingresa la dirección de correo electrónico asociada a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
           </p>

           <form (submit)="onSubmit($event)" class="space-y-6 text-left">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  [(ngModel)]="email" 
                  name="email"
                  required
                  class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:outline-none focus:border-prenda-secondary transition-colors bg-transparent placeholder-gray-300"
                  placeholder="nombre@ejemplo.com"
                >
              </div>

              <button 
                type="submit" 
                [disabled]="status() === 'loading'"
                class="w-full bg-prenda-dark text-white py-4 rounded-full font-medium hover:bg-prenda-primary-dark transition-colors uppercase tracking-wider text-xs shadow-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                @if (status() === 'loading') {
                   <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                } @else {
                    Enviar Instrucciones
                }
              </button>
           </form>

           <div class="mt-8 pt-6 border-t border-gray-100">
              <a routerLink="/login" class="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-prenda-dark transition-colors flex items-center justify-center gap-2 group">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                 </svg>
                 Volver
              </a>
           </div>
        }
      </div>
    </div>
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
export class ForgotPasswordComponent {
  email = signal('');
  status = signal<'idle' | 'loading' | 'success'>('idle');

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.email()) {
       this.status.set('loading');
       // Simulate API delay
       setTimeout(() => {
          this.status.set('success');
       }, 1500);
    }
  }
}
