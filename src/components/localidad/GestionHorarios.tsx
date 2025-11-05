import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type HistEntry = {
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

/**
 * HistorialCambios
 * - Props:
 *    - localidadId: string (requerido)
 *    - maxItems?: number (opcional, por defecto 200)
 *
 * Muestra las entradas de historial y permite limpiar.
 */
export default function HistorialCambios({ localidadId, maxItems = 200 }: { localidadId: string; maxItems?: number }) {
  const [items, setItems] = useState<HistEntry[]>([]);

  useEffect(() => {
    setItems(readHistory(localidadId));
  }, [localidadId]);

  const clearAll = () => {
    if (!confirm("¿Borrar historial completo? Esta acción no se puede deshacer.")) return;
    writeHistory(localidadId, []);
    setItems([]);
  };

  return (
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
  );
}
