import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Users, CalendarCheck, Clock } from "lucide-react";

import FormularioLocalidad from "../components/forms/AddLocalidadForm";
import GestionGuias from "../components/localidad/GestionGuias"; // Componente para agregar/editar guías y horarios
import HistorialCambios from "../components/localidad/HistorialCambios";

interface Props {
  localidadId: string;
}

export default function CardLocalidadRow({ localidadId }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Card 1: Información general */}
      <Card className="flex-1 border-l-4 border-green-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-green-700 font-semibold">
            Información general
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioLocalidad />
        </CardContent>
      </Card>

      {/* Card 2: Guías */}
      <Card className="flex-1 border-l-4 border-sky-400 shadow-md">
        <CardHeader>
          <CardTitle className="text-sky-700 font-semibold">Guías</CardTitle>
        </CardHeader>
        <CardContent>
          <GestionGuias localidadId={localidadId} />
        </CardContent>
      </Card>

      {/* Card 3: Historial */}
      <Card className="flex-1 border-l-4 border-yellow-400 shadow-md">
        <CardHeader>
          <CardTitle className="text-yellow-700 font-semibold">
            Historial de cambios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HistorialCambios localidadId={localidadId} />
        </CardContent>
      </Card>
    </div>
  );
}
