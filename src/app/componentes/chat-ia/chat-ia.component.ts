import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Mensaje } from '../../servicios/chat.service';

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-ia.component.html',
  styleUrl: './chat-ia.component.scss'
})
export class ChatIaComponent implements OnInit {

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  mensajes: Mensaje[] = [];
  inputUsuario: string = '';
  cargando: boolean = false;
  error: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.mensajes.push({
      role: 'assistant',
      content: '¡Hola! Soy HuertingIA 🌱 ¿En qué puedo ayudarte?'
    });
  }

  async enviarMensaje(): Promise<void> {
    if (!this.inputUsuario.trim() || this.cargando) return;

    const texto = this.inputUsuario.trim();
    this.inputUsuario = '';
    this.error = '';

    // Añadir mensaje del usuario
    this.mensajes.push({ role: 'user', content: texto });
    this.cargando = true;

    try {
      const respuesta = await this.chatService.enviarMensaje(this.mensajes);
      this.mensajes.push({ role: 'assistant', content: respuesta });
    } catch (e: any) {
      this.error = 'Error al conectar con la IA';
      console.error(e);
    } finally {
      this.cargando = false;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }
}