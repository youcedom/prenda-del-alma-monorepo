
import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disciplines-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16">
      <div class="max-w-[1800px] mx-auto px-6 md:px-12">
        <div class="flex justify-between items-center mb-8">
           <h2 class="font-serif text-3xl text-gray-900">Explorar por disciplinas</h2>
           
           <!-- Navigation Arrows -->
           <div class="flex gap-2">
              <button 
                (click)="scroll('left')"
                class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-prenda-dark transition-all text-gray-500 hover:text-prenda-dark focus:outline-none"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                (click)="scroll('right')"
                class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-prenda-dark transition-all text-gray-500 hover:text-prenda-dark focus:outline-none"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
           </div>
        </div>
        
        <div 
          #scrollContainer
          class="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 gap-4 hide-scrollbar snap-x cursor-grab active:cursor-grabbing select-none"
          (mousedown)="onMouseDown($event)"
          (mouseleave)="onMouseLeave()"
          (mouseup)="onMouseUp()"
          (mousemove)="onMouseMove($event)"
        >
          @for (category of categories; track category.id) {
            <div 
              (click)="onCardClick(category.slug)"
              class="flex-shrink-0 w-72 md:w-96 h-48 md:h-64 relative group cursor-pointer snap-start overflow-hidden bg-gray-100"
            >
              <img 
                [src]="category.image" 
                alt="" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 pointer-events-none"
                draggable="false"
              />
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="text-white font-serif text-xl md:text-2xl tracking-wide drop-shadow-md border-b-2 border-transparent group-hover:border-white transition-all pb-1">{{ category.name }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class DisciplinesGridComponent {
  // Static categories for now as they are not in backend
  categories = [
    { id: '1', name: 'Pintura', slug: 'pintura', image: 'https://picsum.photos/id/10/500/500' },
    { id: '2', name: 'Fotografía', slug: 'fotografia', image: 'https://picsum.photos/id/16/500/500' },
    { id: '3', name: 'Escultura', slug: 'escultura', image: 'https://picsum.photos/id/24/500/500' },
    { id: '4', name: 'Grabado', slug: 'grabado', image: 'https://picsum.photos/id/34/500/500' }
  ];
  router = inject(Router);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  isDown = false;
  startX = 0;
  scrollLeft = 0;
  isDragging = false;

  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.isDragging = false;
    this.startX = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseUp() {
    this.isDown = false;
    setTimeout(() => {
      this.isDragging = false;
    }, 50);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;

    if (Math.abs(walk) > 5) {
      this.isDragging = true;
    }
  }

  scroll(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 400;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  onCardClick(slug: string) {
    if (!this.isDragging) {
      this.router.navigate(['/category', slug]);
    }
  }
}
