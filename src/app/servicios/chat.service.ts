import { Injectable } from '@angular/core';

export interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

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
    console.log('🔵 URL:', 'http://localhost:3000/api/chat');
    
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
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