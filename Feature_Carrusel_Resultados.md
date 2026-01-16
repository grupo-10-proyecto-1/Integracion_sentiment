### **Tarea: Implementar Carrusel para Resultados de Análisis**

**Asignado a:** Dev 3 (Frontend)
**Reporta a:** Dev 2 (Líder de Equipo)
**Prioridad:** Media

#### **Descripción General**

Actualmente, la interfaz solo muestra el último resultado del análisis de sentimiento. Para mejorar la experiencia del usuario, se implementará un carrusel interactivo que mostrará una lista de los análisis recientes, permitiendo al usuario navegar entre ellos.

#### **User Story (Historia de Usuario)**

COMO usuario,
QUIERO ver mis análisis de sentimiento recientes en un carrusel interactivo,
PARA poder comparar y revisar mis consultas anteriores sin tener que volver a escribirlas.

#### **Criterios de Aceptación**

1.  Al realizar un nuevo análisis, el resultado se añade a un carrusel visible en la UI.
2.  El resultado más reciente debe aparecer primero en la lista (al principio del carrusel).
3.  El carrusel debe permitir navegación manual (ej. flechas) entre los resultados.
4.  La sección estática actual (`app-mock-carousel`) debe ser **eliminada** y reemplazada por este nuevo carrusel dinámico.
5.  El carrusel debe ser *responsive* y visualizarse correctamente tanto en escritorio como en móvil.
6.  Si solo hay un resultado, el carrusel debe mostrarlo correctamente sin errores visuales o de consola.

---

### **Guía de Implementación Técnica (Sugerida)**

Esta es una guía paso a paso para la implementación.

**Paso 1: Instalar y Configurar una Librería de Carrusel**

Para agilizar el desarrollo y asegurar una solución robusta, se recomienda usar **Swiper.js** (es moderno, popular y tiene excelente integración con Angular).

1.  **Instala la dependencia:**
    ```bash
    npm install swiper
    ```

2.  **Registra los elementos de Swiper:** En el archivo `sentiment.component.ts` (o en un módulo principal si se prefiere), registra los elementos de Swiper para que Angular los reconozcha.
    ```typescript
    // En sentiment.component.ts
    import { register } from 'swiper/element/bundle';
    register(); // Llama a esta función en el constructor o en ngOnInit
    ```

**Paso 2: Adaptar el Componente Principal para Manejar una Lista**

Modifica `sentiment.component.ts` para que almacene una lista de resultados en lugar de uno solo.

1.  **Actualiza la propiedad `result`:** Cámbiala de un objeto a un array.
    ```typescript
    // Antes:
    // result: any;

    // Después:
    results: any[] = [];
    ```

2.  **Modifica el método `analyze`:** En lugar de reemplazar el resultado, añádelo al principio del array.
    ```typescript
    // Dentro del método analyze(), en el .subscribe()
    // Antes:
    // this.result = response;

    // Después:
    this.results.unshift(response);

    // (Opcional pero recomendado) Limita el número de resultados a, por ejemplo, los 10 más recientes.
    if (this.results.length > 10) {
      this.results.pop();
    }
    ```

**Paso 3: Implementar el Carrusel en el Template**

Ahora, actualiza `sentiment.component.html` para usar el nuevo carrusel.

1.  **Elimina el código antiguo:**
    *   Borra la línea `<app-mock-carousel></app-mock-carousel>`.
    *   Borra el bloque de `<app-sentiment-result *ngIf="result" ...>`.

2.  **Añade el nuevo carrusel de Swiper:** Usa el siguiente código como base. Iterará sobre el array `results` y creará una "diapositiva" (`<swiper-slide>`) para cada resultado.

    ```html
    <!-- Contenedor principal para el carrusel de resultados -->
    <div *ngIf="results.length > 0" class="max-w-7xl mx-auto py-12 px-6">
      <h2 class="text-3xl font-extrabold text-white tracking-tight text-center mb-8">
        Análisis Recientes
      </h2>

      <swiper-container
        [slides-per-view]="1"
        [space-between]="30"
        [navigation]="true"
        [pagination]="{ clickable: true }"
        class="pb-10"
      >
        <swiper-slide *ngFor="let res of results">
          <!-- Reutilizamos el componente que ya existía para mostrar cada resultado -->
          <app-sentiment-result
            [text]="res.text"
            [result]="res.result"
          ></app-sentiment-result>
        </swiper-slide>
      </swiper-container>
    </div>
    ```

**Paso 4: Estilos y Pruebas**

1.  Asegúrate de que el carrusel se vea bien. Puede que necesites añadir algo de CSS para centrarlo o darle un tamaño máximo/mínimo.
2.  Prueba la funcionalidad según los Criterios de Aceptación.
