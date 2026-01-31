
# 🚀 Task Manager Pro - FullStack Challenge (Angular 19 + Firebase)

Esta es una solución robusta y moderna para el desafío técnico de FullStack Developer. La aplicación ha sido diseñada siguiendo los más altos estándares de desarrollo actuales, priorizando la **reactividad granular**, el **tipado estricto** y la **eficiencia de infraestructura**.

---

## 🏗️ Arquitectura y Decisiones Técnicas (Senior Level)

Para este proyecto, se han implementado las últimas innovaciones del ecosistema de desarrollo:

### Frontend (Angular 19 + Tailwind v4)

*  **Signals State Management:** Gestión de estado 100% reactiva mediante `Signals`, optimizando el ciclo de vida de los componentes y eliminando la necesidad de Zone.js en el futuro (Zoneless-ready).

*  **Tailwind CSS v4 (Alpha):** Uso de la versión más reciente del motor de CSS para una compilación más rápida y un diseño atómico optimizado.

*  **Standalone Architecture:** Arquitectura limpia sin módulos, facilitando el Lazy Loading y la inyección de dependencias moderna mediante `inject()`.

*  **Dark Mode Nativo:** Sistema de temas detectado automáticamente o seleccionable, integrado profundamente con las clases de Tailwind.

### Backend (Node.js + Firebase Cloud Functions)

*  **RESTful API con Express:** El backend corre dentro de una Cloud Function, permitiendo una escalabilidad infinita y un manejo de rutas familiar y potente.

*  **Persistence Layer (Firestore):** Implementación de operaciones CRUD optimizadas con el SDK de Firebase.

*  **Type-Safety:** Compartición de interfaces de modelos entre Frontend y Backend para garantizar integridad de datos.
---

## 🚦 Ejecución Local (Firebase Emulator Suite)

Para evitar costos de infraestructura innecesarios (Plan Blaze de Firebase), el proyecto está configurado para ejecutarse localmente mediante el **Emulator Suite**. Esto permite una experiencia de desarrollo idéntica a producción sin latencia y con persistencia controlada.

### Pasos para ejecutar:
1.  **Instalar dependencias:**

Instala los paquetes en la raíz y en la carpeta de funciones:

```bash
npm install
cd functions && npm  install && cd  ..
```

2.  **Iniciar Emuladores con Persistencia:**

He configurado un script que carga datos de prueba pre-existentes y guarda los nuevos cambios al cerrar:

```bash
npm run emulators
```

*(Esto iniciará Firestore, Functions y Hosting en puertos locales).*


3.  **Iniciar Angular:**
En una nueva terminal, arranca el servidor de desarrollo:
```bash
ng serve
```
---

## 💾 Persistencia de Datos de Prueba

He incluido la carpeta `/firebase-data` en este repositorio. Esta carpeta contiene los metadatos de Firestore con:

*  **Usuarios de prueba ya creados.**

*  **Tareas pre-configuradas** (completadas y pendientes) para que puedas evaluar la interfaz de inmediato sin tener que registrar datos manualmente.

Al ejecutar `npm run emulators`, el sistema detectará automáticamente estos archivos y los cargará en tu instancia local.

---

## ✨ Funcionalidades Destacadas

1.  **Auth Flow Inteligente:** Persistencia de sesión mediante `localStorage` sincronizado con Angular Signals.

2.  **Full CRUD:** Creación, edición rápida (inline prompt), eliminación y cambio de estado (toggle) de tareas.

3.  **UI Adaptativa:** Soporte completo para Dark/Light mode y diseño 100% responsivo para móviles.

4.  **Optimización de Bundle:** Gracias a Angular 19, el peso inicial de carga es mínimo (~109kB transferidos).
---

## 🛠️ Stack Tecnológico

| Herramienta | Versión | Propósito |

| :--- | :--- | :--- |

| **Angular** | 19.x | Framework Frontend & Signals |

| **Tailwind CSS** | 4.x | Estilizado UI de última generación |

| **Firebase Suite**| v13+ | Firestore, Functions y Emuladores |

| **Node.js** | 20/22 | Entorno de ejecución Backend |

| **TypeScript** | 5.x | Tipado estricto Fullstack |

---

## 🧪 Estrategia de Testing

El proyecto está preparado para un entorno de pruebas robusto, asegurando que la lógica de negocio y la integridad de la UI se mantengan consistentes:

### Frontend (Unit Tests)

Se utiliza **Jasmine** y **Karma** para validar los componentes y servicios críticos.

*  **TaskService:** Pruebas sobre la reactividad de los Signals y la integración con `HttpClient`.

*  **Componentes:** Validación de renderizado y flujo de formularios reactivos.

**Para ejecutar los tests de Angular:**

```bash
ng  test
```
  ---

Desarrollado  con  ❤️  para  el  Atom  Challenge  por **[Alvison Hunter](https://alvisonhunter.com/)**