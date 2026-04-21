import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class ChatIaComponent implements OnInit, AfterViewChecked {

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  mensajes: Mensaje[] = [];
  inputUsuario: string = '';
  cargando: boolean = false;
  error: string = '';
  
  private debeHacerScroll: boolean = false;

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

    // Si viene con contexto de un análisis o cultivo enfermo
    this.route.queryParamMap.subscribe(params => {
      const mensaje = params.get('mensaje');
      if (mensaje) {
        // Decodificar el mensaje (por si tiene caracteres especiales)
        const mensajeDecodificado = decodeURIComponent(mensaje);
        
        // Agregar el mensaje del usuario al historial
        this.mensajes.push({
          role: 'user',
          content: mensajeDecodificado
        });
        
        // Enviar automáticamente
        this.enviarMensajeInicial();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.debeHacerScroll) {
      this.scrollAlFinal();
      this.debeHacerScroll = false;
    }
  }

  /**
   * Enviar el mensaje inicial automáticamente (cuando viene de otra pantalla)
   */
  async enviarMensajeInicial(): Promise<void> {
    this.cargando = true;
    this.error = '';
    this.debeHacerScroll = true;

    try {
      const respuesta = await this.chatService.enviarMensaje(this.mensajes);
      this.mensajes.push({ role: 'assistant', content: respuesta });
      this.debeHacerScroll = true;
    } catch (e: any) {
      this.error = 'Error al conectar con la IA. Inténtalo de nuevo.';
      console.error(e);
      // Remover el mensaje del usuario si falló
      this.mensajes.pop();
    } finally {
      this.cargando = false;
    }
  }

  async enviarMensaje(): Promise<void> {
    if (!this.inputUsuario.trim() || this.cargando) return;

    const texto = this.inputUsuario.trim();
    this.inputUsuario = '';
    this.error = '';

    // Añadir mensaje del usuario
    this.mensajes.push({ role: 'user', content: texto });
    this.cargando = true;
    this.debeHacerScroll = true;

    try {
      const respuesta = await this.chatService.enviarMensaje(this.mensajes);
      this.mensajes.push({ role: 'assistant', content: respuesta });
      this.debeHacerScroll = true;
    } catch (e: any) {
      this.error = 'Error al conectar con la IA';
      console.error(e);
      // Remover el mensaje del usuario si falló
      this.mensajes.pop();
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

  private scrollAlFinal(): void {
    try {
      if (this.mensajesContainer) {
        const el = this.mensajesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }
}