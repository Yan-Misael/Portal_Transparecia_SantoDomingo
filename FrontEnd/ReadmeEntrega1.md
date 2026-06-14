# Portal de Transparencia

**Integrantes:**
- Ian Guerrero
- Eva Ponce
- Nicolás Fuentes
- Juan Geraldo

**Tema:**
Tema 33: Portal de Transparencia para la Municipalidad de Santo Domingo.

LINK Figma: https://www.figma.com/make/ZbECgN7h75nc7IG3SfVIry/Portal-de-Transparencia?t=IT8yK5U4tvxlXPqj-1

## Cómo ejecutar el proyecto

Para asegurar la ejecución del Portal de Transparencia en el entorno de desarrollo local, se deben seguir los siguientes pasos:

### 1. Requisitos Previos
Antes de iniciar, es necesario verificar que el entorno de desarrollo cuente con las siguientes herramientas instaladas:
*   **Node.js**: Versión LTS recomendada (v18.x o superior).
*   **Gestor de paquetes**: `npm` (incluido con Node.js) o `yarn`.
*   **Git**: Para el control de versiones y clonación del repositorio.

### 2. Clonación del Repositorio
Obtener una copia local del código fuente ejecutando el siguiente comando en la terminal:
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DE_LA_CARPETA_DEL_PROYECTO>
```

### 3. Instalación de Dependencias
Instalar todas las librerías base necesarias para el funcionamiento de la interfaz y las herramientas de desarrollo del proyecto:
```bash
npm install
```

### 4. Ejecución en Entorno de Desarrollo
Iniciar el servidor local. Este comando habilitará la recarga en caliente (*Hot Module Replacement*) para reflejar los cambios de desarrollo en tiempo real:
```bash
npm run dev
```
Una vez inicializado, la terminal indicará la ruta de acceso local (habitualmente `http://localhost:3000` o `http://localhost:5173`) para visualizar el portal en el navegador.


## Introducción

Aunque la Municipalidad de Santo Domingo cumple con la Ley 20.285 sobre Acceso a la Información Pública mediante la publicación mensual de sus finanzas, el formato de estos datos presenta una barrera de usabilidad. Durante el levantamiento de requerimientos, se constató que la información disponible en el Portal de Transparencia del Estado se entrega en archivos CSV y XLS estáticos y segmentados. En consecuencia, extraer métricas elementales sobre el gasto público exige descargar, cruzar y procesar múltiples documentos, un procedimiento que requiere conocimientos técnicos y contables que dificultan el acceso práctico a la información.

Para abordar esta limitación, identificada por el municipio como "Falta de transparencia en la gestión financiera", este proyecto detalla el diseño e implementación de un portal ciudadano multiplataforma. La solución técnica se centra en procesar, reorganizar y visualizar de manera dinámica los datos financieros crudos, reduciendo la fricción en el acceso a la información y permitiendo una evaluación clara del estado presupuestario municipal por parte de usuarios sin formación técnica.

El presente repositorio corresponde a la Entrega Parcial 1 de la asignatura Ingeniería Web y Móvil (ICI 4247), y establece los cimientos analíticos y arquitectónicos del sistema. De este modo, el README detalla inicialmente la justificación del problema y el usuario objetivo, seguido de la especificación de requerimientos funcionales y no funcionales y la arquitectura de navegación y experiencia de usuario.

## Justificación

### Contexto del problema.

Chile cuenta con un marco normativo robusto en materia de acceso a la información pública. El artículo 8º de la Constitución Política de la República consagra el principio de probidad y publicidad de los actos de los órganos del Estado, y la Ley Nº 20.285 sobre Acceso a la Información Pública (vigente desde abril de 2009) operacionaliza dicho principio mediante dos mecanismos complementarios: la transparencia activa, que obliga a los organismos públicos a publicar mensualmente en sus sitios electrónicos información relativa a su estructura, personal, remuneraciones, compras, transferencias, presupuesto, auditorías y subsidios, entre otras categorías; y la transparencia pasiva, que reconoce a toda persona el derecho de solicitar información a cualquier órgano de la Administración del Estado, debiendo este responder dentro de un plazo legal de 20 días hábiles, prorrogable excepcionalmente por 10 días adicionales (Ley N° 20.285, 2008). Las municipalidades se encuentran expresamente sujetas a estas obligaciones, bajo la fiscalización del Consejo para la Transparencia (CPLT).

En el plano teórico, el derecho de acceso a la información ha sido conceptualizado por el CPLT como un "derecho llave", es decir, un derecho instrumental cuyo ejercicio habilita el acceso a otros derechos fundamentales, tales como salud, vivienda, educación o un medio ambiente libre de contaminación (CPLT, 2018). Esta noción, respaldada por el fallo de la Corte Interamericana de Derechos Humanos en el caso *Claude Reyes vs. Chile* (CIDH, 2006) y por el Objetivo de Desarrollo Sostenible 16 de Naciones Unidas (ONU, 2015), reposiciona el DAI no como un trámite administrativo sino como un instrumento de empoderamiento ciudadano y de control social del Estado.

Sin embargo, la existencia de un marco legal robusto y de un portal de transparencia operativo no garantiza por sí sola el ejercicio efectivo del derecho. La evidencia empírica reciente muestra una brecha sistemática entre la información disponible y la información comprensible:

* Según el Estudio Nacional de Transparencia 2020, un 80 % de la ciudadanía percibe el acceso a la información pública como difícil y un 81 % como lento, pese a que un 85 % la considera necesaria (CPLT, 2021).
* El Informe de Fiscalización 2024 del CPLT, aplicado a las 345 municipalidades del país, reportó un cumplimiento promedio de 78,1 % en transparencia activa, con una caída de 1,2 puntos respecto al período anterior y casos críticos como la Municipalidad de María Elena (2,82 %) o Calama (46,06 %); apenas cuatro municipios alcanzaron el 100 % (CPLT, 2025).
* A nivel histórico, en sus primeros diez años de vigencia la Ley 20.285 generó cerca de 840.000 solicitudes de acceso a información y más de 26.000 amparos ante el CPLT, evidenciando que la vía pasiva sigue siendo necesaria precisamente porque la información publicada no resulta suficiente o digerible (CPLT, 2018).

A esta brecha estructural se suma una brecha de equidad documentada por el propio CPLT: quienes solicitan información son mayoritariamente mujeres de nivel socioeconómico medio-bajo, mientras quienes logran reclamar formalmente cuando la información les es denegada son hombres con educación universitaria de nivel socioeconómico alto, configurando una asimetría que "podría reforzar las exclusiones existentes" (Nash, Rodríguez y Chacón, 2016, citado en CPLT, 2018).

El caso particular de Santo Domingo se inscribe en este patrón. Durante la reunión de levantamiento, el representante municipal precisó que la información financiera se carga manualmente cada mes en el Portal de Transparencia mediante archivos CSV y XLS, organizados por categoría (remuneraciones, ejecución presupuestaria, transferencias, auditorías, etc.). Esta arquitectura, válida desde el punto de vista del cumplimiento legal, traslada al ciudadano la totalidad de la carga de interpretación: para responder preguntas longitudinales o agregadas debe descargar y consolidar múltiples archivos, lo que en la práctica disuade el ejercicio del derecho y termina, paradójicamente, generando solicitudes formales por la vía de transparencia pasiva que consumen tiempo del personal municipal (J. P. Vidal, comunicación personal, 15 de abril de 2026). Los datos del CPLT confirman la urgencia: las áreas donde la ciudadanía percibe mayor necesidad de acceso a la información son salud (82 %), educación (74 %) y vivienda (60 %) (CPLT, 2021), todas ellas reguladas o prestadas en buena parte por los municipios.

El problema, por tanto, no es la ausencia de información, sino su inaccesibilidad práctica: información publicada en formatos crudos, fragmentada temporal y temáticamente, sin contextualización, sin lenguaje ciudadano y sin posibilidad de manipulación dinámica. La consecuencia es la erosión del control social y de la rendición de cuentas que la propia Ley 20.285 buscaba habilitar.

### Usuario objetivo

La plataforma contempla dos roles diferenciados, alineados con el RF de autenticación por roles.

**Rol primario — Ciudadano (acceso público, sin registro).** Vecinos de Santo Domingo, periodistas locales y de medios regionales, dirigentes vecinales, organizaciones de la sociedad civil, estudiantes e investigadores que requieren consultar la gestión financiera del municipio. Se trata de un usuario heterogéneo en edad y formación, mayoritariamente sin conocimientos técnicos contables o presupuestarios, que accede de forma intermitente (típicamente ante una duda puntual o un evento que activa el interés) y desde dispositivos móviles. Sus necesidades centrales son responder preguntas concretas sin necesidad de recorrer todo el portal, comparar períodos, entender cifras agregadas en lenguaje cotidiano, y (iv) descargar evidencia para reutilizarla.

**Rol secundario — Administrador Municipal (acceso autenticado).** Funcionario o funcionaria de la unidad de transparencia o del área de comunicaciones del municipio, responsable de la carga mensual de los archivos CSV correspondientes a cada categoría obligatoria. Su perfil es el de un usuario administrativo recurrente con conocimiento del dominio normativo pero sin competencias avanzadas de desarrollo. Sus necesidades son operativas: una interfaz protegida con autenticación robusta (JWT, según el RNF de seguridad), procesos de carga simples sin edición de código, validaciones automáticas que prevengan errores de formato y trazabilidad de las cargas realizadas.

Este proyecto se justifica como una respuesta concreta a una brecha documentada entre el cumplimiento formal de la Ley de Transparencia y el ejercicio efectivo del derecho de acceso a la información pública, alineándose con la noción del DAI como derecho llave e instrumentalizándola al nivel local mediante una plataforma que prioriza la comprensibilidad, la equidad de acceso y la sostenibilidad operativa.

---

## Descripción del Proyecto
El **Portal de Transparencia** es una plataforma web diseñada para la Municipalidad de Santo Domingo, que tiene como objetivo principal garantizar a la ciudadanía el derecho a conocer cómo el municipio administra los recursos públicos. Este sistema permite consultar información de forma simple, directa y sin burocracia , cumpliendo con los estándares de la Ley 20.285 sobre Acceso a la Información Pública.

## Requerimientos del sistema

A partir del problema documentado en la  sección previa y de los dos perfiles de usuario identificados, esta sección operacionaliza la propuesta de solución mediante la especificación de los requerimientos funcionales (RF) y no funcionales (RNF) que el sistema debe satisfacer. Los requerimientos se desprenden directamente de las necesidades expuestas: el ciudadano necesita información comprensible, filtrable y descargable; el administrador municipal necesita un mecanismo de carga sostenible y seguro; ambos comparten la exigencia de que la plataforma sea accesible, responsiva y respete los lineamientos del Framework Digital del Gobierno de Chile, alineado con los estándares WCAG 2.1.

Cada requerimiento se identifica mediante un código único (`RF-XX` o `RNF-XX`), un actor responsable, una descripción funcional y un criterio de aceptación medible que permitirá su verificación durante las entregas posteriores.

### Roles del sistema

La plataforma define dos roles con permisos diferenciados, conforme a lo enunciado en la sección siguiente:

* **Ciudadano.** Usuario público con acceso de solo lectura. No requiere registro ni autenticación. Puede consultar todas las vistas de datos, aplicar filtros temporales y descargar información en los formatos disponibles.
* **Administrador Municipal.** Funcionario autenticado mediante JWT. Hereda los permisos del Ciudadano y adicionalmente puede cargar archivos CSV mensuales, revisar el historial de cargas y gestionar metadatos asociados a las categorías obligatorias por ley.

Los requerimientos cuyo actor es exclusivamente el Administrador (`RF-10`, `RF-11`) se ejecutan tras autenticación; los demás están disponibles públicamente sin barreras de acceso.

## Requerimientos funcionales


| ID | Nombre | Actor | Descripción | Criterio de aceptación |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01** | Filtro temporal de datos | Ciudadano | Desde la pantalla principal, el usuario selecciona un mes y un año mediante dos selectores y un botón *Ingresar*. La selección define el período activo del sistema y se mantiene visible en la cabecera durante toda la navegación posterior. | El selector permite elegir cualquier mes y año desde el inicio de operaciones del municipio hasta el período más reciente con datos publicados. Tras presionar *Ingresar*, el sistema redirige a la grilla de categorías mostrando "Período activo: Mes Año". |
| **RF-02** | Dashboard de cifras destacadas | Ciudadano | La pantalla principal incluye un panel con tres indicadores resumen del período más reciente (presupuesto ejecutado, personal activo, número de transferencias), presentados en formato de tarjeta con icono y cifra prominente. | El panel muestra exactamente tres tarjetas con valores actualizados al período más reciente disponible. Cada cifra se acompaña de una etiqueta descriptiva en lenguaje no técnico. |
| **RF-03** | Navegación por categorías de transparencia | Ciudadano | Tras aplicar el filtro temporal, el sistema despliega una grilla con las diez categorías obligatorias por la Ley 20.285: Estructura y Organización, Remuneraciones del Personal, Contrataciones y Compras, Transferencias de Fondos, Ejecución Presupuestaria, Subsidios y Beneficios Sociales, Actos y Resoluciones Municipales, Auditorías e Informes de Control, Trámites y Servicios, y Mecanismos de Participación Ciudadana. Cada categoría se presenta como tarjeta con icono, título y descripción breve. | La grilla muestra las diez categorías obligatorias por ley. La selección de una tarjeta redirige a la vista de detalle correspondiente sin recarga completa de página, conservando el período activo. |
| **RF-04** | Vista de detalle tabular | Ciudadano | Para las categorías Remuneraciones del Personal, Contrataciones y Compras, y Transferencias de Fondos, el sistema presenta los registros en una tabla paginada y ordenable. Cada columna actúa como criterio de orden ascendente o descendente, y la tabla se filtra por el período activo. | La tabla permite ordenar por cualquier columna haciendo clic en su encabezado, alterna ascendente/descendente, y pagina con al menos 10 registros por página. En móvil adopta scroll horizontal o transformación a tarjetas. |
| **RF-05** | Vista de detalle por listado de tarjetas | Ciudadano | Para las categorías Subsidios y Beneficios Sociales, Actos y Resoluciones, Auditorías e Informes, Trámites y Servicios, y Mecanismos de Participación, el sistema presenta cada elemento como una tarjeta independiente con encabezado, descripción, metadatos (fecha, tipo, estado) y botón de acción individual. | Cada tarjeta muestra al menos: título, fecha o período, descripción breve y botón de acción contextual (descargar, ver detalle o expandir). El listado responde a los filtros aplicados sobre la categoría. |
| **RF-06** | Visualización gráfica de categorías financieras | Ciudadano | Para las categorías Ejecución Presupuestaria, Transferencias de Fondos y Contrataciones y Compras, el sistema presenta gráficos interactivos (torta o barras) acompañados de una bajada ciudadana en lenguaje simple (ej.: "El 38% del presupuesto se destinó a Obras Públicas"). | El gráfico es interactivo con tooltips e incluye leyenda con porcentajes o montos. La bajada ciudadana se actualiza dinámicamente con los datos del período filtrado y no excede 60 palabras. |
| **RF-07** | Visualización jerárquica de Estructura y Organización | Ciudadano | La categoría Estructura y Organización presenta el organigrama municipal mediante una vista jerárquica de tres niveles: tarjeta destacada del Alcalde, grilla descriptiva de direcciones y departamentos con responsable y subdepartamentos, y un diagrama visual del organigrama con descarga en PDF. | El organigrama refleja la estructura vigente al período activo. Cada nodo identifica nombre de la unidad, autoridad responsable y, cuando corresponde, subdepartamentos asociados. La descarga PDF está disponible. |
| **RF-08** | Búsqueda y filtrado contextual por categoría | Ciudadano | En las vistas de detalle, el sistema provee mecanismos de búsqueda por palabra clave y filtros adicionales según la naturaleza de la categoría (por ejemplo, filtro por materia en Actos, por tipo de auditoría en Auditorías). Los filtros aplicados afectan tanto a la presentación visual como a las descargas posteriores. | El campo de búsqueda filtra en tiempo real al escribir, sin botón *Buscar* adicional. Los filtros adicionales son combinables. La descarga refleja el subconjunto filtrado, no el total. |
| **RF-09** | Resúmenes estadísticos por categoría | Ciudadano | Cada vista de detalle incluye un panel de tarjetas-resumen con indicadores agregados relevantes a la categoría (ej.: total de auditorías, número de aprobadas y observadas, conteo de externas en Auditorías; total de subsidios, beneficiarios y monto agregado en Subsidios). | Cada vista de detalle presenta entre tres y cuatro indicadores agregados, calculados sobre los datos del período activo y actualizados ante cambios en los filtros. |
| **RF-10** | Sección educativa contextual | Ciudadano | La pantalla principal y cada vista de detalle incluyen un bloque informativo en lenguaje ciudadano que explica el marco legal o conceptual de la categoría (ej.: "¿Qué es un Portal de Transparencia?", "¿Qué son las auditorías municipales?", "¿Qué son los actos administrativos?"). | Cada bloque educativo tiene máximo 250 palabras, evita tecnicismos jurídicos y, cuando corresponde, enlaza a fuentes oficiales como la Biblioteca del Congreso Nacional. |
| **RF-11** | Descarga de datos consolidada por categoría | Ciudadano | Desde cada vista de detalle, el usuario descarga la totalidad de los registros visibles en formato CSV o PDF. El nombre del archivo se compone automáticamente con la categoría y el período activo. | Ambos formatos están disponibles. El nombre del archivo sigue el patrón `<categoria>-<mes>-<año>.<ext>`. La descarga refleja los datos filtrados al momento de generar el archivo. |
| **RF-12** | Descarga individual de documentos | Ciudadano | En las categorías Auditorías e Informes y Actos y Resoluciones Municipales, cada elemento del listado expone un botón de descarga independiente que genera un PDF con el detalle del documento (resumen, hallazgos, metadatos). | Cada documento descargado incluye el encabezado institucional, los metadatos del acto o auditoría y los hallazgos asociados. El nombre del archivo identifica unívocamente el documento (ej.: `auditoria-3-10-12-2025.pdf`). |
| **RF-13** | Registro público de ciudadanos | Ciudadano | La plataforma ofrece un formulario de registro voluntario que solicita nombre de usuario, RUT, correo electrónico, región, comuna, contraseña, confirmación de contraseña y aceptación de términos y condiciones. El registro no condiciona el acceso a la información pública. | El formulario valida formato de RUT chileno, formato de correo, coincidencia entre contraseña y confirmación, y aceptación obligatoria de términos. Tras un envío exitoso muestra confirmación visual con *CheckCircle*. |
| **RF-14** | Personalización de accesibilidad | Ciudadano | La cabecera contiene una barra persistente de accesibilidad que permite activar el modo de alto contraste, ajustar la tipografía en tres niveles (16/20/24 px) e iniciar la lectura del contenido en voz alta. Las preferencias se almacenan localmente y se reaplican en visitas posteriores. | Las preferencias persisten entre sesiones del mismo navegador (mediante `localStorage`). El cambio de contraste o tamaño se aplica inmediatamente sin recarga, y se anuncia a lectores de pantalla mediante `aria-live`. |
| **RF-15** | Autenticación por roles | Administrador | El sistema diferencia dos roles: Ciudadano (acceso público sin registro obligatorio) y Administrador (acceso autenticado vía JWT). El acceso al panel administrativo se realiza mediante el botón *Login* en la cabecera, separado del flujo público y restringido al dominio institucional `@santodomingo.cl`. | Las rutas administrativas devuelven HTTP 401 ante peticiones sin token o con token expirado. Las contraseñas se almacenan cifradas con bcrypt. Tras 3 intentos fallidos consecutivos se aplica bloqueo temporal de 5 minutos. La sesión expira automáticamente a la hora de inactividad. |
| **RF-16** | Cierre de sesión seguro | Administrador | Desde cualquier vista autenticada, el administrador puede cerrar la sesión mediante el botón *Cerrar sesión* disponible en la cabecera. La acción invalida el token JWT activo y redirige al portal público. | El token se elimina del almacenamiento local de inmediato. Tras el cierre, intentos posteriores a rutas administrativas redirigen a `/login`. La cabecera vuelve a mostrar el botón *Login*. |
| **RF-17** | Carga y procesamiento de archivos CSV | Administrador | El administrador carga archivos `.csv` mensuales por categoría a través de una interfaz protegida que incluye selectores de categoría, mes y año, y una zona de arrastrar-y-soltar. El sistema procesa el archivo con barra de progreso y registra cada carga en un historial cronológico. | La carga acepta archivos hasta 10 MB. El sistema valida estructura y reporta errores específicos (columna faltante, tipo de dato incorrecto). El historial muestra fecha, categoría, nombre del archivo y resultado de cada carga. Los datos están disponibles en las vistas públicas en menos de 5 minutos. |

## Requerimientos no funcionales

| ID | Nombre | Categoría | Descripción | Criterio de aceptación |
| :--- | :--- | :--- | :--- | :--- |
| **RNF-01** | Diseño responsivo (mobile-first) | Usabilidad | La interfaz se adapta correctamente a móviles (mínimo 320 px), tablets y escritorio, siguiendo los cinco breakpoints del Framework Digital del Gobierno (`< 576 px`, `>= 576 px`, `>= 768 px`, `>= 992 px`, `>= 1200 px`). Las tablas adoptan scroll horizontal o tarjetas en móvil; los gráficos se reescalan al viewport. | La aplicación es operativa sin scroll horizontal involuntario en pantallas desde 320 px. Las tablas se transforman correctamente en breakpoints `< 576 px`. Los gráficos mantienen legibilidad de etiquetas a partir de 320 px. |
| **RNF-02** | Rendimiento de carga | Rendimiento | El sistema prioriza la carga visual del contenido principal mediante prácticas de optimización web: declaración de scripts JavaScript al final del `<body>`, lazy-loading de imágenes y minimización de solicitudes bloqueantes durante el render inicial. | First Contentful Paint (FCP) inferior a 1.8 segundos en escritorio y Time to Interactive (TTI) inferior a 3.5 segundos en conexión móvil 3G simulada (Chrome DevTools, Lighthouse). |
| **RNF-03** | Seguridad de autenticación | Seguridad | Las rutas administrativas se protegen mediante JSON Web Tokens (JWT) con expiración. Las contraseñas se almacenan con hash bcrypt (factor de costo >= 10) y nunca se transmiten en texto plano. Toda comunicación cliente-servidor utiliza HTTPS. | Las rutas `/admin/*` responden 401 ante peticiones sin token o con token expirado. Las contraseñas en base de datos contienen hashes bcrypt verificables. Tras 3 intentos fallidos consecutivos se aplica throttling. |
| **RNF-04** | Accesibilidad web (WCAG 2.1 AA) | Usabilidad | La plataforma cumple el nivel WCAG 2.1 AA, alineándose con los lineamientos del Framework Digital del Gobierno: contraste mínimo de 4.5:1 en texto normal, alternativas textuales en gráficos, navegación completa por teclado, etiquetas semánticas en formularios y compatibilidad con lectores de pantalla. | Verificación con axe DevTools y Lighthouse sin issues de severidad crítica. Todos los flujos principales (filtrar período, navegar categorías, descargar datos) son completables únicamente con teclado. |
| **RNF-05** | Lenguaje ciudadano | Usabilidad | Toda información financiera se acompaña de un texto interpretativo ("bajada ciudadana") en lenguaje simple, evitando tecnicismos contables o presupuestarios. Un usuario sin formación técnica debe comprender el dato sin recurrir a fuentes externas. | Cada vista de datos numéricos incluye al menos un párrafo interpretativo de máximo 60 palabras. Nivel de legibilidad "fácil" o superior según el índice Fernández-Huerta. |

## Matriz de trazabilidad

La Tabla relaciona cada requerimiento funcional con la pantalla del prototipo en que se materializa y con la ruta del frontend en que se implementa, definidas con mayor detalle en las secciones previas. La matriz permite verificar la cobertura completa de los requerimientos a lo largo del diseño y la implementación.

### Matriz de trazabilidad RF ↔ pantalla ↔ ruta.

| ID | Pantalla / Componente | Ruta del frontend |
| :--- | :--- | :--- |
| **RF-01** | Pantalla principal -- Selector de período | `/` |
| **RF-02** | Pantalla principal -- Dashboard de cifras | `/` (componente persistente) |
| **RF-03** | Pantalla de categorías -- Grilla de 10 tarjetas | `/categorias` |
| **RF-04** | Vistas tabulares: Remuneraciones, Contrataciones, Transferencias | `/remuneraciones`, `/contrataciones`, `/transferencias` |
| **RF-05** | Vistas con listado de tarjetas: Subsidios, Actos, Auditorías, Trámites, Participación | `/subsidios`, `/actos`, `/auditorias`, `/tramites`, `/participacion` |
| **RF-06** | Vistas con gráfico: Presupuesto, Transferencias, Contrataciones | `/presupuesto`, `/transferencias`, `/contrataciones` |
| **RF-07** | Vista jerárquica de Estructura y Organización | `/estructura` |
| **RF-08** | Componentes de búsqueda y filtros embebidos | Componentes locales en cada vista de detalle |
| **RF-09** | Tarjetas-resumen estadístico embebidas | Componentes locales en cada vista de detalle |
| **RF-10** | Bloques educativos contextuales | `/` y vistas de detalle (componentes embebidos) |
| **RF-11** | Botón *Descargar CSV/PDF* en cada vista de detalle | Endpoint `/api/export/:categoria` |
| **RF-12** | Botón *Descargar* individual en cada tarjeta | Función local de generación PDF (jsPDF) |
| **RF-13** | Pantalla de registro público | `/registro` |
| **RF-14** | Barra de accesibilidad persistente en cabecera | Componente `AccessibilityToolbar` |
| **RF-15** | Pantalla de login y middleware de autenticación | `/login`, middleware `/admin/*` |
| **RF-16** | Botón *Cerrar sesión* en cabecera autenticada | Acción local + redirección a `/` |
| **RF-17** | Panel de carga del Administrador | `/admin` (protegida) |


---


# Flujo del Proyecto

El flujo de uso de la plataforma se inicia cuando el ciudadano ingresa al portal y entra a la pantalla principal. Esta vista actúa como punto único de entrada al sistema y reúne tres elementos: un encabezado de bienvenida que presenta la municipalidad, un formulario central con dos selectores (mes y año) acompañado de un botón *Ingresar*, y una sección educativa permanente que explica brevemente qué es la Ley 20.285 y por qué garantiza el derecho ciudadano a consultar la información pública. En la parte inferior se muestran tres tarjetas con cifras destacadas del último período disponible: presupuesto ejecutado, personal activo y número de transferencias del mes.

El usuario selecciona el mes y el año del período que desea consultar, y al presionar el botón *Ingresar* el sistema redirige a la pantalla de categorías de transparencia, transmitiendo el período seleccionado como contexto activo. A partir de este momento, ese período se mantiene visible en la cabecera de cada vista posterior bajo la etiqueta "Período activo: \[mes\] \[año\]", de modo que el usuario nunca pierde la referencia temporal sobre la que está consultando datos.

En la pantalla de categorías, el sistema despliega una grilla con las diez áreas de información obligatorias por la Ley 20.285: Estructura y Organización, Remuneraciones del Personal, Contrataciones y Compras, Transferencias de Fondos, Ejecución Presupuestaria, Subsidios y Beneficios Sociales, Actos y Resoluciones Municipales, Auditorías e Informes de Control, Trámites y Servicios, y Mecanismos de Participación Ciudadana. Cada categoría se presenta como una tarjeta interactiva que incluye un icono representativo, su nombre y una breve descripción de su contenido, lo que permite al ciudadano elegir intuitivamente el área que le interesa explorar.

Cuando el usuario selecciona una de las tarjetas, el sistema lo conduce a la vista de detalle correspondiente, conservando el período activo como filtro implícito sobre los datos mostrados. La estructura interna de cada vista de detalle se adapta al tipo de información que despliega, pero todas comparten un patrón común: un breadcrumb superior que permite regresar a la grilla de categorías, el título y descripción contextual de la categoría, una barra de herramientas con un buscador por palabra clave y un botón de descarga, y el componente principal de visualización de los datos.

En las categorías que presentan información tabular (Remuneraciones, Contrataciones, Subsidios, Actos y Resoluciones, Auditorías, Trámites y Mecanismos de Participación) la información se despliega en una tabla paginada y ordenable que permite al usuario navegar registro por registro, ordenar por cualquier columna y filtrar por nombre o cargo según la categoría. En las vistas de carácter financiero (Ejecución Presupuestaria y Transferencias de Fondos) la tabla se complementa con un gráfico interactivo que ilustra visualmente la distribución del gasto, acompañado de una breve interpretación en lenguaje ciudadano (por ejemplo, "El 38 % del presupuesto se destinó a Obras Públicas") que traduce el dato técnico en una afirmación comprensible para usuarios sin formación contable. En la categoría Estructura y Organización, en cambio, la información se presenta como un organigrama jerárquico que refleja las unidades del municipio y sus autoridades responsables.

Desde cualquier vista de detalle, el ciudadano puede descargar la información actualmente visible mediante el botón *Descargar CSV*, lo que genera un archivo nombrado automáticamente con la categoría y el período consultado (por ejemplo, `remuneraciones-Marzo-2026.csv`). Esta funcionalidad permite al usuario reutilizar los datos en herramientas externas sin necesidad de procesar la información en el portal mismo.

En paralelo al flujo público, el sistema ofrece un canal restringido orientado al personal municipal. En la esquina superior derecha del encabezado, el botón *Login* da acceso a la pantalla de autenticación, separada visualmente del resto del portal mediante un fondo distintivo y una identificación clara como "Acceso exclusivo para funcionarios municipales". El formulario solicita correo electrónico y contraseña, y aplica tres validaciones secuenciales: que ambos campos estén completos, que la contraseña tenga al menos seis caracteres, y que el correo pertenezca al dominio institucional `@santodomingo.cl`. Si alguna validación falla, el sistema muestra un mensaje de error específico sin abandonar la pantalla de login. Cuando las credenciales son válidas, el sistema genera un token JWT con expiración de una hora, lo persiste en el navegador, y redirige automáticamente al panel de administración.

En el panel de administración, el funcionario accede a una vista dividida en dos áreas funcionales. A la izquierda se encuentra el formulario de carga de archivos, donde el administrador selecciona la categoría a actualizar, el mes y año correspondientes, y luego carga el archivo CSV mediante una zona de arrastrar-y-soltar o un selector tradicional. Una vez confirmada la carga, una barra de progreso animada acompaña el procesamiento del archivo y, al finalizar, un mensaje de éxito confirma que los datos están disponibles en el portal público. A la derecha, un panel de historial muestra cronológicamente las cargas realizadas, indicando para cada una la fecha, la categoría afectada, el nombre del archivo y un indicador visual del resultado (éxito o error). Al concluir la sesión, el administrador puede cerrarla mediante el botón *Cerrar sesión* del encabezado, lo que invalida el token y devuelve la navegación al portal público.

Adicionalmente, el sistema integra una barra de herramientas de accesibilidad persistente en la parte superior de todas las vistas públicas, que permite al usuario activar el modo de alto contraste, ajustar el tamaño de la tipografía en tres niveles e iniciar la lectura del contenido en voz alta. Las preferencias seleccionadas se almacenan localmente y se reaplican automáticamente en visitas posteriores, garantizando una experiencia accesible y persistente conforme a los lineamientos WCAG 2.1 AA.

---

# Visualización de Prototipado

## Caracteristicas Principales
El portal esta diseñado para ser iclusivo, incorporando herramientas en la cabecera superior:
- **Ajuste de Contraste:** Opciones para cambiar a alto contraste o mantener el contraste normal.
- **Tamaño de Fuente:** Selector dinámico para cambiar el tamaño de la letra (Normal, Grande, Muy Grande).
- **Asistente de Lectura:** Botón "Leer" (Text-to-speech) para dictado de pantalla.

## Panel de Inicio
La pagina principal ofrece un resumen rapido del estado del municipio, entregando indicadores claves (ultimas cifras disponibles) con tarjetas de resumenes que muestran el presupuesto ejecutado, y un filtro global, que le permite al usuario seleccionar un mes y un año especifico (ej. Marzo 2026) para contetualizar toda la información del portal.

![Panel de Inicio](./img/portal1.jpg)

![Panel de Inicio](./img/portal2.jpg)

## Navegación y Categoria de Transparencia
El nucleo del portal se divide en 10 categorias principales de facil acceso:

1. Estructura y Organización
Muestra el organigrama municipal y detalla las direcciones, departamentos y autoridades (ej. Alcalde, DIDECO, DOM), permitiendo descargar el organigrama completo en PDF.

![Estructura y Organización](./img/organigrama1.jpg)
![Estructura y Organización](./img/organigrama2.jpg)
![Estructura y Organización](./img/organigrama3.jpg)

2. Remuneraciones del Personal
Despliega una tabla con los sueldos brutos y líquidos de los funcionarios, filtrable por cargo e incluye la opción de descargar los datos en formato .csv.

![Remuneraciones](./img/remuneracion1.jpg)
![Remuneraciones](./img/remuneracion2.jpg)

3. Contrataciones y Compras
Visualiza licitaciones y contratos vigentes mediante gráficos interactivos distribuidos por tipo (Bienes, Servicios, Equipamiento), junto con un listado detallado de proveedores.

![Contrataciones y Compras](./img/compras1.jpg)
![Contrataciones y Compras](./img/compras2.jpg)

4. Transferencias de Fondos
Expone los recursos entregados a organizaciones externas (ej. fundaciones, ONG). Muestra promedios y detalles por institución beneficiaria.

![Transferencias](./img/transferencia1.jpg)
![Transferencias](./img/transferencia2.jpg)

5. Ejecución Presupuestaria
Presenta un desglose mediante un gráfico circular del gasto municipal distribuido por áreas como Obras Públicas, Educación, Salud, etc., explicando de forma pedagógica qué significa esto para la comunidad.

![Ejecución Presupuestaria](./img/presupuesto1.jpg)
![Ejecución Presupuestaria](./img/presupuesto2.jpg)

6. Subsidios y Beneficios Sociales
Enumera los programas sociales activos (ej. SUF, Subsidio de Agua Potable) mostrando la cantidad de beneficiarios y montos distribuidos, manteniendo el anonimato y protección de datos personales de acuerdo a la ley.

![Subsidios y Beneficios](./img/subsidios1.jpg)
![Subsidios y Beneficios](./img/subsidios2.jpg)
![Subsidios y Beneficios](./img/subsidios3.jpg)

7. Actos y Resoluciones Municipales
Repositorio de decretos, permisos (ej. permisos de edificación, circulación) y licitaciones, con opción directa de descarga de documentos.

![actos](./img/actos1.jpg)
![actos](./img/actos2.jpg)
![actos](./img/actos3.jpg)

8. Auditorías e Informes de Control
Sección dedicada a los resultados de auditorías internas y externas (ej. Contraloría), presentando resúmenes ejecutivos, principales hallazgos y descargas en PDF.

![Auditorías](./img/auditoria1.jpg)
![Auditorías](./img/auditoria2.jpg)
![Auditorías](./img/auditoria3.jpg)
![Auditorías](./img/auditoria4.jpg)

9. Trámites y Servicios
Un catálogo de servicios municipales (ej. Certificado de Antecedentes, Patente Comercial) que detalla plazos, costos, requisitos y permite iniciar el trámite en línea.

![Trámites y Servicios](./img/tramites1.jpg)
![Trámites y Servicios](./img/tramites2.jpg)
![Trámites y Servicios](./img/tramites3.jpg)
![Trámites y Servicios](./img/tramites4.jpg)
![Trámites y Servicios](./img/tramites5.jpg)

10. Mecanismos de Participación Ciudadana
Fomenta el involucramiento ciudadano mostrando instancias como el COSOC, Consultas Ciudadanas y Presupuestos Participativos, con calendarios y opciones de inscripción.

![Participación Ciudadana](./img/participacion1.jpg)
![Participación Ciudadana](./img/participacion2.jpg)
![Participación Ciudadana](./img/participacion3.jpg)

## Panel de Administrador
El prototipo contempla un flujo privado para los funcionarios municipales encargado de mantener la plataforma actualizada, posee 4 caracteristicas destacables:
- **Acceso Seguro:** Requiere inicio de sesión mediante correo electrónico institucional y contraseña. Para ingresar y probar la implementación: 
    - usuario: usuario@santodomingo.cl
    - contraseña: 123456

![login](./img/login.jpg)

- **Carga Masiva de Datos:** Interfaz intuitiva tipo "arrastrar y soltar" para subir archivos .csv.

![login](./img/login2.jpg)

- **Selección de Categoría y Periodo:** El administrador selecciona a qué categoría (ej. Remuneraciones, Presupuesto) y a qué mes/año corresponden los datos antes de cargar.

![categoria](./img/categoria.jpg)

- **Historial de Cargas:** Un registro lateral que confirma visualmente las actualizaciones recientes realizadas en el portal, garantizando la trazabilidad.

![historial](./img/historial.jpg)


## Referencias

* **CIDH (2006)**. Corte Interamericana de Derechos Humanos. *Caso Claude Reyes y otros vs. Chile. Sentencia de 19 de septiembre de 2006*. San José, Costa Rica.
* **CPLT (2018)**. Consejo para la Transparencia. *El Derecho de Acceso a la Información Pública como Derecho Llave para el acceso a otros derechos fundamentales*. Cuaderno de Trabajo Nº 10. Santiago, Chile.
* **CPLT (2021)**. Consejo para la Transparencia. *Estudio Nacional de Transparencia 2020 — Informe Final*. Santiago, Chile.
* **CPLT (2025)**. Consejo para la Transparencia. *Informe de Fiscalización Municipal 2024 — Transparencia Activa*. Santiago, Chile.
* **Ley N° 20.285 (2008)**. *Sobre Acceso a la Información Pública*. Diario Oficial de la República de Chile, 20 de agosto de 2008.
* **ONU (2015)**. Organización de las Naciones Unidas. *Objetivos de Desarrollo Sostenible — ODS 16: Paz, justicia e instituciones sólidas*. Nueva York: Naciones Unidas.
