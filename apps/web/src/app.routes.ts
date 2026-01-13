
import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home.component';
import { ArtistDetailComponent } from './components/pages/artist-detail.component';
import { ArtistListComponent } from './components/pages/artist-list.component';
import { ArtworkDetailComponent } from './components/pages/artwork-detail.component';
import { DisciplineListComponent } from './components/pages/discipline-list.component';
import { CategoryDetailComponent } from './components/pages/category-detail.component';
import { GalleryListComponent } from './components/pages/gallery-list.component';
import { EventListComponent } from './components/pages/event-list.component';
import { EventDetailComponent } from './components/pages/event-detail.component';
import { ArticleListComponent } from './components/pages/article-list.component';
import { ArticleDetailComponent } from './components/pages/article-detail.component';
import { InstitutionDetailComponent } from './components/pages/institution-detail.component';
import { InstitutionListComponent } from './components/pages/institution-list.component';
import { SearchComponent } from './components/pages/search.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password.component';
import { SellComponent } from './components/pages/sell.component';
import { AboutComponent } from './components/pages/about.component';
import { AccountComponent } from './components/pages/account.component';
import { TermsComponent } from './components/pages/terms.component';
import { PrivacyComponent } from './components/pages/privacy.component';
import { ApiComingSoonComponent } from './components/pages/api-coming-soon.component';
import { ContactComponent } from './components/pages/contact.component';
import { SubmitComponent } from './components/pages/submit.component';
import { ResetPasswordComponent } from './components/auth/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'account', component: AccountComponent },
  { path: 'partners', component: SellComponent },
  { path: 'submit', component: SubmitComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'api', component: ApiComingSoonComponent },
  { path: 'search', component: SearchComponent },
  { path: 'artists', component: ArtistListComponent },
  { path: 'artist/:id', component: ArtistDetailComponent },
  { path: 'artwork/:id', component: ArtworkDetailComponent },
  { path: 'disciplines', component: DisciplineListComponent },
  { path: 'collections', redirectTo: 'disciplines' }, // Legacy redirect
  { path: 'category/:slug', component: CategoryDetailComponent },
  { path: 'galleries', component: GalleryListComponent },
  { path: 'gallery/:id', component: InstitutionDetailComponent },
  { path: 'institutions', component: InstitutionListComponent },
  { path: 'museums', redirectTo: 'institutions' }, // Redirect legacy route
  { path: 'museum/:id', component: InstitutionDetailComponent },
  { path: 'events', component: EventListComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: 'article/:id', component: ArticleDetailComponent },
  { path: '**', redirectTo: 'home' }
];
