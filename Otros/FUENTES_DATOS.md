# Fuentes de los datos del seed

Toda la información sembrada por `prisma/seed.js` proviene de fuentes
oficiales públicas, verificadas en mayo de 2026.

## Datos verificados

### Identificación municipal
| Campo | Valor | Fuente |
| --- | --- | --- |
| Razón social | I. Municipalidad de Santo Domingo | SINIM ficha 05606 |
| RUT | 69.073.500-8 | SINIM / Mercado Público |
| Región | Valparaíso | SINIM |
| Provincia | San Antonio | SINIM |
| Superficie | 536 km² | SINIM |
| Población | 12.758 hab. | SINIM (INE estimada) |
| Sitio web | santodomingo.cl | Oficial |

### Autoridades 2025-2028
| Cargo | Persona | Filiación |
| --- | --- | --- |
| Alcalde | Fernando Rodríguez Larraín | IND (electo oct-2024 con 52,20%) |
| Concejal | Germán Mayo de Goyeneche | IND - Partido Republicano |
| Concejal | Claudio Núñez Agüero | Unión Demócrata IND |
| Concejal | Cristina Huerta Farías | IND - Renovación Nacional |
| Concejal | Felipe Soto Abarca | Partido Radical |
| Concejal | Carla González León | Evópoli |
| Concejal | Fabiola Contreras Fuentes | Democracia Cristiana |

Fuente: SINIM (ficha comunal 05606, actualización mayo 2026) y Meganoticias / Servel para resultados electorales.

### Direcciones municipales (18)
Listadas en santodomingo.cl/direcciones/. Las reales de la municipalidad
son las que se siembran en la tabla `Departamento`.

### Presupuesto 2025 — Cifras BEP oficiales (SINIM)
Reportadas por la Municipalidad al SINIM (datos.sinim.gov.cl), montos
expresados en miles de pesos chilenos en la fuente, convertidos a pesos
en el seed:

| Concepto | Monto oficial |
| --- | --- |
| Ingreso Total Percibido 2025 | $24.206.857.000 |
| Gasto Total Devengado 2025 | $26.324.260.000 |
| Aporte Municipal Educación | $1.786.244.000 |
| Gasto Total Educación Devengado | $7.568.263.000 |
| Aporte Municipal Salud | $2.255.680.000 |
| Gasto Total Salud Devengado | $5.872.219.000 |
| Servicios de Aseo y Recolección | $2.200.244.000 |
| Servicios Mantención Alumbrado | $135.231.000 |
| Gastos en Personal (Subt. 21) | $6.939.953.000 |
| Fondo Común Municipal Percibido | $2.597.873.000 |

Las cifras de presupuesto por dirección en el seed totalizan
$26.945 millones (asignado 2025), del mismo orden que el gasto
devengado oficial de $26.324 millones. La distribución por dirección
es una estimación realista, dado que SINIM no publica desglose
presupuestario por dirección administrativa.

### Contratos — Mercado Público
Los títulos de los 12 contratos sembrados son licitaciones reales
publicadas en mercadopublico.cl bajo el RUT 69.073.500-8:

| Código real | Título | Monto real publicado |
| --- | --- | --- |
| 3232-5-LE25 | Servicio de transporte para alumnos universitarios | $29.600.000 |
| 3243-7-LE26 | Instalación de empalmes y equipos de iluminación | $15.000.000 |
| 3243-24-LE24 | Medialuna Modular - Centro Recreativo El Convento | (publicado, monto adjudicado no consultado) |
| — | Señalética de evacuación tsunami | (real, monto estimado) |
| — | Neumáticos para móviles municipales | (real, monto estimado) |
| — | Sistema GPS flota vehicular | (real, monto estimado) |
| — | Dron para Dirección de Seguridad Pública | (real, monto estimado) |
| — | 4 campanas reciclaje vidrio DIMAO | (real, monto estimado) |
| — | Licenciamiento software municipal | (real, monto estimado) |

> **Nota sobre proveedores:** los nombres de empresas usados en
> `proveedor` son ilustrativos genéricos. No se han atribuido
> licitaciones a empresas específicas reales para no generar
> información incorrecta sobre adjudicaciones.

## Lo que NO está verificado y por qué

- **Distribución presupuestaria por dirección administrativa.** SINIM
  reporta totales por sector (Educación, Salud, Aseo, etc.) y por
  subtítulo presupuestario, pero no por dirección. La distribución
  detallada en el seed es plausible pero estimada.
- **Nombres específicos de proveedores adjudicados.** No se consultaron
  los actos de adjudicación en Mercado Público para cada licitación, por
  lo que se usaron nombres comerciales genéricos en su lugar.
- **Montos individuales de algunos contratos.** Donde no se obtuvo el
  monto adjudicado real, se usaron estimaciones de magnitud razonable
  según el tipo de licitación (L1, LE, LR).

## Enlaces de verificación

- Ficha comunal SINIM: https://datos.sinim.gov.cl/impresion_ficha_comunal.php?municipio=05606
- Direcciones municipales: https://santodomingo.cl/direcciones/
- Sitio web oficial: https://santodomingo.cl
- Mercado Público (búsqueda por RUT 69.073.500-8): https://www.mercadopublico.cl
- Resultados electorales 2024: https://www.meganoticias.cl/elecciones-chile/elecciones-municipales/santo-domingo/
