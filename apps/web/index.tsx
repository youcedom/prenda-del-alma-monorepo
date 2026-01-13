import './src/styles.css';


import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { withJsonpSupport, withXsrfConfiguration } from '@angular/common/http';
import { HttpClientXsrfModule } from '@angular/common/http';

// We need to configure withCredentials manually if not directly supported by a simple flag in provideHttpClient yet (depending on ng version), 
// but in modern Angular `withFetch` works with headers. 
// However, the standard way in standalone API is usually via interceptors or feature functions.
// Let's use `withUtils` or just configure fetch.
// Actually, `withFetch` uses the native fetch API. To send cookies, we need to ensure requests have credentials: 'include'.
// BUT `provideHttpClient` in Angular 15+ allows features.
// Let's import features.
import { withRequestsMadeViaParent } from '@angular/common/http';
import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';

// Suppress benign ResizeObserver error often caused by browser constraints or extensions
const resizeObserverLoopErr = 'ResizeObserver loop completed with undelivered notifications.';

window.addEventListener('error', (e) => {
  if (e.message === resizeObserverLoopErr) {
    e.stopImmediatePropagation();
  }
});

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes(resizeObserverLoopErr)) {
    return;
  }
  originalError(...args);
};

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      // We can't easily force 'include' credentials globally with just withFetch().
      // It's better to handle this in a functional interceptor or just use it in the service.
      // For now, let's keep withFetch(). We will manually add { withCredentials: true } in the services.
      // Wait, withFetch might not respect withCredentials without underlying fetch options...
      // Actually, Angular's HttpClient withFetch support maps withCredentials: true to credentials: 'include'.
      // So ensuring the services send withCredentials: true is enough.
    ),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      })
    )
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
