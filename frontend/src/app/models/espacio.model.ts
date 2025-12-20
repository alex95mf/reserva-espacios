export interface Espacio {
  id?: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  tipo: string;
  imagen_url: string;
  disponible: boolean;
  created_at?: string;
  updated_at?: string;
}