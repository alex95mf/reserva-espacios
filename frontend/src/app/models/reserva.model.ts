import { Espacio } from './espacio.model';

export interface Reserva {
  id?: number;
  user_id: number;
  espacio_id: number;
  nombre_evento: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  espacio?: Espacio;
  created_at?: string;
  updated_at?: string;
}