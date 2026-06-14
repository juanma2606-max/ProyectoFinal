import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

export interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string; // URL de Cloudinary opcional
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly API_URL = environment.backendUrl;

  async enviarMensaje(mensajes: Mensaje[]): Promise<string> {
    console.log('🔵 ChatService: Iniciando envío...');

    const payload = {
      messages: mensajes.map(m => {
        if (m.imageUrl) {
          // Formato multimodal para Grok con imagen
          return {
            role: m.role,
            content: [
              { type: 'text', text: m.content },
              { type: 'image_url', image_url: { url: m.imageUrl } }
            ]
          };
        }
        return {
          role: m.role,
          content: m.content
        };
      })
    };

    console.log('🔵 Payload:', JSON.stringify(payload, null, 2));
    console.log('🔵 URL:', `${this.API_URL}/api/chat`);

    try {
      const response = await fetch(`${this.API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('🔵 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error('Error al comunicarse con la IA');
      }

      const data = await response.json();
      console.log('✅ Respuesta recibida:', data);
      return data.content;

    } catch (error) {
      console.error('❌ Error en fetch:', error);
      throw error;
    }
  }
}