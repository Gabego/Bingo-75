# Bingo 75 — V0.2.0

Aplicación web para administrar una partida presencial de Bingo 75 desde un computador o celular. Los jugadores usan cartones físicos; no es una plataforma de bingo en línea.

## Tecnologías

React, JavaScript, Vite, HTML/CSS y Service Worker. No requiere servidor externo ni conexión para las funciones del juego. Las voces las proporciona el sistema operativo o el navegador.

## Ejecutar

Requiere Node.js y npm. Desde esta carpeta:

```sh
npm install
npm run dev
```

Para generar una versión web optimizada:

```sh
npm run build
npm run preview
```

La carpeta `dist/` contiene el sitio estático. El flujo de GitHub Pages incluido más abajo la construye y publica automáticamente desde la rama `main`.

## Publicar en GitHub Pages

El flujo `.github/workflows/deploy.yml` construye y publica el sitio automáticamente cuando se suben cambios a `main`. En GitHub, abre **Settings → Pages** y elige **GitHub Actions** como fuente de publicación. La dirección del proyecto será `https://gabego.github.io/Bingo-75/`.

El repositorio es público y el sitio publicado también será accesible públicamente. La app no contiene cuentas ni datos personales de los jugadores.

## Instalar como PWA

Sirve la compilación por HTTPS (o desde `localhost`), abre la dirección en un navegador compatible y selecciona «Instalar aplicación» o «Añadir a pantalla de inicio». En iPhone/iPad, usa Compartir → Añadir a pantalla de inicio desde Safari. La instalación depende del navegador y sistema.

## Funcionamiento sin Internet

Tras una primera carga completa en un contexto seguro, el Service Worker guarda la app y sus recursos del mismo origen para abrirlos sin conexión. La disponibilidad de voz offline depende de que el dispositivo tenga instalada una voz local en español. La app no carga fuentes, imágenes ni servicios de terceros.

## Funcionalidades

- Tablero 5 × 15 con rangos B 1–15, I 16–30, N 31–45, G 46–60 y O 61–75.
- Registro manual o selección aleatoria sin repeticiones; cualquier número marcado se puede desmarcar.
- Última balota destacada, las cinco anteriores a la izquierda y contador de avance.
- Lectura opcional con tres formatos y selección entre voces españolas instaladas; preferencia automática por español colombiano.
- Ajustes guardados localmente, pantalla completa y reinicio con confirmación.
- Aviso de partida completada al registrar los 75 números.
- Diseño responsive para móvil, computador y proyección de pantalla.
- Guía «Conexión» con instrucciones sencillas para HDMI, Google Meet, VNC desde PC y VNC desde Android.
- APK probado de droidVNC-NG 2.22.3 en `public/descargas/`, junto con su aviso de licencia y procedencia.

## Estructura

```text
index.html
public/       manifest, icono y Service Worker
src/          interfaz, estilos y reglas del bingo
tests/        pruebas de reglas ejecutadas con node:test
```

## Pruebas y estado V0.1.0

Pruebas automatizadas de reglas: `npm test` (75 bolas, rangos/letras, historial, selección sin repetición y formatos de pronunciación); 5 aprobadas. Compilación de producción: `npm run build`; completada. El entorno bloqueó las conexiones HTTP locales, así que no se pudo comprobar la app servida ni hacer una prueba real del Service Worker. Las interacciones completas de navegador, instalación PWA, voces locales, modo sin conexión en dispositivo y proyección en equipos físicos requieren una validación manual en los dispositivos objetivo; no se declaran verificadas hasta realizarla.

## Copia de seguridad

Copia la carpeta del proyecto a otra ubicación. Las preferencias se guardan en el almacenamiento local del navegador; no se guardan partidas históricas ni cartones.

## Pendientes de comprobación

- Comprobar instalación y caché offline en navegadores compatibles.
- Validar tamaño/legibilidad en los celulares y televisores objetivo.
- Confirmar disponibilidad y comportamiento de voces en español en cada dispositivo.

## V0.2.0 — Conexión y visualización

El botón **Conexión** de la pantalla inicial abre una guía con cuatro métodos, en este orden: TV/proyector por HDMI, Google Meet, VNC desde PC y VNC desde Android. HDMI y VNC por red local no requieren Internet una vez que el equipo y la aplicación están disponibles. Google Meet sí requiere Internet. Para los métodos VNC, todos los dispositivos deben estar conectados a la misma red local o punto de acceso.

La guía explica cómo compartir únicamente la imagen. En TightVNC se debe configurar el acceso de solo lectura; en droidVNC-NG no se debe activar el permiso de Accesibilidad/control remoto. droidVNC-NG se distribuye aquí como APK oficial de la versión 2.22.3; el aviso de licencia y los enlaces a su código fuente están en `public/descargas/`.

Estos métodos duplican la pantalla del equipo anfitrión; no sincronizan el estado del juego entre instalaciones independientes de Bingo 75. El acceso al APK desde GitHub Pages requiere Internet para descargarlo; conviene instalarlo antes de una actividad sin conexión.

La versión actual del proyecto es **V0.2.0**.

