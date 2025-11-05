import { useState, useEffect } from "react";

export type Localidad = {
  nombre: string;
  descripcion: string;
  pais: string;
  ciudad: string;
  coordenadas: string;
  tipo: string;
  accesibilidad: string;
  servicios: string[];
  fechaRegistro: string;
};

const STORAGE_KEY = "localidades";

export const useLocalidades = () => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      setLocalidades(JSON.parse(data));
    }
  }, []);

  // Guardar automáticamente en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localidades));
  }, [localidades]);

  // Función para agregar una localidad
  const agregarLocalidad = (localidad: Localidad) => {
    setLocalidades((prev) => [...prev, localidad]);
  };

  // Función para eliminar una localidad por índice
  const eliminarLocalidad = (index: number) => {
    setLocalidades((prev) => prev.filter((_, i) => i !== index));
  };

  // Función para actualizar una localidad
  const actualizarLocalidad = (index: number, nuevaLocalidad: Localidad) => {
    setLocalidades((prev) => prev.map((loc, i) => (i === index ? nuevaLocalidad : loc)));
  };

  // Función para limpiar todas las localidades
  const limpiarLocalidades = () => {
    setLocalidades([]);
  };

  return {
    localidades,
    agregarLocalidad,
    eliminarLocalidad,
    actualizarLocalidad,
    limpiarLocalidades,
  };
};
