// GestionGuias.tsx
// -----------------
// CRUD completo para guías vinculados a una localidad.
// Uso:
//   <GestionGuias localidadId="loc_123" currentUser={{id:'u1',name:'Admin'}} />
//
// Persistencia: localStorage con clave `localidad:<id>:guias`
// Auditar: escribe entradas en `localidad:<id>:history` (mismo formato que HistorialCambios)

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, Trash2, Plus, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HistorialCambios, { HistEntry } from "./HistorialCambios";

type User = { id: string; name: string } | null;

export type Guia = {
  id: string;
  nombre: string;
  telefono?: string;
  idioma?: string;
  experiencia?: number;
  notas?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const guiasKey = (localidadId: string) => `localidad:${localidadId}:guias`;
const historyKey = (localidadId: string) => `localidad:${localidadId}:history`;

function readGuias(localidadId: string): Guia[] {
  try {
    const raw = localStorage.getItem(guiasKey(localidadId));
    return raw ? (JSON.parse(raw) as Guia[]) : [];
  } catch { return []; }
}
function writeGuias(localidadId: string, data: Guia[]) {
  try { localStorage.setItem(guiasKey(localidadId), JSON.stringify(data)); } catch {}
}
function pushHistory(localidadId: string, entry: Omit<HistEntry, "ts"> & { ts?: string }) {
  try {
    const currentRaw = localStorage.getItem(historyKey(localidadId));
    const current = currentRaw ? (JSON.parse(currentRaw) as HistEntry[]) : [];
    const e: HistEntry = { ts: entry.ts ?? new Date().toISOString(), user: entry.user ?? null, action: entry.action, detail: entry.detail };
    localStorage.setItem(historyKey(localidadId), JSON.stringify([e, ...current].slice(0, 1000)));
  } catch {}
}

type Props = {
  currentUser?: User;
  role?: "admin" | "editor" | "viewer";
};

export default function GestionGuias({ currentUser = null, role = "admin" }: Omit<Props, 'localidadId'>) {
  const { localidadId } = useParams<{ localidadId: string }>();
  const navigate = useNavigate();
  const [guias, setGuias] = useState<Guia[]>([]);
  const [editing, setEditing] = useState<Guia | null>(null);
  const [filter, setFilter] = useState("");
  const [alert, setAlert] = useState<{ type: "info" | "success" | "error"; text: string } | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Cargar guías cuando localidadId esté disponible
  useEffect(() => {
    if (localidadId) {
      setGuias(readGuias(localidadId));
    }
  }, [localidadId]);

  useEffect(() => {
    if (localidadId) {
      writeGuias(localidadId, guias);
    }
  }, [localidadId, guias]);

  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3500);
    return () => clearTimeout(t);
  }, [alert]);

  const { register, handleSubmit, reset, formState } = useForm<Partial<Guia>>({ mode: "onChange" });

  useEffect(() => {
    if (editing) reset(editing);
    else reset({ nombre: "", telefono: "", idioma: "", experiencia: 0, notas: "", activo: true });
  }, [editing, reset]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return guias;
    return guias.filter(g => (g.nombre ?? "").toLowerCase().includes(q) || (g.idioma ?? "").toLowerCase().includes(q));
  }, [guias, filter]);

  const paginated = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  function addGuia(payload: Omit<Guia, "id" | "createdAt" | "updatedAt">) {
    if (!localidadId) return;
    const g: Guia = { ...payload, id: `g_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setGuias(prev => [g, ...prev]);
    pushHistory(localidadId, { user: currentUser ?? null, action: `Crear guía: ${g.nombre}`, detail: JSON.stringify(g) });
    setAlert({ type: "success", text: "Guía agregada correctamente." });
  }

  function updateGuia(id: string, patch: Partial<Guia>) {
    if (!localidadId) return;
    const before = guias.find(x => x.id === id) ?? null;
    setGuias(prev => prev.map(x => x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x));
    const after = { ...(before ?? {}), ...patch };
    pushHistory(localidadId, { user: currentUser ?? null, action: `Actualizar guía: ${after.nombre ?? id}`, detail: JSON.stringify({ before, after }) });
    setAlert({ type: "success", text: "Guía actualizada." });
  }

  function removeGuia(id: string) {
    if (!localidadId) return;
    if (role !== "admin") { setAlert({ type: "error", text: "Permiso denegado: eliminar guía." }); return; }
    if (!confirm("¿Seguro que quieres eliminar esta guía? Esta acción no se puede deshacer.")) return;
    const before = guias.find(x => x.id === id) ?? null;
    setGuias(prev => prev.filter(x => x.id !== id));
    pushHistory(localidadId, { user: currentUser ?? null, action: `Eliminar guía: ${before?.nombre ?? id}`, detail: JSON.stringify(before) });
    setAlert({ type: "info", text: "Guía eliminada." });
  }

  function onSubmit(data: Partial<Guia>) {
    if (!data.nombre || !data.nombre.trim()) { setAlert({ type: "error", text: "El nombre es obligatorio." }); return; }
    if (editing) { updateGuia(editing.id, data); setEditing(null); }
    else addGuia(data as Omit<Guia, "id">);
    reset();
  }

  function exportCsv() {
    const rows = guias.map(g => ({ id: g.id, nombre: g.nombre, telefono: g.telefono ?? "", idioma: g.idioma ?? "", experiencia: g.experiencia ?? "" }));
    if (rows.length === 0) { setAlert({ type: "info", text: "No hay guías para exportar." }); return; }
    const header = Object.keys(rows[0]).join(",");
    const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const csv = [header, body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `guias_${localidadId}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // Manejo de localidadId no disponible
  if (!localidadId) {
    return (
      <Alert className="border-red-300 bg-red-50">
        <AlertDescription>
          Error: ID de localidad no encontrado en la URL.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Gestión de Guías
          </h1>
          <p className="text-gray-600 text-sm">
            Localidad: {localidadId}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/admin")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      <div className="space-y-4">
        {alert && (
        <Alert className={`border-l-4 ${alert.type === "success" ? "border-green-400 bg-green-50" : alert.type === "info" ? "border-blue-400 bg-blue-50" : "border-red-400 bg-red-50"}`}>
          <AlertDescription>{alert.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Editar guía" : "Nuevo guía"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }} className="space-y-3" aria-label="Formulario de guía">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <Input {...register("nombre")} aria-required />
              </div>

              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <Input {...register("telefono")} />
              </div>

              <div>
                <label className="block text-sm font-medium">Idioma</label>
                <Input {...register("idioma")} />
              </div>

              <div>
                <label className="block text-sm font-medium">Años experiencia</label>
                <Input type="number" {...register("experiencia", { valueAsNumber: true })} />
              </div>

              <div>
                <label className="block text-sm font-medium">Notas</label>
                <Textarea {...register("notas")} rows={3} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" aria-label="Guardar guía">
                  <Plus className="w-4 h-4 mr-2" /> {editing ? "Guardar" : "Agregar"}
                </Button>
                {editing && <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>}
                <Button type="button" variant="outline" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Exportar</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Guías ({guias.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <input aria-label="Filtrar guías" placeholder="Filtrar por nombre o idioma" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="p-2 border rounded w-full md:w-1/2" />
              <div className="flex items-center gap-2 ml-3">
                <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))}>◀</Button>
                <div className="text-sm">P {page}</div>
                <Button variant="outline" onClick={() => setPage(p => p + 1)}>▶</Button>
              </div>
            </div>

            {paginated.length === 0 ? <div className="text-sm text-gray-600">Sin resultados</div> : (
              <div className="space-y-2">
                {paginated.map(g => (
                  <div key={g.id} className="border rounded p-3 flex justify-between items-start">
                    <div>
                      <div className="font-medium">{g.nombre} {g.activo === false && <span className="text-xs text-red-500">(inactivo)</span>}</div>
                      <div className="text-sm text-gray-600">{g.idioma ? `Idioma: ${g.idioma}` : "Sin idioma"} · {g.telefono ?? "Sin teléfono"}</div>
                      {g.notas && <div className="text-sm mt-2 text-gray-700">{g.notas}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setEditing(g)} aria-label={`Editar ${g.nombre}`}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="destructive" onClick={() => removeGuia(g.id)} aria-label={`Eliminar ${g.nombre}`}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

        {/* Auditoría (historial) */}
        <div>
          <HistorialCambios />
        </div>
      </div>
    </div>
  );
}
