/**
 * Proyecto: Mapa Cardioprotegido La Pampa (GeoDea's)
 * Módulo: app.js
 *
 * Autor: Gonzalo Gaspar Gaita
 * Fecha: 2025
 * 
 * Descripción:
 * Este archivo es el punto de entrada principal del sistema.
 * Inicializa el mapa, activa la geolocalización del usuario y carga los puntos de interés.
 */

import { initMap } from './js/map.js';
import { setupGeolocation } from './js/geo.js';
import { loadPoints } from './js/points.js';

// Espera a que el DOM esté completamente cargado antes de ejecutar

document.addEventListener('DOMContentLoaded', () => {
  const map = initMap(); // Inicializa el mapa base
  setupGeolocation(map); // Activa seguimiento de la ubicación del usuario
  loadPoints(map);       // Carga los puntos desde base de datos o localStorage
});
