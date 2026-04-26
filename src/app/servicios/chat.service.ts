import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly API_URL = environment.backendUrl;

  async enviarMensaje(mensajes: Mensaje[]): Promise<string> {
    console.log('🔵 ChatService: Iniciando envío...');
    console.log('🔵 Mensajes a enviar:', mensajes);
    
    const payload = {
      messages: mensajes.map(m => ({
        role: m.role,
        content: m.content
      }))
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
      console.log('🔵 Response ok:', response.ok);

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