-- Índices para optimización de consultas (EF4)
-- Aceleran los JOIN por clave foránea y el ordenamiento de contratos por fecha.

-- CreateIndex
CREATE INDEX "Presupuesto_departamentoId_idx" ON "Presupuesto"("departamentoId");

-- CreateIndex
CREATE INDEX "Presupuesto_ano_idx" ON "Presupuesto"("ano");

-- CreateIndex
CREATE INDEX "Contrato_departamentoId_idx" ON "Contrato"("departamentoId");

-- CreateIndex
CREATE INDEX "Contrato_fechaInicio_idx" ON "Contrato"("fechaInicio");
