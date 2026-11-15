# Bingo 75 — V0.1.0

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

La carpeta `dist/` contiene el sitio estático listo para alojar en un servidor web estático. No se configura ni publica ningún servicio en esta versión.

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

La versión del proyecto se mantiene en **V0.1.0**.

