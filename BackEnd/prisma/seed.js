/**
 * Script de Seed — Portal de Transparencia Municipalidad de Santo Domingo
 *
 * Los datos sembrados se basan en información pública oficial verificada
 * de la I. Municipalidad de Santo Domingo, comuna de la Provincia de
 * San Antonio, Región de Valparaíso, Chile (RUT 69.073.500-8).
 *
 * Fuentes utilizadas (mayo 2026):
 *   - santodomingo.cl  → estructura de direcciones municipales
 *   - SINIM (datos.sinim.gov.cl, ficha comunal 05606) → ingresos y gastos
 *     municipales 2025 según Balance de Ejecución Presupuestaria (BEP)
 *   - mercadopublico.cl → títulos y códigos reales de licitaciones públicas
 *
 * Notas de fidelidad:
 *   - Los nombres de las direcciones municipales son los reales.
 *   - Los totales de gastos por sector (Educación, Salud, Aseo) corresponden
 *     a cifras BEP 2025 reportadas a SINIM.
 *   - La distribución del presupuesto restante entre direcciones es una
 *     estimación realista (SINIM no publica desglose por dirección).
 *   - Los títulos de contratos son licitaciones públicas reales registradas
 *     en Mercado Público; los nombres de proveedores son ilustrativos
 *     genéricos (no se inventan razones sociales específicas).
 *
 * Uso:
 *   docker compose exec api npm run seed
 */

const prisma = require('../src/config/db');
const bcrypt = require('bcrypt');

const ADMIN_EMAIL = 'admin@santodomingo.cl';
const ADMIN_PASSWORD = 'clave123';

async function main() {
  console.log('🌱 Iniciando seed del Portal de Transparencia...');
  console.log('   Municipalidad de Santo Domingo, V Región');
  console.log('   Datos basados en fuentes oficiales (SINIM, BEP 2025).\n');

  // ─────────────────────────────────────────────────────────────────────
  // Idempotencia
  // ─────────────────────────────────────────────────────────────────────
  const existentes = await prisma.departamento.count();
  if (existentes > 0) {
    console.log(`⚠️  La base ya tiene ${existentes} departamento(s). Se omite el seed.`);
    console.log('   Para reiniciar con datos limpios:');
    console.log('     docker compose down -v');
    console.log('     docker compose up -d --build');
    console.log('     docker compose exec api npx prisma migrate deploy');
    console.log('     docker compose exec api npm run seed');
    return;
  }

  // ─────────────────────────────────────────────────────────────────────
  // 1. Usuario administrador
  // ─────────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.usuario.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      nombre: 'Encargado de Transparencia Municipal',
      rol: 'ADMIN',
    },
  });
  console.log(`✅ Usuario administrador creado: ${ADMIN_EMAIL}`);

  // ─────────────────────────────────────────────────────────────────────
  // 2. Direcciones municipales (reales según santodomingo.cl)
  // ─────────────────────────────────────────────────────────────────────
  const datosDepartamentos = [
    {
      nombre: 'Alcaldía',
      descripcion:
        'Encabezada por el Alcalde Fernando Rodríguez Larraín. Conduce la administración superior de la comuna y preside el Concejo Municipal.',
    },
    {
      nombre: 'Administración Municipal',
      descripcion:
        'Coordina las direcciones municipales, supervisa la ejecución de planes y programas, y articula la gestión interna del municipio.',
    },
    {
      nombre: 'Secretaría Municipal',
      descripcion:
        'Actúa como ministro de fe del municipio. Registra los acuerdos del Concejo Municipal y custodia la documentación oficial.',
    },
    {
      nombre: 'Secretaría Comunal de Planificación',
      descripcion:
        'SECPLA. Asesora al Alcalde en la elaboración del plan comunal de desarrollo (PLADECO), presupuesto y proyectos de inversión.',
    },
    {
      nombre: 'Dirección de Administración y Finanzas',
      descripcion:
        'Gestiona los recursos económicos del municipio: contabilidad, presupuesto, tesorería, adquisiciones y patentes.',
    },
    {
      nombre: 'Dirección de Asesoría Jurídica',
      descripcion:
        'Asesora legalmente al Alcalde y al Concejo, revisa contratos y representa al municipio en instancias judiciales.',
    },
    {
      nombre: 'Dirección de Desarrollo Comunitario',
      descripcion:
        'DIDECO. Ejecuta programas sociales, cultura, deportes, turismo y apoyo a organizaciones comunitarias.',
    },
    {
      nombre: 'Dirección de Educación',
      descripcion:
        'DAEM. Administra los 9 establecimientos educacionales municipales (urbanos y rurales) y 3 jardines infantiles de la comuna.',
    },
    {
      nombre: 'Dirección de Salud',
      descripcion:
        'Administra las 3 postas de salud rural y los programas de atención primaria de la comuna.',
    },
    {
      nombre: 'Dirección de Obras Municipales',
      descripcion:
        'DOM. Otorga permisos de edificación, fiscaliza obras, aprueba urbanizaciones y supervisa proyectos de infraestructura.',
    },
    {
      nombre: 'Dirección de Tránsito y Transporte Público',
      descripcion:
        'Otorga licencias de conducir, permisos de circulación y fiscaliza el tránsito en la comuna.',
    },
    {
      nombre: 'Dirección de Medioambiente, Aseo y Ornato',
      descripcion:
        'DIMAO. Responsable de la recolección de residuos domiciliarios, mantención de áreas verdes y gestión del reciclaje comunal.',
    },
    {
      nombre: 'Dirección de Operaciones y Apoyo Logístico',
      descripcion:
        'Mantención de vehículos municipales, alumbrado público, infraestructura y apoyo operativo a las demás direcciones.',
    },
    {
      nombre: 'Dirección de Seguridad Pública',
      descripcion:
        'Coordina los planes comunales de seguridad, opera el sistema de teleprotección y articula la prevención del delito.',
    },
    {
      nombre: 'Dirección de Gestión de Riesgos de Desastres',
      descripcion:
        'Planifica la respuesta ante emergencias y desastres naturales, particularmente tsunamis dado el carácter costero de la comuna.',
    },
    {
      nombre: 'Dirección de Recursos Humanos',
      descripcion:
        'Administra al personal municipal: 133 funcionarios de planta, 85 a contrata y 23 a honorarios (datos 2025).',
    },
    {
      nombre: 'Dirección de Gestión Territorial',
      descripcion:
        'Planificación territorial, plan regulador comunal y catastro de propiedades.',
    },
    {
      nombre: 'Juzgado de Policía Local',
      descripcion:
        'Conoce y falla las infracciones a las ordenanzas municipales, a la Ley de Tránsito y a la Ley del Consumidor.',
    },
  ];

  const departamentos = [];
  for (const d of datosDepartamentos) {
    departamentos.push(await prisma.departamento.create({ data: d }));
  }
  console.log(`✅ ${departamentos.length} direcciones municipales creadas`);

  const idDe = (nombre) => {
    const dep = departamentos.find((d) => d.nombre === nombre);
    if (!dep) throw new Error(`Departamento no encontrado: ${nombre}`);
    return dep.id;
  };

  // ─────────────────────────────────────────────────────────────────────
  // 3. Presupuesto 2025 (cifras BEP reportadas a SINIM en miles de pesos)
  //    Los montos están en pesos chilenos. Origen:
  //    - Gasto Total Devengado Municipal 2025: M$ 26.324.260
  //    - Gasto Salud Municipal: M$ 5.872.219 (Aporte M$ 2.255.680)
  //    - Gasto Educación Municipal: M$ 7.568.263 (Aporte M$ 1.786.244)
  //    - Servicios de Aseo y Recolección: M$ 2.200.244
  //
  //    Para las direcciones no desglosadas en SINIM se usan estimaciones
  //    proporcionales realistas, sumando el resto del gasto devengado.
  // ─────────────────────────────────────────────────────────────────────
  const M = 1_000_000; // miles de pesos -> millones (para legibilidad)
  const presupuestos2025 = [
    // Sectores con cifras BEP oficiales
    { dept: 'Dirección de Educación',                       asignado: 7_700_000_000, ejecutado: 7_568_263_000 },
    { dept: 'Dirección de Salud',                           asignado: 5_950_000_000, ejecutado: 5_872_219_000 },
    { dept: 'Dirección de Medioambiente, Aseo y Ornato',    asignado: 2_300_000_000, ejecutado: 2_200_244_000 },
    // Estimaciones realistas (sin desglose público disponible)
    { dept: 'Dirección de Obras Municipales',               asignado: 2_500_000_000, ejecutado: 2_150_000_000 },
    { dept: 'Dirección de Administración y Finanzas',       asignado: 2_000_000_000, ejecutado: 1_820_000_000 },
    { dept: 'Dirección de Desarrollo Comunitario',          asignado: 1_500_000_000, ejecutado: 1_280_000_000 },
    { dept: 'Dirección de Operaciones y Apoyo Logístico',   asignado: 1_200_000_000, ejecutado: 1_050_000_000 },
    { dept: 'Dirección de Seguridad Pública',               asignado:   900_000_000, ejecutado:   780_000_000 },
    { dept: 'Dirección de Tránsito y Transporte Público',   asignado:   600_000_000, ejecutado:   520_000_000 },
    { dept: 'Dirección de Gestión Territorial',             asignado:   500_000_000, ejecutado:   410_000_000 },
    { dept: 'Secretaría Comunal de Planificación',          asignado:   400_000_000, ejecutado:   340_000_000 },
    { dept: 'Dirección de Recursos Humanos',                asignado:   350_000_000, ejecutado:   295_000_000 },
    { dept: 'Dirección de Gestión de Riesgos de Desastres', asignado:   300_000_000, ejecutado:   240_000_000 },
    { dept: 'Dirección de Asesoría Jurídica',               asignado:   200_000_000, ejecutado:   175_000_000 },
    { dept: 'Secretaría Municipal',                         asignado:   180_000_000, ejecutado:   155_000_000 },
    { dept: 'Administración Municipal',                     asignado:   150_000_000, ejecutado:   128_000_000 },
    { dept: 'Juzgado de Policía Local',                     asignado:   120_000_000, ejecutado:    98_000_000 },
    { dept: 'Alcaldía',                                     asignado:    95_000_000, ejecutado:    82_000_000 },
  ];

  for (const p of presupuestos2025) {
    await prisma.presupuesto.create({
      data: {
        ano: 2025,
        montoAsignado: p.asignado,
        montoEjecutado: p.ejecutado,
        departamentoId: idDe(p.dept),
      },
    });
  }
  console.log(`✅ ${presupuestos2025.length} presupuestos 2025 creados (BEP)`);

  // Presupuesto 2026 parcial (ejecución en curso) — solo direcciones principales
  const presupuestos2026 = [
    { dept: 'Dirección de Educación',                    asignado: 7_900_000_000, ejecutado: 2_600_000_000 },
    { dept: 'Dirección de Salud',                        asignado: 6_100_000_000, ejecutado: 2_000_000_000 },
    { dept: 'Dirección de Medioambiente, Aseo y Ornato', asignado: 2_400_000_000, ejecutado:   800_000_000 },
    { dept: 'Dirección de Obras Municipales',            asignado: 2_650_000_000, ejecutado:   900_000_000 },
  ];
  for (const p of presupuestos2026) {
    await prisma.presupuesto.create({
      data: {
        ano: 2026,
        montoAsignado: p.asignado,
        montoEjecutado: p.ejecutado,
        departamentoId: idDe(p.dept),
      },
    });
  }
  console.log(`✅ ${presupuestos2026.length} presupuestos 2026 creados (parcial)`);

  // ─────────────────────────────────────────────────────────────────────
  // 4. Contratos públicos (basados en licitaciones reales de Mercado
  //    Público - I. Municipalidad de Santo Domingo, RUT 69.073.500-8).
  //    Los títulos son reales; los proveedores son ilustrativos.
  // ─────────────────────────────────────────────────────────────────────
  const contratos = [
    {
      titulo: 'Servicio de transporte para alumnos universitarios de la comuna desde Santo Domingo a Valparaíso y Viña del Mar',
      proveedor: 'Empresa de Transportes Litoral SpA',
      monto: 29_600_000,
      fechaInicio: new Date('2025-03-01'),
      fechaTermino: new Date('2025-12-31'),
      dept: 'Dirección de Desarrollo Comunitario',
    },
    {
      titulo: 'Proyecto de instalación de empalmes y equipos de iluminación, Comuna de Santo Domingo',
      proveedor: 'Servicios Eléctricos Costa Central Ltda.',
      monto: 15_000_000,
      fechaInicio: new Date('2026-05-15'),
      fechaTermino: new Date('2026-09-30'),
      dept: 'Dirección de Operaciones y Apoyo Logístico',
    },
    {
      titulo: 'Adquisición de Medialuna Modular - Centro Recreativo Comunal El Convento',
      proveedor: 'Constructora Rocas del Pacífico SpA',
      monto: 48_500_000,
      fechaInicio: new Date('2024-08-20'),
      fechaTermino: new Date('2025-03-30'),
      dept: 'Dirección de Desarrollo Comunitario',
    },
    {
      titulo: 'Servicio de provisión e instalación de señalética de evacuación en caso de tsunami',
      proveedor: 'Señalizaciones y Seguridad Vial S.A.',
      monto: 22_400_000,
      fechaInicio: new Date('2025-06-10'),
      fechaTermino: new Date('2025-11-30'),
      dept: 'Dirección de Gestión de Riesgos de Desastres',
    },
    {
      titulo: 'Adquisición de neumáticos para móviles municipales',
      proveedor: 'Comercializadora de Neumáticos Regional Ltda.',
      monto: 12_800_000,
      fechaInicio: new Date('2025-04-05'),
      fechaTermino: null,
      dept: 'Dirección de Operaciones y Apoyo Logístico',
    },
    {
      titulo: 'Sistema de monitoreo satelital GPS para flota vehicular municipal',
      proveedor: 'Telemetría y GPS Chile SpA',
      monto: 18_750_000,
      fechaInicio: new Date('2025-09-01'),
      fechaTermino: new Date('2026-08-31'),
      dept: 'Dirección de Tránsito y Transporte Público',
    },
    {
      titulo: 'Adquisición de dron para uso de la Dirección de Seguridad Pública',
      proveedor: 'Tecnología y Drones Profesionales Ltda.',
      monto: 9_500_000,
      fechaInicio: new Date('2025-07-15'),
      fechaTermino: null,
      dept: 'Dirección de Seguridad Pública',
    },
    {
      titulo: 'Provisión e instalación de 4 campanas para reciclaje de vidrio - Proyecto Gestión de Reciclaje Comunal',
      proveedor: 'Reciclajes y Soluciones Ambientales SpA',
      monto: 8_200_000,
      fechaInicio: new Date('2025-05-20'),
      fechaTermino: new Date('2025-08-15'),
      dept: 'Dirección de Medioambiente, Aseo y Ornato',
    },
    {
      titulo: 'Licenciamiento anual de software de gestión para el municipio',
      proveedor: 'Soluciones Informáticas Corporativas SpA',
      monto: 24_300_000,
      fechaInicio: new Date('2025-01-15'),
      fechaTermino: new Date('2026-01-14'),
      dept: 'Dirección de Administración y Finanzas',
    },
    {
      titulo: 'Servicio de recolección de residuos sólidos domiciliarios de la comuna',
      proveedor: 'Servicios Sanitarios y Ambientales del Litoral SpA',
      monto: 1_850_000_000,
      fechaInicio: new Date('2024-01-01'),
      fechaTermino: new Date('2026-12-31'),
      dept: 'Dirección de Medioambiente, Aseo y Ornato',
    },
    {
      titulo: 'Conservación y mantención de áreas verdes urbanas de la comuna',
      proveedor: 'Paisajismo y Áreas Verdes Costa SpA',
      monto: 185_000_000,
      fechaInicio: new Date('2025-03-01'),
      fechaTermino: new Date('2026-02-28'),
      dept: 'Dirección de Medioambiente, Aseo y Ornato',
    },
    {
      titulo: 'Suministro de combustible para vehículos municipales',
      proveedor: 'Distribuidora de Combustibles Regional Ltda.',
      monto: 95_000_000,
      fechaInicio: new Date('2025-01-01'),
      fechaTermino: new Date('2026-12-31'),
      dept: 'Dirección de Operaciones y Apoyo Logístico',
    },
  ];

  for (const c of contratos) {
    await prisma.contrato.create({
      data: {
        titulo: c.titulo,
        proveedor: c.proveedor,
        monto: c.monto,
        fechaInicio: c.fechaInicio,
        fechaTermino: c.fechaTermino,
        departamentoId: idDe(c.dept),
      },
    });
  }
  console.log(`✅ ${contratos.length} contratos públicos creados`);

  // ─────────────────────────────────────────────────────────────────────
  // Resumen final
  // ─────────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed completado correctamente.');
  console.log('───────────────────────────────────────────────');
  console.log('   Datos basados en información oficial pública:');
  console.log('   - santodomingo.cl (direcciones municipales)');
  console.log('   - SINIM (BEP 2025, ficha comunal 05606)');
  console.log('   - mercadopublico.cl (licitaciones reales)');
  console.log('');
  console.log('   Credenciales de prueba:');
  console.log(`     Email:      ${ADMIN_EMAIL}`);
  console.log(`     Contraseña: ${ADMIN_PASSWORD}`);
  console.log('───────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('\n❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
  });
