
import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-white">
      
      <!-- Image Section -->
      <div class="hidden md:block w-1/2 bg-gray-100 relative overflow-hidden">
        <img 
          ngSrc="https://picsum.photos/id/1011/900/1200" 
          fill
          priority
          class="object-cover"
          alt="Login Art"
        />
        <div class="absolute inset-0 bg-prenda-dark/20"></div>
        <div class="absolute bottom-12 left-12 text-white max-w-md">
          <p class="font-serif text-3xl leading-tight mb-4">"El arte es la única forma de escapar sin salir de casa."</p>
          <p class="text-sm font-medium tracking-widest uppercase">— Twyla Tharp</p>
        </div>
      </div>

      <!-- Form Section -->
      <div class="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <!-- Mobile Background Image -->
        <div class="md:hidden absolute top-0 left-0 w-full h-48 bg-gray-100 z-0">
             <img 
              ngSrc="https://picsum.photos/id/1011/800/600" 
              fill
              class="object-cover opacity-50"
              alt="Login Art Mobile"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
        </div>

        <div class="w-full max-w-md relative z-10 pt-24 md:pt-0">
          <div class="text-center md:text-left mb-10">
            <h1 class="font-serif text-4xl text-prenda-dark mb-2">Bienvenido</h1>
            <p class="text-gray-500 font-light">Ingresa tus credenciales para acceder a tu colección.</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                required
                class="w-full border-b border-gray-300 py-3 px-0 text-prenda-dark placeholder-gray-300 focus:outline-none focus:border-prenda-secondary transition-colors bg-transparent"
                placeholder="nombre@ejemplo.com"
              >
            </div>

            <div>
              <div class="flex justify-between mb-2">
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Contraseña</label>
                <a routerLink="/forgot-password" class="text-xs text-prenda-secondary hover:underline cursor-pointer">¿Olvidaste tu contraseña?</a>
              </div>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password"
                required
                class="w-full border-b border-gray-300 py-3 px-0 text-prenda-dark placeholder-gray-300 focus:outline-none focus:border-prenda-secondary transition-colors bg-transparent"
                placeholder="••••••••"
              >
            </div>

            <button 
              type="submit" 
              class="w-full bg-prenda-dark text-white py-4 rounded-full font-medium hover:bg-prenda-primary-dark transition-colors uppercase tracking-wider text-xs shadow-lg mt-8"
            >
              Ingresar
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-gray-500">
            ¿Aún no tienes cuenta? 
            <a routerLink="/register" class="text-prenda-dark font-bold hover:text-prenda-secondary transition-colors underline decoration-1 underline-offset-4">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  router = inject(Router);
  auth = inject(AuthService);
  email = '';
  password = '';

  onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed', err);
        // Show error message (omitted for brevity)
      }
    });
  }
}
