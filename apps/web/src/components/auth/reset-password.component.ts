import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, FormsModule],
    template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-white">
      
      <!-- Image Section -->
      <div class="hidden md:block w-1/2 bg-gray-100 relative overflow-hidden">
        <img 
          ngSrc="https://picsum.photos/id/1016/900/1200" 
          fill
          priority
          class="object-cover"
          alt="Reset Password Art"
        />
        <div class="absolute inset-0 bg-prenda-dark/20"></div>
        <div class="absolute bottom-12 left-12 text-white max-w-md">
          <p class="font-serif text-3xl leading-tight mb-4">"El futuro pertenece a quienes creen en la belleza de sus sueños."</p>
          <p class="text-sm font-medium tracking-widest uppercase">— Eleanor Roosevelt</p>
        </div>
      </div>

      <!-- Form Section -->
      <div class="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div class="w-full max-w-md">
            @if (success()) {
                 <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                    <h2 class="font-serif text-3xl text-prenda-dark mb-4">Contraseña Actualizada</h2>
                    <p class="text-gray-600 mb-8">Tu contraseña ha sido restablecida exitosamente. Ahora puedes ingresar con tus nuevas credenciales.</p>
                    <button (click)="goToLogin()" class="px-8 py-3 bg-prenda-dark text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-prenda-primary-dark transition-colors">
                        Ir a Iniciar Sesión
                    </button>
                 </div>
            } @else {
                <div class="text-center md:text-left mb-10">
                    <h1 class="font-serif text-4xl text-prenda-dark mb-2">Restablecer Contraseña</h1>
                    <p class="text-gray-500 font-light">Ingresa tu nueva contraseña a continuación.</p>
                </div>

                <form (ngSubmit)="onSubmit()" class="space-y-6">
                    <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nueva Contraseña</label>
                    <input 
                        type="password" 
                        [(ngModel)]="password" 
                        name="password"
                        required
                        minlength="6"
                        class="w-full border-b border-gray-300 py-3 px-0 text-prenda-dark placeholder-gray-300 focus:outline-none focus:border-prenda-secondary transition-colors bg-transparent"
                        placeholder="••••••••"
                    >
                    </div>

                    <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Confirmar Contraseña</label>
                    <input 
                        type="password" 
                        [(ngModel)]="confirmPassword" 
                        name="confirmPassword"
                        required
                        class="w-full border-b border-gray-300 py-3 px-0 text-prenda-dark placeholder-gray-300 focus:outline-none focus:border-prenda-secondary transition-colors bg-transparent"
                        placeholder="••••••••"
                    >
                    @if (password && confirmPassword && password !== confirmPassword) {
                        <p class="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
                    }
                    </div>
                    
                    @if (error()) {
                        <div class="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm">
                            {{ error() }}
                        </div>
                    }

                    <button 
                    type="submit" 
                    [disabled]="!isValid()"
                    class="w-full bg-prenda-dark text-white py-4 rounded-full font-medium hover:bg-prenda-primary-dark transition-colors uppercase tracking-wider text-xs shadow-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Restablecer Contraseña
                    </button>
                </form>
            }
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);

    password = '';
    confirmPassword = '';
    token = '';
    error = signal<string | null>(null);
    success = signal(false);

    constructor() {
        this.token = this.route.snapshot.paramMap.get('token') || '';
    }

    isValid() {
        return this.password && this.confirmPassword && this.password === this.confirmPassword && this.password.length >= 6;
    }

    onSubmit() {
        if (!this.isValid() || !this.token) return;

        this.auth.resetPassword(this.token, this.password).subscribe({
            next: () => {
                this.success.set(true);
                this.error.set(null);
            },
            error: (err) => {
                console.error('Reset password failed', err);
                this.error.set(err.error?.message || 'Hubo un error al restablecer la contraseña. El enlace puede haber expirado.');
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
