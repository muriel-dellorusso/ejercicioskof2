# Repositorio de Misceláneas

Bienvenido al **Repositorio de Misceláneas**, un conjunto diverso de proyectos y ejercicios diseñados para exploración, aprendizaje y experimentación. Este repositorio utiliza el modelo de IFrames, una solución moderna y flexible inspirada en PlayGround, que facilita la integración de diferentes módulos y componentes en una misma interfaz, optimizando la reutilización y modularidad.

## Tabla de Contenidos

- [Repositorio de Misceláneas](#repositorio-de-misceláneas)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Estructura del Repositorio](#estructura-del-repositorio)
  - [Requisitos Previos](#requisitos-previos)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Instalación y Configuración](#instalación-y-configuración)
  - [Construcción y Despliegue](#construcción-y-despliegue)
    - [Construye para Producción](#construye-para-producción)
    - [Previsualiza la Versión de Producción Localmente](#previsualiza-la-versión-de-producción-localmente)
    - [Despliega en GitHub Pages](#despliega-en-github-pages)
  - [Buenas Prácticas](#buenas-prácticas)

## Estructura del Repositorio

Este repositorio está organizado en una serie de subdirectorios, cada uno de los cuales contiene un proyecto o ejercicio independiente. Cada proyecto está diseñado para ser autónomo, permitiendo su integración y uso a través de IFrames. Esto proporciona una manera eficiente de combinar y visualizar múltiples proyectos dentro de un mismo entorno sin interferencias mutuas.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu entorno de desarrollo:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [Vite](https://vitejs.dev/) (como herramienta de construcción y servidor de desarrollo)
- [Git](https://git-scm.com/) (para clonar y gestionar el repositorio)

## Estructura del proyecto

El proyecto se estructura de la siguiente manera:

- **`dist/`**: Directorio de salida donde se almacenan los archivos generados durante la construcción.
- **`node_modules/`**: Directorio donde se almacenan las dependencias de Node.js.
- **`src/`**: Directorio principal donde se encuentran los proyectos y ejercicios disponibles.

En el directorio `src/`, encontrarás los siguientes subdirectorios, cada uno de los cuales contiene un proyecto o ejercicio independiente:

- **`casitacompleja/`**: Proyecto demo de una casita digital compleja, haciendo uso de bits para formar palabras, utilizando selectores binarios.
- **`casitadigital/`**: Proyecto demo de una casita digital simple, con luces que forman mensajes, utilizando selectores binarios.
- **`demoCasitaPalabras01/`**: Proyecto demo de una casita digital con palabras, utilizando selectores binarios.
- **`demoCasitaSimple01/`**: Proyecto demo de una casita digital simple, utilizando selectores binarios.
- **`demoCreadorLaberinto/`**: Proyecto demo de un creador de laberintos legacy.
- **`shared/`**: Directorio compartido con módulos y utilidades comunes para los proyectos.

Cada proyecto contiene su propio código fuente, archivos de configuración y dependencias, permitiendo su ejecución y despliegue de forma independiente.

Ahora bien, en shared se encuentra el código base compartido entre los proyectos, como los controladores de eventos y temporizadores, o el generador del ejercicio en sí.
La idea es que cada ejercicio haga uso de un controlador expuesto en shared, para que el ejercicio en sí no tenga que preocuparse por la lógica como tal, sino solo de implementar una interfaz de usuario.

## Instalación y Configuración

1. **Clona este repositorio en tu máquina local:**
    ```bash
    git clone https://github.com/tu-usuario/repositorio-miscelaneas.git
    cd repositorio-miscelaneas
    ```

2. Instala las dependencias necesarias:

    ```bash
    npm install
    ```

3. **Ejecuta el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    Este comando iniciará un servidor de desarrollo utilizando Vite, permitiéndote visualizar y trabajar en los proyectos en tiempo real.

## Construcción y Despliegue

Para construir y desplegar los proyectos en producción, utiliza los siguientes comandos:

### Construye para Producción

    ```bash
    npm run build
    ```

    Este comando generará una versión optimizada de los proyectos, lista para ser desplegada.

### Previsualiza la Versión de Producción Localmente

    ```bash
    npm run preview
    ```

### Despliega en GitHub Pages

    ```bash
    npm run deploy
    ```

Este comando construirá los proyectos y los desplegará automáticamente en la rama `gh-pages` de tu repositorio, haciéndolos accesibles en línea.

## Buenas Prácticas

Este repositorio sigue las mejores prácticas de desarrollo de software, incluyendo:

- **Modularidad:** Cada proyecto está diseñado como un módulo independiente, permitiendo su integración y uso en diferentes contextos.
- **Reutilización:** Se fomenta la reutilización de código a través de la modularidad y la integración de componentes.
- **Documentación:** Se proporciona documentación detallada para cada proyecto, incluyendo descripciones, propiedades, métodos y ejemplos de uso. Para esto, consulta [JS Docs](https://jsdoc.app/).
- **Optimización:** Se utilizan herramientas modernas como Vite para optimizar la construcción y despliegue de los proyectos.
- **SOLID:** Se siguen los principios SOLID de diseño de software para garantizar la escalabilidad y mantenibilidad de los proyectos. Para más información, consulta [SOLID](https://en.wikipedia.org/wiki/SOLID).