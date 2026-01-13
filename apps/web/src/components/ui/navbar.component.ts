
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  host: {
    class: 'sticky top-0 z-50 block w-full'
  },
  template: `
    <nav class="w-full bg-white transition-all duration-300 flex flex-col font-sans border-b border-gray-100 shadow-sm relative">
      
      <!-- Primary Top Bar -->
      <div class="flex items-center justify-between px-4 md:px-8 py-3">
        
        <!-- Left: Logo & Mobile Menu -->
        <div class="flex items-center">
          <button (click)="toggleMobileMenu()" class="md:hidden text-2xl mr-4 text-prenda-dark p-1 hover:bg-gray-100 rounded focus:outline-none">
            @if (isMobileMenuOpen()) {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            } @else {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            }
          </button>
          
          <a routerLink="/home" class="font-serif text-3xl tracking-tight text-prenda-dark hover:opacity-80 transition-opacity">
            Prenda del Alma
          </a>
        </div>

        <!-- Center: Search Bar (Desktop) -->
        <div class="hidden md:block flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (keydown.enter)="onSearch()"
            placeholder="Buscar artista, evento, institución..." 
            class="w-full bg-gray-100/50 border-transparent focus:bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-prenda-primary placeholder-gray-500 transition-all text-prenda-dark"
          >
          <svg (click)="onSearch()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3.5 top-2 w-5 h-5 text-gray-400 cursor-pointer hover:text-prenda-dark">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>

        <!-- Right: Actions (Desktop) -->
        <div class="hidden md:flex items-center space-x-4 md:space-x-6">
           <a routerLink="/articles" class="hidden lg:block text-sm font-medium text-prenda-dark/80 hover:text-prenda-secondary transition-colors" routerLinkActive="text-prenda-secondary font-semibold">Editorial</a>
           <div class="hidden md:block h-5 w-px bg-gray-200"></div>
           
           @if (currentUser()) {
             <div class="relative">
                <button 
                  (click)="isUserMenuOpen.set(!isUserMenuOpen())"
                  class="flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <img [src]="currentUser()?.avatar" class="w-8 h-8 rounded-full border border-gray-200 object-cover" alt="User">
                  <span class="text-sm font-medium text-prenda-dark hidden lg:block">{{ currentUser()?.name }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-gray-400">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                  </svg>
                </button>

                <!-- User Dropdown -->
                @if (isUserMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50 animate-fade-in-down">
                     <div class="px-4 py-2 border-b border-gray-50 mb-1">
                        <p class="text-xs text-gray-500">Conectado como</p>
                        <p class="text-sm font-bold text-prenda-dark truncate">{{ currentUser()?.email }}</p>
                     </div>
                     <a routerLink="/account" (click)="isUserMenuOpen.set(false)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-prenda-secondary transition-colors">Mi Perfil</a>
                     <a [routerLink]="['/account']" [queryParams]="{tab: 'lists'}" (click)="isUserMenuOpen.set(false)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-prenda-secondary transition-colors">Listas Guardadas</a>
                     <div class="border-t border-gray-50 my-1"></div>
                     <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors">Cerrar Sesión</button>
                  </div>
                }
             </div>
           } @else {
             <a routerLink="/login" routerLinkActive="text-prenda-secondary font-semibold" class="text-sm font-medium text-prenda-dark/80 hover:text-prenda-secondary transition-colors">Ingresar</a>
             <a routerLink="/register" class="text-sm font-medium bg-prenda-dark text-white px-5 py-2 rounded-full hover:bg-prenda-primary-dark transition-colors">Registrarse</a>
           }
        </div>
      </div>

      <!-- Secondary Navigation Bar (Directory) - Desktop Only -->
      <div class="hidden md:flex justify-center py-3 bg-white border-t border-gray-5 relative z-40">
        <div class="flex items-center space-x-8 text-sm font-medium text-gray-600 px-4">
          <a routerLink="/artists" routerLinkActive="text-prenda-secondary font-semibold" class="hover:text-prenda-secondary transition-colors">Artistas</a>
          
          <div class="w-px h-4 bg-gray-200"></div>

          <!-- Disciplines Dropdown -->
          <div 
            class="relative group"
            (mouseenter)="openDropdown()"
            (mouseleave)="closeDropdownDelayed()"
          >
            <a 
                routerLink="/disciplines" 
                routerLinkActive="text-prenda-secondary font-semibold" 
                class="hover:text-prenda-secondary transition-colors flex items-center cursor-pointer py-2"
            >
                Arte
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 ml-1 text-gray-400 group-hover:text-prenda-secondary transition-colors">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </a>

            <!-- Dropdown Menu -->
             <div 
                class="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-56 bg-white border border-gray-100 shadow-xl rounded-lg py-2 transition-all duration-200 origin-top"
                [class.opacity-0]="!isDropdownOpen()"
                [class.invisible]="!isDropdownOpen()"
                [class.opacity-100]="isDropdownOpen()"
                [class.visible]="isDropdownOpen()"
                [class.translate-y-2]="!isDropdownOpen()"
                [class.translate-y-0]="isDropdownOpen()"
             >
                <div class="absolute -top-2 left-0 w-full h-2 bg-transparent"></div> <!-- Bridge for hover -->
                
                <a routerLink="/disciplines" (click)="closeDropdownImmediate()" class="block px-5 py-2.5 text-sm text-prenda-dark font-bold hover:bg-gray-50 hover:text-prenda-secondary border-b border-gray-50">
                    Todas las disciplinas
                </a>
                
                @for(category of categories(); track category.id) {
                    <a [routerLink]="['/category', category.slug]" (click)="closeDropdownImmediate()" class="block px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-prenda-secondary transition-colors">
                        {{ category.name }}
                    </a>
                }
             </div>
          </div>

          <div class="w-px h-4 bg-gray-200"></div>
          
          <a routerLink="/galleries" routerLinkActive="text-prenda-secondary font-semibold" class="hover:text-prenda-secondary transition-colors">Galerías</a>
          <a routerLink="/institutions" routerLinkActive="text-prenda-secondary font-semibold" class="hover:text-prenda-secondary transition-colors">Instituciones</a>
          <a routerLink="/events" routerLinkActive="text-prenda-secondary font-semibold" class="hover:text-prenda-secondary transition-colors">Calendario</a>
        </div>
      </div>
      
      <!-- Mobile Search (Visible only on mobile) -->
       <div class="md:hidden px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div class="relative">
             <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (keydown.enter)="onSearch()"
              placeholder="Buscar..." 
              class="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-prenda-primary"
            >
             <svg (click)="onSearch()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-2.5 top-2 w-5 h-5 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
       </div>

       <!-- Mobile Full Screen Menu Overlay -->
       @if (isMobileMenuOpen()) {
         <div class="fixed inset-0 z-50 bg-white pt-20 px-6 overflow-y-auto animate-fade-in md:hidden">
            <!-- Close Button (Absolute redundancy if needed, but nav header stays visible usually? No, fixed inset-0 covers header if z-index is high enough. Let's make it cover everything below header or use logic to ensure header is accessible. Sticking to simple overlay) -->
            
            <!-- Auth Section Mobile -->
            @if (currentUser()) {
               <div class="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                  <img [src]="currentUser()?.avatar" class="w-12 h-12 rounded-full object-cover" alt="User">
                  <div>
                    <p class="font-serif text-lg text-prenda-dark">{{ currentUser()?.name }}</p>
                    <a routerLink="/account" (click)="toggleMobileMenu()" class="text-sm text-prenda-secondary hover:underline">Ver Perfil</a>
                  </div>
               </div>
            } @else {
               <div class="flex flex-col gap-3 mb-8 pb-8 border-b border-gray-100">
                  <a routerLink="/login" (click)="toggleMobileMenu()" class="w-full text-center border border-gray-300 py-3 rounded-full font-bold uppercase text-xs text-prenda-dark">Ingresar</a>
                  <a routerLink="/register" (click)="toggleMobileMenu()" class="w-full text-center bg-prenda-dark text-white py-3 rounded-full font-bold uppercase text-xs">Registrarse</a>
               </div>
            }
            
            <!-- Navigation Links -->
            <div class="flex flex-col space-y-6 text-lg font-serif text-prenda-dark">
               <a routerLink="/artists" (click)="toggleMobileMenu()" class="flex items-center justify-between group">
                 <span>Artistas</span>
                 <span class="text-gray-300 group-hover:text-prenda-secondary">→</span>
               </a>
               <a routerLink="/disciplines" (click)="toggleMobileMenu()" class="flex items-center justify-between group">
                 <span>Disciplinas y Medios</span>
                 <span class="text-gray-300 group-hover:text-prenda-secondary">→</span>
               </a>
               <a routerLink="/galleries" (click)="toggleMobileMenu()" class="flex items-center justify-between group">
                 <span>Galerías</span>
                 <span class="text-gray-300 group-hover:text-prenda-secondary">→</span>
               </a>
               <a routerLink="/institutions" (click)="toggleMobileMenu()" class="flex items-center justify-between group">
                 <span>Museos e Instituciones</span>
                 <span class="text-gray-300 group-hover:text-prenda-secondary">→</span>
               </a>
               <a routerLink="/events" (click)="toggleMobileMenu()" class="flex items-center justify-between group">
                 <span>Agenda Cultural</span>
                 <span class="text-gray-300 group-hover:text-prenda-secondary">→</span>
               </a>
               <a routerLink="/articles" (click)="toggleMobileMenu()" class="flex items-center justify-between group">
                 <span>Editorial</span>
                 <span class="text-gray-300 group-hover:text-prenda-secondary">→</span>
               </a>
            </div>

            <!-- Footer Links Mobile -->
            <div class="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500 uppercase tracking-wide">
               <a routerLink="/about" (click)="toggleMobileMenu()">Nosotros</a>
               <a routerLink="/contact" (click)="toggleMobileMenu()">Contacto</a>
               <a routerLink="/partners" (click)="toggleMobileMenu()">Partners</a>
               @if (currentUser()) {
                 <button (click)="logout(); toggleMobileMenu()" class="text-red-400">Cerrar Sesión</button>
               }
            </div>
         </div>
       }

    </nav>
  `,
  styles: [`
    .animate-fade-in-down {
      animation: fadeInDown 0.2s ease-out forwards;
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
       animation: fadeIn 0.2s ease-out forwards;
    }
    @keyframes fadeIn {
       from { opacity: 0; }
       to { opacity: 1; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);

  // Static categories matching DisciplineListComponent until Backend Collection exists
  categories = signal([
    { id: '1', name: 'Pintura', slug: 'painting' },
    { id: '2', name: 'Escultura', slug: 'sculpture' },
    { id: '3', name: 'Fotografía', slug: 'photography' },
    { id: '4', name: 'Grabado', slug: 'printmaking' },
    { id: '5', name: 'Instalación', slug: 'installation' }
  ]);

  currentUser = this.auth.currentUser;

  // Search State
  searchTerm = signal('');

  // Dropdown State
  isDropdownOpen = signal(false);
  isUserMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);

  private closeTimeout: ReturnType<typeof setTimeout> | undefined;

  onSearch() {
    const term = this.searchTerm().trim();
    if (term) {
      this.router.navigate(['/search'], { queryParams: { q: term } });
      this.closeDropdownImmediate();
      this.isUserMenuOpen.set(false);
      this.isMobileMenuOpen.set(false);
    }
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.isUserMenuOpen.set(false);
      this.router.navigate(['/home']);
    });
  }

  openDropdown() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
    this.isDropdownOpen.set(true);
  }

  closeDropdownDelayed() {
    this.closeTimeout = setTimeout(() => {
      this.isDropdownOpen.set(false);
    }, 150);
  }

  closeDropdownImmediate() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.isDropdownOpen.set(false);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
}
