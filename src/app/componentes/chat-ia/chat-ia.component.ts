import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Mensaje de bienvenida
    this.mensajes.push({
      role: 'assistant',
      content: '¡Hola! Soy HuertingIA 🌱 Tu asistente experto en huertos y plantas. ¿En qué puedo ayudarte hoy?'
    });

    // Si viene con contexto de un cultivo enfermo
    this.route.queryParamMap.subscribe(params => {
      const mensaje = params.get('mensaje');
      if (mensaje) {
        this.inputUsuario = mensaje;
        this.enviarMensaje();
      }
    });
  }

  async enviarMensaje(): Promise<void> {
    const texto = this.inputUsuario.trim();
    if (!texto || this.cargando) return;

    // Añadimos el mensaje del usuario
    this.mensajes.push({ role: 'user', content: texto });
    this.inputUsuario = '';
    this.cargando = true;
    this.error = '';

    // Scroll al final
    setTimeout(() => this.scrollAlFinal(), 50);

    try {
      const respuesta = await this.chatService.enviarMensaje(this.mensajes);
      this.mensajes.push({ role: 'assistant', content: respuesta });
    } catch (e) {
      this.error = 'Error al conectar con la IA. Inténtalo de nuevo.';
    } finally {
      this.cargando = false;
      setTimeout(() => this.scrollAlFinal(), 50);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }

  private scrollAlFinal(): void {
    if (this.mensajesContainer) {
      const el = this.mensajesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  limpiarChat(): void {
    this.mensajes = [{
      role: 'assistant',
      content: '¡Hola! Soy HuertingIA 🌱 Tu asistente experto en huertos y plantas. ¿En qué puedo ayudarte hoy?'
    }];
  }
}