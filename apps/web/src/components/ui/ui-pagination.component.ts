
import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages() > 1) {
      <div class="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-8 mt-8 gap-4">
        <div class="text-xs text-gray-500 uppercase tracking-wide">
           Mostrando {{ startItem() }} - {{ endItem() }} de {{ totalItems() }}
        </div>
        
        <div class="flex gap-2 items-center">
           <button 
             (click)="changePage(currentPage() - 1)" 
             [disabled]="currentPage() === 1"
             class="px-4 py-2 border border-gray-200 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             Anterior
           </button>
           
           <span class="text-xs font-medium text-gray-600 px-2">
             Página {{ currentPage() }} de {{ totalPages() }}
           </span>

           <button 
             (click)="changePage(currentPage() + 1)" 
             [disabled]="currentPage() === totalPages()"
             class="px-4 py-2 border border-gray-200 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             Siguiente
           </button>
        </div>
      </div>
    }
  `
})
export class UiPaginationComponent {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  pageChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  
  startItem = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  endItem = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
