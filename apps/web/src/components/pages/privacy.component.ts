
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white pt-16 pb-24">
      <div class="max-w-3xl mx-auto px-6 md:px-12">
        <h1 class="font-serif text-4xl md:text-5xl text-prenda-dark mb-8">Política de Privacidad</h1>
        <div class="prose prose-lg text-gray-600 font-light leading-relaxed">
          <p class="text-sm text-gray-400 uppercase tracking-widest mb-8">Última actualización: Enero 2025</p>
          <p>En Prenda del Alma, respetamos profundamente su privacidad y estamos comprometidos a proteger sus datos personales. Esta política describe cómo recopilamos, utilizamos y protegemos su información.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">1. Recopilación de Datos</h3>
          <p>Recopilamos información que usted nos proporciona directamente cuando:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Crea una cuenta de usuario.</li>
            <li>Se suscribe a nuestro boletín informativo.</li>
            <li>Guarda obras, artistas o eventos en sus listas personales.</li>
            <li>Se pone en contacto con nosotros para consultas o colaboraciones.</li>
          </ul>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">2. Uso de la Información</h3>
          <p>Utilizamos sus datos personales para los siguientes fines:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Proporcionar y mantener nuestros servicios.</li>
            <li>Personalizar su experiencia en el sitio (ej. recomendaciones de arte).</li>
            <li>Enviar comunicaciones relevantes, como actualizaciones editoriales o notificaciones de eventos (solo si ha dado su consentimiento).</li>
            <li>Mejorar la funcionalidad y seguridad de nuestra plataforma.</li>
          </ul>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">3. Cookies y Tecnologías Similares</h3>
          <p>Utilizamos cookies para analizar el tráfico del sitio, recordar sus preferencias y mejorar la funcionalidad general. Puede gestionar sus preferencias de cookies a través de la configuración de su navegador en cualquier momento.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">4. Compartir Información</h3>
          <p>No vendemos, alquilamos ni comercializamos sus datos personales con terceros con fines promocionales. Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio (ej. alojamiento web, servicios de correo electrónico), siempre bajo estrictos acuerdos de confidencialidad.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">5. Sus Derechos</h3>
          <p>Usted tiene derecho a acceder, corregir o eliminar su información personal en cualquier momento. Puede hacerlo a través de la configuración de su cuenta o contactándonos directamente.</p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
