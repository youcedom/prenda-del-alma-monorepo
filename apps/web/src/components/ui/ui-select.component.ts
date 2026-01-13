
import { Component, input, output, signal, ElementRef, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full text-left">
      <!-- Trigger Button -->
      <button 
        type="button" 
        (click)="toggle()"
        class="w-full cursor-pointer bg-white border border-gray-200 text-gray-700 py-2.5 px-3 pr-8 rounded-sm focus:outline-none focus:border-prenda-dark focus:ring-1 focus:ring-prenda-dark/50 text-sm flex items-center justify-between transition-all duration-200"
        [class.border-prenda-dark]="isOpen()"
      >
        <span class="block truncate" [class.text-gray-400]="!value()">
          {{ displayValue() }}
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
           <svg 
             class="h-4 w-4 transition-transform duration-200" 
             [class.rotate-180]="isOpen()"
             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
           </svg>
        </span>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fade-in-down">
          <!-- Optional Null/Reset Option -->
          @if (showReset()) {
            <div 
              (click)="select(null)"
              class="relative cursor-pointer select-none py-2.5 pl-3 pr-9 text-gray-500 hover:bg-gray-50 hover:text-prenda-dark border-b border-gray-50 italic"
            >
              <span class="block truncate font-light">{{ placeholder() }}</span>
            </div>
          }

          <!-- Options List -->
          @for (option of options(); track $index) {
            <div 
              (click)="select(option)"
              class="relative cursor-pointer select-none py-2.5 pl-3 pr-9 hover:bg-prenda-primary-light/20 text-gray-900 transition-colors"
              [class.bg-gray-50]="isSelected(option)"
              [class.font-medium]="isSelected(option)"
            >
              <span class="block truncate">
                {{ option }}
              </span>
              
              @if (isSelected(option)) {
                <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-prenda-secondary">
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                </span>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in-down {
      animation: fadeInDown 0.15s ease-out;
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UiSelectComponent {
  // Inputs
  options = input.required<any[]>();
  value = input<any>(null);
  placeholder = input<string>('Seleccionar...');
  showReset = input<boolean>(true);

  // Outputs
  valueChange = output<any>();

  // State
  isOpen = signal(false);

  // Computed display
  displayValue = computed(() => {
    const v = this.value();
    if (!v) return this.placeholder();
    return v;
  });

  constructor(private elementRef: ElementRef) {}

  // Close when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  select(option: any) {
    this.valueChange.emit(option);
    this.isOpen.set(false);
  }

  isSelected(option: any): boolean {
    return this.value() === option;
  }
}
