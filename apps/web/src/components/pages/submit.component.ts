
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white pt-16 pb-24">
      <div class="max-w-3xl mx-auto px-6 md:px-12">
        
        <div class="text-center mb-16">
            <h1 class="font-serif text-4xl md:text-5xl text-prenda-dark mb-6">Envía tu Propuesta</h1>
            <p class="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Completa el formulario a continuación para enviar tu perfil de artista, evento o propuesta editorial al equipo de curaduría.
            </p>
        </div>

        @if (status() === 'success') {
            <div class="bg-green-50 border border-green-100 rounded-lg p-12 text-center animate-fade-in">
                <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <h3 class="font-serif text-2xl text-prenda-dark mb-4">¡Propuesta Recibida!</h3>
                <p class="text-gray-600 font-light mb-8">
                    Gracias por contribuir a Prenda del Alma. Nuestro equipo revisará tu envío y te contactará si necesitamos más información.
                </p>
                <button (click)="resetForm()" class="text-sm font-bold uppercase tracking-wider text-prenda-secondary hover:text-prenda-dark border-b border-prenda-secondary pb-1">
                    Enviar otra propuesta
                </button>
            </div>
        } @else {
            <form (submit)="onSubmit($event)" class="space-y-8 bg-gray-50 p-8 md:p-12 rounded-lg border border-gray-100">
                
                <!-- Category Selector -->
                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Tipo de Envío</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @for (type of submissionTypes; track type.id) {
                            <label class="cursor-pointer group">
                                <input type="radio" name="type" [value]="type.id" [(ngModel)]="formData.type" class="peer hidden">
                                <div class="border border-gray-200 bg-white p-4 rounded-md peer-checked:border-prenda-secondary peer-checked:bg-prenda-secondary/5 transition-all h-full flex items-center shadow-sm">
                                    <div class="w-4 h-4 rounded-full border border-gray-300 mr-3 peer-checked:border-prenda-secondary peer-checked:bg-prenda-secondary shrink-0 relative flex items-center justify-center">
                                       <div class="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                    </div>
                                    <span class="text-sm font-medium text-gray-700 peer-checked:text-prenda-dark">{{ type.label }}</span>
                                </div>
                            </label>
                        }
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre Completo</label>
                        <input 
                            type="text" 
                            name="name"
                            [(ngModel)]="formData.name"
                            required
                            class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent placeholder-gray-300"
                            placeholder="Tu nombre"
                        >
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email de Contacto</label>
                        <input 
                            type="email" 
                            name="email"
                            [(ngModel)]="formData.email"
                            required
                            class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent placeholder-gray-300"
                            placeholder="tu@email.com"
                        >
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                         {{ getTitleLabel() }}
                    </label>
                    <input 
                        type="text" 
                        name="title"
                        [(ngModel)]="formData.title"
                        required
                        class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent placeholder-gray-300"
                        [placeholder]="getTitlePlaceholder()"
                    >
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Enlace a Material (Portafolio, Drive, Web)</label>
                    <input 
                        type="url" 
                        name="link"
                        [(ngModel)]="formData.link"
                        class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent placeholder-gray-300"
                        placeholder="https://"
                    >
                    <p class="text-[10px] text-gray-400 mt-1">Preferimos enlaces a carpetas de Google Drive, Dropbox o sitios web personales.</p>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Descripción / Propuesta</label>
                    <textarea 
                        rows="5" 
                        name="description"
                        [(ngModel)]="formData.description"
                        required
                        class="w-full border border-gray-200 rounded-sm p-3 text-prenda-dark focus:border-prenda-secondary focus:outline-none text-sm resize-none bg-white"
                        placeholder="Cuéntanos más sobre tu envío..."
                    ></textarea>
                </div>

                <div class="pt-4 text-right">
                    <button 
                        type="submit" 
                        [disabled]="status() === 'loading'"
                        class="bg-prenda-dark text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-prenda-primary-dark transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center"
                    >
                         @if (status() === 'loading') {
                            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                         }
                         Enviar Propuesta
                    </button>
                </div>

            </form>
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
export class SubmitComponent {
  status = signal<'idle' | 'loading' | 'success'>('idle');

  submissionTypes = [
    { id: 'artist', label: 'Artista / Portafolio' },
    { id: 'event', label: 'Evento / Exhibición' },
    { id: 'gallery', label: 'Galería / Institución' },
    { id: 'editorial', label: 'Propuesta Editorial' }
  ];

  formData = {
    type: 'artist',
    name: '',
    email: '',
    title: '',
    link: '',
    description: ''
  };

  getTitleLabel() {
    switch (this.formData.type) {
        case 'artist': return 'Nombre del Artista / Colectivo';
        case 'event': return 'Nombre del Evento';
        case 'gallery': return 'Nombre de la Institución';
        case 'editorial': return 'Título del Artículo / Tema';
        default: return 'Asunto';
    }
  }

  getTitlePlaceholder() {
    switch (this.formData.type) {
        case 'artist': return 'Ej. Gabriel Orozco';
        case 'event': return 'Ej. Bienal de La Habana';
        case 'gallery': return 'Ej. Galería Kurimanzutto';
        case 'editorial': return 'Ej. Entrevista a...';
        default: return '';
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.formData.name && this.formData.email) {
        this.status.set('loading');
        // Simulate API call
        setTimeout(() => {
            this.status.set('success');
        }, 1500);
    }
  }

  resetForm() {
    this.formData = {
        type: 'artist',
        name: '',
        email: '',
        title: '',
        link: '',
        description: ''
    };
    this.status.set('idle');
  }
}
