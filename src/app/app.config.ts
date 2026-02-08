import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "proyectofinal-huerting", appId: "1:1093388237029:web:9bec9b222abb399b457c0c", databaseURL: "https://proyectofinal-huerting-default-rtdb.europe-west1.firebasedatabase.app", storageBucket: "proyectofinal-huerting.firebasestorage.app", apiKey: "AIzaSyDxxwgxssR-fCtNaNBNU3QzidGjAyTzEu8", authDomain: "proyectofinal-huerting.firebaseapp.com", messagingSenderId: "1093388237029", projectNumber: "1093388237029", version: "2" })), provideAuth(() => getAuth()), provideDatabase(() => getDatabase())]
};
