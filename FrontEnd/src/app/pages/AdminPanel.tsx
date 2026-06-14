import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  LogOut,
  Briefcase,
  Wallet,
  FileSignature,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  publicApi,
  adminApi,
  ApiError,
  type Departamento,
  type Presupuesto,
  type Contrato,
} from "../../utils/api";
import { isAuthenticated, getUserInfo, logout } from "../../utils/auth";

type Tab = "departamentos" | "presupuestos" | "contratos";
type Feedback = { type: "success" | "error"; text: string } | null;

const formatCLP = (amount: number | string) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(
    Number(amount)
  );

export default function AdminPanel() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("departamentos");
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const user = getUserInfo();

  // Mensajes temporales (auto-ocultar)
  const notify = useCallback((f: Feedback) => {
    setFeedback(f);
    if (f) setTimeout(() => setFeedback(null), 5000);
  }, []);

  /** Carga todos los datos desde la API. */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [deps, pres, cons] = await Promise.all([
        publicApi.getDepartamentos(),
        publicApi.getPresupuestos(),
        publicApi.getContratos(),
      ]);
      setDepartamentos(deps);
      setPresupuestos(pres);
      setContratos(cons);
    } catch (err) {
      notify({
        type: "error",
        text:
          err instanceof ApiError
            ? err.message
            : "Error al cargar los datos del portal",
      });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  // Protección de ruta: requiere sesión activa
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate, loadData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#1e40af]" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600">
                  {user
                    ? `Sesión: ${user.nombre} (${user.rol})`
                    : "Funcionario Municipal"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback global */}
        {feedback && (
          <div
            className={`mb-6 rounded-md p-4 flex items-center gap-3 border ${
              feedback.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                feedback.type === "success"
                  ? "text-green-800"
                  : "text-red-700"
              }`}
            >
              {feedback.text}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton
            active={tab === "departamentos"}
            onClick={() => setTab("departamentos")}
            icon={<Briefcase className="w-4 h-4" />}
            label={`Departamentos (${departamentos.length})`}
          />
          <TabButton
            active={tab === "presupuestos"}
            onClick={() => setTab("presupuestos")}
            icon={<Wallet className="w-4 h-4" />}
            label={`Presupuestos (${presupuestos.length})`}
          />
          <TabButton
            active={tab === "contratos"}
            onClick={() => setTab("contratos")}
            icon={<FileSignature className="w-4 h-4" />}
            label={`Contratos (${contratos.length})`}
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando datos desde la API...
          </div>
        ) : (
          <>
            {tab === "departamentos" && (
              <DepartamentosTab
                departamentos={departamentos}
                onChanged={loadData}
                notify={notify}
              />
            )}
            {tab === "presupuestos" && (
              <PresupuestosTab
                presupuestos={presupuestos}
                departamentos={departamentos}
                onChanged={loadData}
                notify={notify}
              />
            )}
            {tab === "contratos" && (
              <ContratosTab
                contratos={contratos}
                departamentos={departamentos}
                onChanged={loadData}
                notify={notify}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- UI base -------------------------------- */

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-[#1e40af] text-white"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent";

/* ----------------------------- Departamentos ------------------------------ */

function DepartamentosTab({
  departamentos,
  onChanged,
  notify,
}: {
  departamentos: Departamento[];
  onChanged: () => Promise<void>;
  notify: (f: Feedback) => void;
}) {
  const empty = { nombre: "", descripcion: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (d: Departamento) => {
    setEditingId(d.id);
    setForm({ nombre: d.nombre, descripcion: d.descripcion ?? "" });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(empty);
  };

  const submit = async () => {
    if (!form.nombre.trim()) {
      notify({ type: "error", text: "El nombre del departamento es obligatorio" });
      return;
    }
    setSaving(true);
    try {
      const body = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
      };
      if (editingId) {
        await adminApi.actualizarDepartamento(editingId, body);
        notify({ type: "success", text: "Departamento actualizado correctamente" });
      } else {
        await adminApi.crearDepartamento(body);
        notify({ type: "success", text: "Departamento creado correctamente" });
      }
      cancel();
      await onChanged();
    } catch (err) {
      notify({
        type: "error",
        text: err instanceof ApiError ? err.message : "Error al guardar",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingId ? "Editar departamento" : "Nuevo departamento"}
          </h2>
          <div className="space-y-4">
            <Field label="Nombre *">
              <input
                className={inputClass}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Dirección de Obras Municipales"
              />
            </Field>
            <Field label="Descripción">
              <textarea
                className={inputClass}
                rows={3}
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                placeholder="Funciones del departamento"
              />
            </Field>
            <div className="flex gap-2">
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 bg-[#1e40af] text-white py-2 rounded-md hover:bg-[#1e3a8a] transition-colors font-medium disabled:opacity-50"
              >
                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
              </button>
              {editingId && (
                <button
                  onClick={cancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listado */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Descripción
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departamentos.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No hay departamentos registrados.
                  </td>
                </tr>
              )}
              {departamentos.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {d.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {d.descripcion || "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(d)}
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Presupuestos ------------------------------ */

function PresupuestosTab({
  presupuestos,
  departamentos,
  onChanged,
  notify,
}: {
  presupuestos: Presupuesto[];
  departamentos: Departamento[];
  onChanged: () => Promise<void>;
  notify: (f: Feedback) => void;
}) {
  const empty = {
    ano: new Date().getFullYear().toString(),
    montoAsignado: "",
    montoEjecutado: "",
    departamentoId: "",
  };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (p: Presupuesto) => {
    setEditingId(p.id);
    setForm({
      ano: String(p.ano),
      montoAsignado: String(p.montoAsignado),
      montoEjecutado: String(p.montoEjecutado),
      departamentoId: String(p.departamentoId),
    });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(empty);
  };

  const submit = async () => {
    const ano = parseInt(form.ano, 10);
    const montoAsignado = parseFloat(form.montoAsignado);
    const departamentoId = parseInt(form.departamentoId, 10);

    if (!ano || isNaN(montoAsignado)) {
      notify({ type: "error", text: "Año y monto asignado son obligatorios" });
      return;
    }
    if (!editingId && !departamentoId) {
      notify({ type: "error", text: "Debe seleccionar un departamento" });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await adminApi.actualizarPresupuesto(editingId, {
          ano,
          montoAsignado,
          montoEjecutado: parseFloat(form.montoEjecutado) || 0,
        });
        notify({ type: "success", text: "Presupuesto actualizado correctamente" });
      } else {
        await adminApi.crearPresupuesto({ ano, montoAsignado, departamentoId });
        notify({ type: "success", text: "Presupuesto creado correctamente" });
      }
      cancel();
      await onChanged();
    } catch (err) {
      notify({
        type: "error",
        text: err instanceof ApiError ? err.message : "Error al guardar",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingId ? "Editar presupuesto" : "Nuevo presupuesto"}
          </h2>
          <div className="space-y-4">
            <Field label="Departamento *">
              <select
                className={inputClass}
                value={form.departamentoId}
                disabled={!!editingId}
                onChange={(e) =>
                  setForm({ ...form, departamentoId: e.target.value })
                }
              >
                <option value="">Seleccione...</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Año *">
              <input
                type="number"
                className={inputClass}
                value={form.ano}
                onChange={(e) => setForm({ ...form, ano: e.target.value })}
              />
            </Field>
            <Field label="Monto asignado (CLP) *">
              <input
                type="number"
                className={inputClass}
                value={form.montoAsignado}
                onChange={(e) =>
                  setForm({ ...form, montoAsignado: e.target.value })
                }
                placeholder="100000000"
              />
            </Field>
            {editingId && (
              <Field label="Monto ejecutado (CLP)">
                <input
                  type="number"
                  className={inputClass}
                  value={form.montoEjecutado}
                  onChange={(e) =>
                    setForm({ ...form, montoEjecutado: e.target.value })
                  }
                />
              </Field>
            )}
            <div className="flex gap-2">
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 bg-[#1e40af] text-white py-2 rounded-md hover:bg-[#1e3a8a] transition-colors font-medium disabled:opacity-50"
              >
                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
              </button>
              {editingId && (
                <button
                  onClick={cancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listado */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Año
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Asignado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ejecutado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {presupuestos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                      No hay presupuestos registrados.
                    </td>
                  </tr>
                )}
                {presupuestos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {p.departamento?.nombre || `#${p.departamentoId}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.ano}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {formatCLP(p.montoAsignado)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                      {formatCLP(p.montoEjecutado)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Contratos ------------------------------- */

function ContratosTab({
  contratos,
  departamentos,
  onChanged,
  notify,
}: {
  contratos: Contrato[];
  departamentos: Departamento[];
  onChanged: () => Promise<void>;
  notify: (f: Feedback) => void;
}) {
  const empty = {
    titulo: "",
    proveedor: "",
    monto: "",
    fechaInicio: "",
    fechaTermino: "",
    departamentoId: "",
  };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (c: Contrato) => {
    setEditingId(c.id);
    setForm({
      titulo: c.titulo,
      proveedor: c.proveedor,
      monto: String(c.monto),
      fechaInicio: c.fechaInicio ? c.fechaInicio.slice(0, 10) : "",
      fechaTermino: c.fechaTermino ? c.fechaTermino.slice(0, 10) : "",
      departamentoId: String(c.departamentoId),
    });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(empty);
  };

  const submit = async () => {
    const monto = parseFloat(form.monto);
    const departamentoId = parseInt(form.departamentoId, 10);

    if (!form.titulo.trim() || !form.proveedor.trim() || isNaN(monto)) {
      notify({
        type: "error",
        text: "Título, proveedor y monto son obligatorios",
      });
      return;
    }
    if (!departamentoId) {
      notify({ type: "error", text: "Debe seleccionar un departamento" });
      return;
    }
    if (!editingId && !form.fechaInicio) {
      notify({ type: "error", text: "La fecha de inicio es obligatoria" });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await adminApi.actualizarContrato(editingId, {
          titulo: form.titulo.trim(),
          proveedor: form.proveedor.trim(),
          monto,
          fechaInicio: form.fechaInicio || undefined,
          fechaTermino: form.fechaTermino || undefined,
          departamentoId,
        });
        notify({ type: "success", text: "Contrato actualizado correctamente" });
      } else {
        await adminApi.crearContrato({
          titulo: form.titulo.trim(),
          proveedor: form.proveedor.trim(),
          monto,
          fechaInicio: form.fechaInicio,
          departamentoId,
        });
        notify({ type: "success", text: "Contrato creado correctamente" });
      }
      cancel();
      await onChanged();
    } catch (err) {
      notify({
        type: "error",
        text: err instanceof ApiError ? err.message : "Error al guardar",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("¿Eliminar este contrato? Esta acción no se puede deshacer."))
      return;
    try {
      await adminApi.eliminarContrato(id);
      notify({ type: "success", text: "Contrato eliminado correctamente" });
      if (editingId === id) cancel();
      await onChanged();
    } catch (err) {
      notify({
        type: "error",
        text: err instanceof ApiError ? err.message : "Error al eliminar",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingId ? "Editar contrato" : "Nuevo contrato"}
          </h2>
          <div className="space-y-4">
            <Field label="Título *">
              <input
                className={inputClass}
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Construcción de plaza comunitaria"
              />
            </Field>
            <Field label="Proveedor *">
              <input
                className={inputClass}
                value={form.proveedor}
                onChange={(e) =>
                  setForm({ ...form, proveedor: e.target.value })
                }
                placeholder="Constructora Ejemplo SpA"
              />
            </Field>
            <Field label="Monto (CLP) *">
              <input
                type="number"
                className={inputClass}
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                placeholder="50000000"
              />
            </Field>
            <Field label="Departamento *">
              <select
                className={inputClass}
                value={form.departamentoId}
                onChange={(e) =>
                  setForm({ ...form, departamentoId: e.target.value })
                }
              >
                <option value="">Seleccione...</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fecha de inicio *">
              <input
                type="date"
                className={inputClass}
                value={form.fechaInicio}
                onChange={(e) =>
                  setForm({ ...form, fechaInicio: e.target.value })
                }
              />
            </Field>
            <Field label="Fecha de término">
              <input
                type="date"
                className={inputClass}
                value={form.fechaTermino}
                onChange={(e) =>
                  setForm({ ...form, fechaTermino: e.target.value })
                }
              />
            </Field>
            <div className="flex gap-2">
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 bg-[#1e40af] text-white py-2 rounded-md hover:bg-[#1e3a8a] transition-colors font-medium disabled:opacity-50"
              >
                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
              </button>
              {editingId && (
                <button
                  onClick={cancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listado */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contratos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                      No hay contratos registrados.
                    </td>
                  </tr>
                )}
                {contratos.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.titulo}
                      <span className="block text-xs text-gray-500">
                        {c.departamento?.nombre || `Depto #${c.departamentoId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.proveedor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {formatCLP(c.monto)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm mr-3"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
