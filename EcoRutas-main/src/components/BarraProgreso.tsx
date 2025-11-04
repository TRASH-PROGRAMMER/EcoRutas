import React from "react";

export const BarraProgreso = ({ porcentaje }: { porcentaje: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
    <div
      className="bg-green-500 h-3 rounded-full transition-all duration-300"
      style={{ width: `${porcentaje}%` }}
    ></div>
    <p className="text-right text-sm text-gray-600 mt-1">{porcentaje}% completado</p>
  </div>
);
