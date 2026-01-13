
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ArtworkCardComponent } from '../ui/artwork-card.component';
import { FormsModule } from '@angular/forms';
import { UiSelectComponent } from '../ui/ui-select.component';

type Tab = 'saved' | 'following' | 'lists' | 'events';

@Component({
   selector: 'app-account',
   imports: [CommonModule, NgOptimizedImage, RouterLink, ArtworkCardComponent, FormsModule, UiSelectComponent],
   template: `
    <div class="min-h-screen bg-white pb-24">
      
      @if (currentUser(); as user) {
        <!-- Profile Header -->
        <div class="bg-gray-50 border-b border-gray-100 pt-16 pb-12 transition-all">
           <div class="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start gap-8">
              
              <!-- Avatar Area -->
              <div class="relative shrink-0 mx-auto md:mx-0 group">
                 <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm bg-gray-200 relative">
                    @if (isBase64(editForm().avatar) || !isEditingProfile()) {
                       <!-- Use standard img for base64 preview or if not editing to ensure update -->
                       <img [src]="isEditingProfile() ? editForm().avatar : user.avatar" class="w-full h-full object-cover" alt="Avatar">
                    } @else {
                       <!-- Fallback or initial state -->
                       <img [src]="user.avatar" class="w-full h-full object-cover" alt="Avatar">
                    }
                    
                    @if (isEditingProfile()) {
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" (click)="fileInput.click()">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                             <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                             <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                          </svg>
                       </div>
                    }
                 </div>
                 
                 <!-- Hidden File Input -->
                 <input 
                    type="file" 
                    #fileInput 
                    (change)="onFileSelected($event)" 
                    class="hidden" 
                    accept="image/*"
                 >

                 @if (isEditingProfile()) {
                   <div class="flex justify-center gap-2 mt-2">
                      <button (click)="fileInput.click()" class="text-[10px] font-bold uppercase text-prenda-secondary hover:underline">Cambiar</button>
                      <button (click)="removePhoto()" class="text-[10px] font-bold uppercase text-red-400 hover:text-red-600">Eliminar</button>
                   </div>
                 }
              </div>
              
              <!-- Info / Edit Area -->
              <div class="flex-1 w-full text-center md:text-left">
                 @if (!isEditingProfile()) {
                   <!-- Display Mode -->
                   <h1 class="font-serif text-3xl md:text-4xl text-prenda-dark mb-1">{{ user.name }}</h1>
                   
                   @if (user.city || user.country) {
                      <p class="text-xs font-bold uppercase tracking-widest text-prenda-secondary mb-3">
                         {{ user.city }}{{ user.city && user.country ? ', ' : '' }}{{ user.country }}
                      </p>
                   }

                   <p class="text-gray-500 text-sm mb-4">{{ user.email }} • Miembro desde {{ user.createdAt | date:'MMMM y' }}</p>
                   
                   @if (user.bio) {
                     <p class="text-gray-600 font-light max-w-2xl text-sm leading-relaxed mb-6 mx-auto md:mx-0">{{ user.bio }}</p>
                   }

                   <div class="flex gap-4 justify-center md:justify-start">
                      <button (click)="startEditing()" class="text-xs font-bold uppercase tracking-wider border border-gray-300 px-6 py-2.5 rounded-full hover:bg-white hover:border-prenda-dark transition-colors bg-white/50">
                         Editar Perfil
                      </button>
                      <button (click)="logout()" class="text-xs font-bold uppercase tracking-wider text-red-500 border border-transparent hover:bg-red-50 px-6 py-2.5 rounded-full transition-colors">
                         Cerrar Sesión
                      </button>
                   </div>
                 } @else {
                   <!-- Edit Mode -->
                   <div class="max-w-xl space-y-5 mx-auto md:mx-0 bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-left animate-fade-in">
                      
                      <!-- Name -->
                      <div>
                         <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Nombre</label>
                         <input 
                           type="text" 
                           [(ngModel)]="editForm().name" 
                           class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent"
                         >
                      </div>

                      <!-- Location Split -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Ciudad</label>
                            <input 
                              type="text" 
                              [(ngModel)]="editForm().city" 
                              placeholder="Ej. Buenos Aires"
                              class="w-full border-b border-gray-300 py-2 text-prenda-dark focus:border-prenda-secondary focus:outline-none bg-transparent"
                            >
                         </div>
                         <div>
                            <label class="block text-xs font-bold uppercase text-gray-400 mb-1">País</label>
                            <app-ui-select 
                               [options]="latamCountries"
                               [value]="editForm().country"
                               placeholder="Seleccionar país..."
                               (valueChange)="updateCountry($event)"
                            ></app-ui-select>
                         </div>
                      </div>
                      
                      <!-- Bio -->
                      <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Bio</label>
                        <textarea 
                           [(ngModel)]="editForm().bio" 
                           rows="3"
                           placeholder="Cuéntanos un poco sobre ti..."
                           class="w-full border border-gray-300 rounded p-3 text-sm text-prenda-dark focus:border-prenda-secondary focus:outline-none resize-none"
                        ></textarea>
                      </div>
                      
                      <!-- Password Change Section -->
                      <div class="pt-4 border-t border-gray-100">
                         <button 
                           (click)="showPasswordChange.set(!showPasswordChange())" 
                           class="text-xs font-bold uppercase tracking-wide text-prenda-secondary flex items-center hover:underline"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                             <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                           </svg>
                           {{ showPasswordChange() ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña' }}
                         </button>
                         
                         @if (showPasswordChange()) {
                           <div class="mt-4 space-y-4 bg-gray-50 p-4 rounded-sm animate-fade-in">
                              <div>
                                 <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Contraseña Actual</label>
                                 <input 
                                   type="password" 
                                   [(ngModel)]="passwordForm().current"
                                   class="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-prenda-secondary focus:outline-none"
                                 >
                              </div>
                              <div>
                                 <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Nueva Contraseña</label>
                                 <input 
                                   type="password" 
                                   [(ngModel)]="passwordForm().new"
                                   class="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-prenda-secondary focus:outline-none"
                                 >
                              </div>
                              <div>
                                 <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Confirmar Contraseña</label>
                                 <input 
                                   type="password" 
                                   [(ngModel)]="passwordForm().confirm"
                                   class="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-prenda-secondary focus:outline-none"
                                 >
                              </div>
                           </div>
                         }
                      </div>

                      <div class="flex gap-3 justify-end pt-4">
                         <button (click)="cancelEditing()" class="text-xs font-bold uppercase text-gray-500 hover:text-gray-800 px-4 py-2">Cancelar</button>
                         <button (click)="saveProfile()" class="text-xs font-bold uppercase bg-prenda-dark text-white px-8 py-2.5 rounded-full hover:bg-prenda-primary-dark shadow-sm">Guardar Cambios</button>
                      </div>
                   </div>
                 }
              </div>
              
              <!-- Stats (Hidden on mobile while editing to save space) -->
              @if (!isEditingProfile()) {
                <div class="md:ml-auto flex gap-8 md:gap-12 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 border-gray-200 pt-6 md:pt-0 mt-2 md:mt-0 md:self-center">
                   <div class="text-center">
                      <span class="block font-serif text-3xl text-prenda-dark">{{ likedArtworks().length }}</span>
                      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Obras</span>
                   </div>
                   <div class="text-center">
                      <span class="block font-serif text-3xl text-prenda-dark">{{ totalFollowing() }}</span>
                      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Siguiendo</span>
                   </div>
                   <div class="text-center">
                      <span class="block font-serif text-3xl text-prenda-dark">{{ lists().length }}</span>
                      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Listas</span>
                   </div>
                </div>
              }
           </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-100 sticky top-16 bg-white z-20">
           <div class="max-w-[1400px] mx-auto px-6 md:px-12 flex space-x-8 overflow-x-auto hide-scrollbar">
              <button 
                (click)="onTabChange('saved')"
                class="py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                [class.border-prenda-secondary]="activeTab() === 'saved'"
                [class.text-prenda-secondary]="activeTab() === 'saved'"
                [class.border-transparent]="activeTab() !== 'saved'"
                [class.text-gray-500]="activeTab() !== 'saved'"
              >
                Favoritos
              </button>
              <button 
                (click)="onTabChange('following')"
                class="py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                [class.border-prenda-secondary]="activeTab() === 'following'"
                [class.text-prenda-secondary]="activeTab() === 'following'"
                [class.border-transparent]="activeTab() !== 'following'"
                [class.text-gray-500]="activeTab() !== 'following'"
              >
                Siguiendo
              </button>
              <button 
                (click)="onTabChange('lists')"
                class="py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                [class.border-prenda-secondary]="activeTab() === 'lists'"
                [class.text-prenda-secondary]="activeTab() === 'lists'"
                [class.border-transparent]="activeTab() !== 'lists'"
                [class.text-gray-500]="activeTab() !== 'lists'"
              >
                Listas
              </button>
              <button 
                (click)="onTabChange('events')"
                class="py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                [class.border-prenda-secondary]="activeTab() === 'events'"
                [class.text-prenda-secondary]="activeTab() === 'events'"
                [class.border-transparent]="activeTab() !== 'events'"
                [class.text-gray-500]="activeTab() !== 'events'"
              >
                Calendario
              </button>
           </div>
        </div>

        <!-- Content -->
        <div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
           
           <!-- Saved Artworks Tab -->
           @if (activeTab() === 'saved') {
             @if (likedArtworks().length > 0) {
               <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                  @for (work of likedArtworks(); track work.id) {
                     <app-artwork-card [artwork]="work"></app-artwork-card>
                  }
               </div>
             } @else {
               <div class="text-center py-20 bg-gray-50 rounded-lg">
                  <p class="text-gray-500 mb-4">Aún no has guardado ninguna obra.</p>
                  <a routerLink="/disciplines" class="text-prenda-secondary underline text-sm">Explorar obras</a>
               </div>
             }
           }

           <!-- Following Tab (Consolidated) -->
           @if (activeTab() === 'following') {
              @if (isFollowingAnything()) {
                 
                 <!-- Artists Section -->
                 @if (followedArtists().length > 0) {
                    <h3 class="font-serif text-2xl text-prenda-dark mb-6 mt-4">Artistas</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                      @for (artist of followedArtists(); track artist.id) {
                         <div [routerLink]="['/artist', artist.id]" class="group cursor-pointer text-center">
                            <div class="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 border border-gray-100 group-hover:border-prenda-secondary transition-colors">
                               <img [ngSrc]="artist.image" fill class="object-cover transition-transform duration-500 group-hover:scale-105" [alt]="artist.name">
                            </div>
                            <h3 class="font-serif text-lg text-prenda-dark group-hover:text-prenda-secondary transition-colors">{{ artist.name }}</h3>
                            <p class="text-xs text-gray-500 uppercase tracking-wide">{{ artist.country }}</p>
                            <button (click)="unfollowArtist($event, artist.id)" class="mt-2 text-[10px] font-bold uppercase text-red-400 hover:text-red-600">Dejar de Seguir</button>
                         </div>
                      }
                   </div>
                 }

                 <!-- Commercial Galleries Section -->
                 @if (commercialGalleries().length > 0) {
                    <h3 class="font-serif text-2xl text-prenda-dark mb-6 border-t border-gray-100 pt-8">Galerías</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      @for (g of commercialGalleries(); track g.id) {
                         <div [routerLink]="['/gallery', g.id]" class="group cursor-pointer flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-prenda-secondary transition-colors bg-white relative">
                            <div class="relative w-20 h-20 shrink-0 bg-gray-100 overflow-hidden rounded-md">
                               <img [ngSrc]="g.image" fill class="object-cover" [alt]="g.name">
                            </div>
                            <div class="flex-1">
                               <h3 class="font-serif text-lg text-prenda-dark leading-tight group-hover:text-prenda-secondary transition-colors">{{ g.name }}</h3>
                               <p class="text-xs text-gray-500 mb-2">{{ g.location }}</p>
                               <button (click)="unfollowGallery($event, g.id)" class="text-[10px] font-bold uppercase text-red-400 hover:text-red-600">Dejar de Seguir</button>
                            </div>
                         </div>
                      }
                   </div>
                 }

                 <!-- Museums Section -->
                 @if (museums().length > 0) {
                    <h3 class="font-serif text-2xl text-prenda-dark mb-6 border-t border-gray-100 pt-8">Museos e Instituciones</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      @for (m of museums(); track m.id) {
                         <div [routerLink]="['/museum', m.id]" class="group cursor-pointer flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-prenda-secondary transition-colors bg-white relative">
                            <div class="relative w-20 h-20 shrink-0 bg-gray-100 overflow-hidden rounded-md">
                               <img [ngSrc]="m.image" fill class="object-cover" [alt]="m.name">
                            </div>
                            <div class="flex-1">
                               <h3 class="font-serif text-lg text-prenda-dark leading-tight group-hover:text-prenda-secondary transition-colors">{{ m.name }}</h3>
                               <p class="text-xs text-gray-500 mb-2">{{ m.location }}</p>
                               <button (click)="unfollowGallery($event, m.id)" class="text-[10px] font-bold uppercase text-red-400 hover:text-red-600">Dejar de Seguir</button>
                            </div>
                         </div>
                      }
                   </div>
                 }

              } @else {
                 <div class="text-center py-20 bg-gray-50 rounded-lg">
                  <p class="text-gray-500 mb-4">No sigues a ningún artista, galería o museo.</p>
                  <div class="flex gap-4 justify-center">
                     <a routerLink="/artists" class="text-prenda-secondary underline text-sm">Explorar Artistas</a>
                     <a routerLink="/galleries" class="text-prenda-secondary underline text-sm">Explorar Galerías</a>
                  </div>
               </div>
              }
           }

           <!-- Lists Tab -->
           @if (activeTab() === 'lists') {
              <div class="mb-8 flex justify-between items-center">
                 <h2 class="font-serif text-2xl text-prenda-dark">Mis Listas</h2>
                 
                 <div class="flex gap-2">
                    <input 
                      type="text" 
                      [(ngModel)]="newListName" 
                      placeholder="Nueva lista..."
                      (keydown.enter)="createList()"
                      class="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-prenda-dark"
                    >
                    <button (click)="createList()" class="bg-prenda-dark text-white px-4 py-2 rounded-sm text-xs font-bold uppercase hover:bg-prenda-primary-dark">Crear</button>
                 </div>
              </div>

              <div class="space-y-12">
                 @for (list of lists(); track list.id) {
                    <div class="border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow">
                       <div class="flex justify-between items-center mb-6 h-8">
                          <h3 class="font-serif text-xl text-prenda-dark">{{ list.name }} <span class="text-gray-400 text-sm ml-2">({{ list.artworkIds.length }} {{ list.artworkIds.length === 1 ? 'obra' : 'obras' }})</span></h3>
                          
                          <!-- Delete Logic UI -->
                          @if (deletingListId() === list.id) {
                             <div class="flex items-center gap-3 animate-fade-in bg-gray-50 px-3 py-1 rounded-full">
                                <span class="text-[10px] text-gray-500 font-medium">¿Eliminar lista y contenido?</span>
                                <button (click)="confirmDelete(list.id)" class="text-[10px] font-bold uppercase text-red-500 hover:text-red-700 hover:underline">Sí</button>
                                <span class="text-gray-300">/</span>
                                <button (click)="cancelDelete()" class="text-[10px] font-bold uppercase text-gray-400 hover:text-gray-600 hover:underline">No</button>
                             </div>
                          } @else {
                             <button (click)="initiateDelete(list)" class="text-[10px] font-bold uppercase text-red-400 hover:text-red-600 border border-transparent hover:bg-red-50 px-3 py-1 rounded transition-colors">
                                Eliminar Lista
                             </button>
                          }
                       </div>
                       
                       @if (list.artworkIds.length > 0) {
                          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                             @for (work of getListArtworks(list.id); track work.id) {
                                <div class="relative group">
                                   <app-artwork-card [artwork]="work"></app-artwork-card>
                                   <!-- Modified delete button position to top-left to avoid overlap with card like button -->
                                   <button (click)="removeFromList(list.id, work.id)" class="absolute top-2 left-2 bg-white rounded-full p-2 shadow-sm opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 z-20 transition-all duration-200" title="Eliminar de lista">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                      </svg>
                                   </button>
                                </div>
                             }
                          </div>
                       } @else {
                          <p class="text-sm text-gray-400 italic">Lista vacía. Añade obras desde el catálogo.</p>
                       }
                    </div>
                 } @empty {
                   <div class="text-center py-12 bg-gray-50 rounded-lg">
                      <p class="text-gray-500 text-sm">No tienes listas personalizadas.</p>
                   </div>
                 }
              </div>
           }

           <!-- Events Tab -->
           @if (activeTab() === 'events') {
              @if (savedEvents().length > 0) {
                 
                 <!-- Upcoming Section -->
                 @if (sortedEvents().upcoming.length > 0) {
                    <h3 class="font-serif text-2xl text-prenda-dark mb-6 mt-4">Próximos Eventos</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        @for (event of sortedEvents().upcoming; track event.id) {
                           <div [routerLink]="['/event', event.id]" class="border border-gray-100 rounded-lg p-4 cursor-pointer hover:border-prenda-secondary transition-colors flex gap-4 group bg-white">
                              <div class="relative w-24 h-24 bg-gray-100 shrink-0 rounded overflow-hidden">
                                 <img [ngSrc]="event.image" fill class="object-cover" [alt]="event.name">
                              </div>
                              <div class="flex-1">
                                 <div class="flex justify-between items-start mb-1">
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary">{{ event.type }}</span>
                                    @if (getEventStatus(event.id); as status) {
                                        <span class="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" 
                                            [class.text-prenda-dark]="status === 'going'"
                                            [class.text-gray-400]="status === 'interested'"
                                        >
                                            @if (status === 'going') {
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                                </svg>
                                                Ahí estaré
                                            } @else {
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                                                    <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
                                                </svg>
                                                Me interesa
                                            }
                                        </span>
                                    }
                                 </div>
                                 <h3 class="font-serif text-lg text-prenda-dark mb-1 leading-tight">{{ event.name }}</h3>
                                 <p class="text-xs text-gray-500">{{ event.startDate }}</p>
                              </div>
                           </div>
                        }
                    </div>
                 }

                 <!-- Past Section -->
                 @if (sortedEvents().past.length > 0) {
                    <h3 class="font-serif text-2xl text-prenda-dark mb-6 border-t border-gray-100 pt-8 opacity-75">Eventos Pasados</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 grayscale-[50%] hover:grayscale-0 transition-all duration-300">
                        @for (event of sortedEvents().past; track event.id) {
                           <div [routerLink]="['/event', event.id]" class="border border-gray-100 rounded-lg p-4 cursor-pointer hover:border-prenda-secondary transition-colors flex gap-4 group bg-gray-50">
                              <div class="relative w-24 h-24 bg-gray-100 shrink-0 rounded overflow-hidden">
                                 <img [ngSrc]="event.image" fill class="object-cover" [alt]="event.name">
                              </div>
                              <div class="flex-1">
                                 <div class="flex justify-between items-start mb-1">
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-prenda-secondary">{{ event.type }}</span>
                                    <span class="text-[10px] uppercase font-bold text-gray-400">Finalizado</span>
                                 </div>
                                 <h3 class="font-serif text-lg text-prenda-dark mb-1 leading-tight">{{ event.name }}</h3>
                                 <p class="text-xs text-gray-500">{{ event.startDate }}</p>
                              </div>
                           </div>
                        }
                    </div>
                 }

              } @else {
                 <div class="text-center py-20 bg-gray-50 rounded-lg">
                  <p class="text-gray-500 mb-4">No tienes eventos agendados.</p>
                  <a routerLink="/events" class="text-prenda-secondary underline text-sm">Ver calendario</a>
               </div>
              }
           }
        </div>
      } @else {
         <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
               <h2 class="text-2xl font-serif mb-4">Acceso Denegado</h2>
               <p class="mb-6 text-gray-500">Debes iniciar sesión para ver tu perfil.</p>
               <a routerLink="/login" class="bg-prenda-dark text-white px-6 py-3 rounded-full text-sm font-bold">Iniciar Sesión</a>
            </div>
         </div>
      }

    </div>
  `
})
export class AccountComponent {
   private auth = inject(AuthService);
   private api = inject(ApiService);
   router = inject(Router);
   activatedRoute = inject(ActivatedRoute);

   currentUser = this.auth.currentUser;

   activeTab = signal<Tab>('saved');
   newListName = signal('');
   deletingListId = signal<string | null>(null);

   // Editing State
   isEditingProfile = signal(false);
   editForm = signal<{ name: string, city: string, country: string, bio: string, avatar: string }>({
      name: '', city: '', country: '', bio: '', avatar: ''
   });

   showPasswordChange = signal(false);
   passwordForm = signal({ current: '', new: '', confirm: '' });

   readonly latamCountries = [
      'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
      'República Dominicana', 'Ecuador', 'El Salvador', 'Guatemala', 'Haití',
      'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela'
   ];

   constructor() {
      this.activatedRoute.queryParams.subscribe(params => {
         if (params['tab']) {
            let tab = params['tab'];
            if (tab === 'artists') tab = 'following'; // Fallback
            if (['saved', 'following', 'lists', 'events'].includes(tab)) {
               this.activeTab.set(tab as Tab);
            }
         }
      });
   }

   onTabChange(tab: Tab) {
      this.router.navigate([], {
         relativeTo: this.activatedRoute,
         queryParams: { tab },
         queryParamsHandling: 'merge',
      });
   }

   // --- Reactive Data Fetching ---

   // Helper to extract IDs from User arrays (which might be strings or objects)
   private getIds(items: any[] | undefined): string[] {
      if (!items) return [];
      return items.map(i => (typeof i === 'string' ? i : i.id));
   }

   // Liked Artworks
   likedArtworks = toSignal(
      toObservable(this.currentUser).pipe(
         switchMap(user => {
            const ids = this.getIds((user as any)?.likedArtworks);
            if (ids.length === 0) return of([]);
            // Fetch artworks where ID is in list.
            // Payload 'in' query: where[id][in]=id1,id2
            const query = { 'where[id][in]': ids.join(',') };
            return this.api.getArtworks(query).pipe(
               map(res => res.docs.map(doc => {
                  const artist = doc.artist as any;
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     title: doc.title,
                     artistId: artist?.id ? String(artist.id) : '',
                     artistName: artist?.name || 'Unknown',
                     gallery: '',
                     year: doc.year || 0,
                     image: image?.url || '',
                     medium: doc.medium || '',
                     dimensions: doc.dimensions || '',
                     category: doc.category || undefined,
                     description: doc.description || undefined,
                     likes: doc.likes || 0
                  };
               }))
            );
         })
      ),
      { initialValue: [] }
   );

   // Followed Combined (Artists + Galleries)
   // We need to fetch separately

   followedArtists = toSignal(
      toObservable(this.currentUser).pipe(
         switchMap(user => {
            const ids = this.getIds((user as any)?.followedArtists);
            if (ids.length === 0) return of([]);
            return this.api.getArtists({ 'where[id][in]': ids.join(',') }).pipe(
               map(res => res.docs.map(doc => {
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     name: doc.name,
                     country: doc.country || '',
                     image: image?.url || ''
                  };
               }))
            );
         })
      ),
      { initialValue: [] }
   );

   followedGalleriesData = toSignal(
      toObservable(this.currentUser).pipe(
         switchMap(user => {
            const ids = this.getIds((user as any)?.followedGalleries);
            if (ids.length === 0) return of([]);
            return this.api.getGalleries({ 'where[id][in]': ids.join(',') }).pipe(
               map(res => res.docs.map(doc => {
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     name: doc.name,
                     type: doc.type as 'Gallery' | 'Museum',
                     location: doc.location || '',
                     image: image?.url || ''
                  };
               }))
            );
         })
      ),
      { initialValue: [] }
   );

   commercialGalleries = computed(() => this.followedGalleriesData().filter(g => g.type === 'Gallery'));
   museums = computed(() => this.followedGalleriesData().filter(g => g.type === 'Museum'));
   totalFollowing = computed(() => this.followedArtists().length + this.followedGalleriesData().length);

   isFollowingAnything = computed(() =>
      this.followedArtists().length > 0 ||
      this.commercialGalleries().length > 0 ||
      this.museums().length > 0
   );

   // Saved Events
   savedEvents = toSignal(
      toObservable(this.currentUser).pipe(
         switchMap(user => {
            const ids = this.getIds(user?.savedEvents);
            if (ids.length === 0) return of([]);
            return this.api.getEvents({ 'where[id][in]': ids.join(',') }).pipe(
               map(res => res.docs.map(doc => {
                  const image = doc.image as any;
                  return {
                     id: String(doc.id),
                     name: doc.name,
                     type: doc.type || 'Event',
                     startDate: doc.startDate || '',
                     endDate: doc.endDate || '', // Needed for sort?
                     rawDate: doc.startDate || '', // For sorting logic reused
                     image: image?.url || ''
                  };
               }))
            );
         })
      ),
      { initialValue: [] }
   );

   sortedEvents = computed(() => {
      const events = this.savedEvents();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming: any[] = [];
      const past: any[] = [];

      events.forEach(e => {
         // rough parse
         const eDate = new Date(e.rawDate);
         if (eDate >= today) upcoming.push(e);
         else past.push(e);
      });

      upcoming.sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
      past.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

      return { upcoming, past };
   });

   // Stubbed Lists
   lists = signal<any[]>([]);

   getEventStatus(eventId: string) {
      return 'interested'; // If it's in savedEvents, it's interested/saved
   }

   getListArtworks(listId: string) {
      return [];
   }

   logout() {
      this.auth.logout().subscribe(() => this.router.navigate(['/home']));
   }

   unfollowArtist(event: Event, artistId: string) {
      event.stopPropagation();
      this.auth.toggleFollowArtist(artistId).subscribe();
   }

   unfollowGallery(event: Event, galleryId: string) {
      event.stopPropagation();
      this.auth.toggleFollowGallery(galleryId).subscribe();
   }

   // List Stubs
   createList() { console.warn('Lists coming soon'); }
   initiateDelete(list: any) { }
   confirmDelete(id: string) { }
   cancelDelete() { }
   removeFromList(lid: string, workId: string) { }

   // --- Profile Editing ---
   startEditing() {
      const u = this.currentUser();
      if (u) {
         this.editForm.set({
            name: u.name || '',
            city: u.city || '',
            country: u.country || '',
            bio: (u as any).bio || '',
            avatar: (u as any).avatar?.url || (u as any).avatar || '' // Avatar might be object or string
         });
         this.isEditingProfile.set(true);
      }
   }

   updateCountry(val: any) {
      this.editForm.update(f => ({ ...f, country: val }));
   }

   onFileSelected(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = () => {
            // In real app, upload file to Media collection first, get ID/URL.
            // For now, using base64 for preview, but backend update might fail if it expects ID.
            // We'll trust updateProfile handles partial updates. Avatar upload is complex.
            // Stubbing avatar update to just preview string for now.
            this.editForm.update(f => ({ ...f, avatar: reader.result as string }));
         };
         reader.readAsDataURL(file);
      }
   }

   removePhoto() {
      this.editForm.update(f => ({ ...f, avatar: '' }));
   }

   isBase64(str: string): boolean {
      return str ? str.startsWith('data:') : false;
   }

   saveProfile() {
      const form = this.editForm();
      if (form.name.trim()) {
         // Ignoring password change logic for now as it requires specific endpoint
         this.auth.updateProfile({
            name: form.name,
            city: form.city,
            country: form.country,
            bio: form.bio,
            // avatar: form.avatar // Skip avatar upload logic for this phase
         } as any).subscribe(() => {
            this.isEditingProfile.set(false);
         });
      }
   }

   cancelEditing() {
      this.isEditingProfile.set(false);
   }
}
