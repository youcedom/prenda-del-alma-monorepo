
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white pt-16 pb-24">
      <div class="max-w-3xl mx-auto px-6 md:px-12">
        <h1 class="font-serif text-4xl md:text-5xl text-prenda-dark mb-8">Términos y Condiciones</h1>
        <div class="prose prose-lg text-gray-600 font-light leading-relaxed">
          <p class="text-sm text-gray-400 uppercase tracking-widest mb-8">Última actualización: Enero 2025</p>
          <p>Bienvenido a Prenda del Alma. Al utilizar nuestro sitio web y servicios, usted acepta cumplir con los siguientes términos y condiciones.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">1. Uso del Sitio</h3>
          <p>Este sitio es una plataforma educativa y de archivo para el arte latinoamericano. El contenido proporcionado es para fines informativos, culturales y de investigación. Usted se compromete a utilizar el sitio únicamente para fines legales y de una manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute del sitio por parte de cualquier tercero.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">2. Propiedad Intelectual</h3>
          <p>Todo el contenido, incluyendo pero no limitado a imágenes, textos, logotipos y diseños, está protegido por derechos de autor y otras leyes de propiedad intelectual. Las imágenes de obras de arte pertenecen a sus respectivos artistas, sucesiones (estates) o instituciones. Prenda del Alma actúa como un archivo digital y no reclama la propiedad de las obras exhibidas a menos que se indique lo contrario.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">3. Cuentas de Usuario</h3>
          <p>Al crear una cuenta en Prenda del Alma, usted es responsable de mantener la confidencialidad de su información de inicio de sesión y de todas las actividades que ocurran bajo su cuenta. Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos o participen en comportamientos abusivos.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">4. Exactitud de la Información</h3>
          <p>Nos esforzamos por garantizar que la información en nuestro archivo sea precisa y actualizada. Sin embargo, dada la naturaleza histórica y evolutiva del arte, no podemos garantizar la exactitud completa de todos los datos. Agradecemos las correcciones y contribuciones de la comunidad.</p>
          
          <h3 class="text-prenda-dark font-serif text-2xl mt-8 mb-4">5. Modificaciones</h3>
          <p>Prenda del Alma se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página. Su uso continuado del sitio constituirá su aceptación de dichos cambios.</p>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}
