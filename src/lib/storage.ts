import { HistEntry } from "@/components/localidad/HistorialCambios";

export const readGuias = (localidadId: string): Guia[] => { ... };
export const writeGuias = (localidadId: string, data: Guia[]) => { ... };
export const readHistory = (localidadId: string): HistEntry[] => { ... };
export const writeHistory = (localidadId: string, items: HistEntry[]) => { ... };
