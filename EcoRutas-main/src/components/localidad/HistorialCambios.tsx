import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Importante
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";

export type HistEntry = {
  ts: string;
  user?: { id: string; name: string };
  action: string;
  detail?: string;
};

const storageKey = (localidadId: string) => `localidad:${localidadId}:history`;

const readHistory = (localidadId: string): HistEntry[] => {
  try {
    const raw = localStorage.getItem(storageKey(localidadId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("readHistory error", e);
    return [];
  }
};

const writeHistory = (localidadId: string, items: HistEntry[]) => {
  try {
    localStorage.setItem(storageKey(localidadId), JSON.stringify(items));
  } catch (e) {
    console.error("writeHistory error", e);
  }
};

export default function HistorialCambios({ maxItems = 200 }: { maxItems?: number }) {
  const { localidadId } = useParams<{ localidadId: string }>(); // ✅ Obtiene el id de la URL
  const navigate = useNavigate();
  const [items, setItems] = useState<HistEntry[]>([]);

  useEffect(() => {
    if (localidadId) {
      setItems(readHistory(localidadId));
    }
  }, [localidadId]);

  const clearAll = () => {
    if (!localidadId) return;
    if (!confirm("¿Borrar historial completo? Esta acción no se puede deshacer.")) return;
    writeHistory(localidadId, []);
    setItems([]);
  };

  if (!localidadId) {
    return <Alert><AlertDescription>ID de localidad no encontrado.</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-yellow-700">
            Historial de Cambios
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

      <Card>
        <CardHeader>
          <CardTitle>Historial de cambios</CardTitle>
        </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Alert>
            <AlertDescription>No hay registros aún.</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-3 max-h-[420px] overflow-auto">
              {items.slice(0, maxItems).map((it, i) => (
                <div key={i} className="border rounded p-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-sm font-medium">{it.user?.name ?? "Sistema"}</div>
                      <div className="text-sm text-gray-700">{it.action}</div>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(it.ts).toLocaleString()}</div>
                  </div>
                  {it.detail && <div className="mt-2 text-sm text-gray-600">{it.detail}</div>}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <Button variant="destructive" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar historial
              </Button>
            </div>
          </>
        )}
      </CardContent>
      </Card>
    </div>
  );
}
