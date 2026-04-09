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

  private readonly API_URL = '/anthropic-api/v1/messages';
  private readonly MODEL = 'claude-opus-4-5-20251101';
  private readonly SYSTEM_PROMPT = `Eres un asistente experto en agricultura, 
  huertos y jardineria llamado HuertingIA. Ayudas a los usuarios con preguntas 
  sobre sus plantas, cultivos, plagas, enfermedades y cuidados generales. 
  Responde siempre en español, de forma clara y concisa.`;

  async enviarMensaje(mensajes: Mensaje[]): Promise<string> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': environment.anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: this.MODEL,
        max_tokens: 1024,
        system: this.SYSTEM_PROMPT,
        messages: mensajes.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}