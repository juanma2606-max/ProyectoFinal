import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { HuertosService } from './huertos.service';
import { CultivosService } from './cultivos.service';
import { PlantasService } from './plantas.service';
import { AmenazasService } from './amenazas.service';
import { Huerto } from '../modelos/huerto.model';
import { Cultivo } from '../modelos/cultivo.model';
import { Planta } from '../modelos/planta.model';
import { Amenaza } from '../modelos/amenaza.model';
import { firstValueFrom } from 'rxjs';

export interface AnalisisHuerto {
  huerto: Huerto;
  analisis: string;
  fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HuertoAnalisisService {

  constructor(
    private chatService: ChatService,
    private huertosService: HuertosService,
    private cultivosService: CultivosService,
    private plantasService: PlantasService,
    private amenazasService: AmenazasService
  ) {}

  /**
   * Analiza un huerto completo con IA
   */
  async analizarHuerto(uid: string, huertoId: string): Promise<string> {
    try {
      // 1. Obtener datos del huerto
      const huerto = await this.huertosService.getHuertoByUidAndId(uid, huertoId);
      if (!huerto) {
        throw new Error('Huerto no encontrado');
      }

      // 2. Obtener cultivos del huerto
      const cultivos = await firstValueFrom(
        this.cultivosService.getCultivosByHuerto(uid, huertoId)
      );

      // 3. Obtener detalles de plantas y amenazas
      const cultivosDetallados = await Promise.all(
        cultivos.map(async (cultivo) => {
          const planta = await this.plantasService.getPlantaById(cultivo.plantaId);
          let amenaza = null;
          
          if (cultivo.amenazaId) {
            amenaza = await this.amenazasService.getAmenazaById(cultivo.amenazaId);
          }
          
          return { cultivo, planta, amenaza };
        })
      );

      // 4. Construir el prompt
      const prompt = this.construirPromptAnalisis(huerto, cultivosDetallados);

      // 5. Enviar a la IA
      const respuesta = await this.chatService.enviarMensaje([
        {
          role: 'user',
          content: prompt
        }
      ]);

      return respuesta;

    } catch (error) {
      console.error('Error al analizar huerto:', error);
      throw error;
    }
  }

  /**
   * Construye un prompt detallado para el análisis
   */
  private construirPromptAnalisis(
    huerto: Huerto,
    cultivosDetallados: Array<{
      cultivo: Cultivo;
      planta: Planta | null;
      amenaza: Amenaza | null;
    }>
  ): string {
    let prompt = `Eres HuertingIA, un experto en agricultura y huertos. Analiza el siguiente huerto y proporciona recomendaciones detalladas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 INFORMACIÓN DEL HUERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${huerto.nombre}
Descripción: ${huerto.descripcion}
Ubicación: ${huerto.ubicacion}
Superficie: ${huerto.superficie} m²
Tipo de suelo: ${huerto.tipo_suelo}
Horas de sol directo: ${huerto.horas_sol} horas/día
Sistema de riego: ${huerto.tiene_riego ? 'SÍ' : 'NO'}
Fecha de creación: ${new Date(huerto.fecha_creacion).toLocaleDateString('es-ES')}
${huerto.notas ? `Notas adicionales: ${huerto.notas}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CULTIVOS ACTUALES (${cultivosDetallados.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    if (cultivosDetallados.length === 0) {
      prompt += `\n No hay cultivos plantados actualmente en este huerto.\n`;
    } else {
      cultivosDetallados.forEach((item, index) => {
        const { cultivo, planta, amenaza } = item;
        
        prompt += `\n${index + 1}. "${cultivo.nombre}"`;
        
        if (planta) {
          prompt += `\n   Planta: ${planta.nombre}`;
          if (planta.nombre_cientifico) {
            prompt += ` (${planta.nombre_cientifico})`;
          }
          prompt += `\n   Tipo: ${planta.tipo}`;
          prompt += `\n   Necesidades:`;
          prompt += `\n     • Luz: ${planta.luz}`;
          prompt += `\n     • Riego: ${planta.riego}`;
          prompt += `\n     • Tiempo de crecimiento: ${planta.tiempo_crecimiento} días`;
          
          if (planta.incompatibilidades && planta.incompatibilidades.length > 0) {
            prompt += `\n     • Incompatible con: ${planta.incompatibilidades.length} plantas`;
          }
        }
        
        prompt += `\n   Fecha de siembra: ${new Date(cultivo.fecha_siembra).toLocaleDateString('es-ES')}`;
        prompt += `\n   Estado: ${this.traducirEstado(cultivo.estado)}`;
        prompt += `\n   Cantidad: ${cultivo.cantidad} ${cultivo.cantidad === 1 ? 'planta' : 'plantas'}`;
        
        if (cultivo.estado === 'enfermo' && amenaza) {
          prompt += `\n    PROBLEMA DETECTADO:`;
          prompt += `\n     • Amenaza: ${amenaza.nombre} (${amenaza.tipo})`;
          prompt += `\n     • Descripción: ${amenaza.descripcion}`;
          if (amenaza.sintomas && amenaza.sintomas.length > 0) {
            prompt += `\n     • Síntomas: ${amenaza.sintomas.join(', ')}`;
          }
          if (amenaza.tratamiento) {
            prompt += `\n     • Tratamiento sugerido: ${amenaza.tratamiento}`;
          }
        }
        
        if (cultivo.notas) {
          prompt += `\n    Notas: ${cultivo.notas}`;
        }
        
        prompt += `\n`;
      });
    }

    prompt += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ANÁLISIS SOLICITADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Por favor, proporciona un análisis completo del huerto considerando:

1.  COMPATIBILIDAD DE CONDICIONES
   - ¿Los cultivos actuales son adecuados para las condiciones del huerto?
   - ¿Hay problemas con las horas de sol, tipo de suelo o riego?

2.  ASOCIACIONES Y COMPATIBILIDAD
   - ¿Los cultivos plantados son compatibles entre sí?
   - ¿Hay incompatibilidades que puedan causar problemas?

3.  PROBLEMAS Y ENFERMEDADES
   - Análisis de cultivos enfermos y sus amenazas
   - Recomendaciones de tratamiento específicas

4.  CALENDARIO Y DESARROLLO
   - Estado de madurez de cada cultivo según su fecha de siembra
   - Estimación de cuándo estarán listos para cosechar

5.  RECOMENDACIONES PRÁCTICAS
   - Qué nuevos cultivos se podrían añadir
   - Mejoras en las condiciones del huerto
   - Rotación de cultivos sugerida

Responde en español de forma clara, estructurada y práctica. Sé específico con cada cultivo cuando sea necesario.`;

    return prompt;
  }

  /**
   * Traduce los estados a texto legible
   */
  private traducirEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'plantado': ' Plantado',
      'creciendo': ' Creciendo',
      'maduro': ' Maduro',
      'cosechado': ' Cosechado',
      'enfermo': ' Enfermo'
    };
    return estados[estado] || estado;
  }
}