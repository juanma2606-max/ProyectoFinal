import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService, Mensaje } from '../../servicios/chat.service';
import { CloudinaryService } from '../../servicios/cloudinary.service';

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-ia.component.html',
  styleUrl: './chat-ia.component.scss'
})
export class ChatIaComponent implements OnInit, AfterViewChecked {

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;
  @ViewChild('textareaInput') textareaInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputImagen') inputImagen!: ElementRef<HTMLInputElement>;

  mensajes: Mensaje[] = [];
  inputUsuario: string = '';
  cargando: boolean = false;
  error: string = '';

  // Estado de imagen adjunta
  imagenPendienteUrl: string | null = null;
  imagenPreviewUrl: string | null = null;
  subiendoImagen: boolean = false;

  private debeHacerScroll: boolean = false;

  constructor(
    private chatService: ChatService,
    private cloudinaryService: CloudinaryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mensajes.push({
      role: 'assistant',
      content: '¡Hola! Soy HuertingIA 🌱 Tu asistente experto en huertos y plantas. ¿En qué puedo ayudarte hoy? También puedes adjuntar fotos de tus plantas para que las analice.'
    });

    this.route.queryParamMap.subscribe(params => {
      const mensaje = params.get('mensaje');
      if (mensaje) {
        const mensajeDecodificado = decodeURIComponent(mensaje);
        this.mensajes.push({ role: 'user', content: mensajeDecodificado });
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

  ajustarAlturaTextarea(): void {
    if (this.textareaInput) {
      const textarea = this.textareaInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  // -------------------------------------------------------
  // IMAGEN
  // -------------------------------------------------------
  abrirSelectorImagen(): void {
    this.inputImagen.nativeElement.click();
  }

  async onImagenSeleccionada(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Mostrar preview local inmediato
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagenPreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Subir a Cloudinary
    this.subiendoImagen = true;
    this.error = '';

    try {
      this.imagenPendienteUrl = await this.cloudinaryService.subirImagen(file);
      console.log('✅ Imagen subida a Cloudinary:', this.imagenPendienteUrl);
    } catch (e: any) {
      console.error('❌ Error subiendo imagen:', e);
      this.error = 'Error al subir la imagen. Inténtalo de nuevo.';
      this.imagenPendienteUrl = null;
      this.imagenPreviewUrl = null;
    } finally {
      this.subiendoImagen = false;
      // Resetear input para permitir seleccionar la misma imagen otra vez
      input.value = '';
    }
  }

  quitarImagen(): void {
    this.imagenPendienteUrl = null;
    this.imagenPreviewUrl = null;
  }

  // -------------------------------------------------------
  // CHAT
  // -------------------------------------------------------
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
      this.mensajes.pop();
    } finally {
      this.cargando = false;
    }
  }

  async enviarMensaje(): Promise<void> {
    const texto = this.inputUsuario.trim();
    const tieneImagen = !!this.imagenPendienteUrl;

    if (!texto && !tieneImagen) return;
    if (this.cargando || this.subiendoImagen) return;

    const textoFinal = texto || 'Analiza esta imagen';
    this.inputUsuario = '';
    this.error = '';
    this.resetearAlturaTextarea();

    // Crear mensaje con o sin imagen
    const mensajeUsuario: Mensaje = {
      role: 'user',
      content: textoFinal,
      ...(this.imagenPendienteUrl ? { imageUrl: this.imagenPendienteUrl } : {})
    };

    // Limpiar imagen pendiente
    this.imagenPendienteUrl = null;
    this.imagenPreviewUrl = null;

    this.mensajes.push(mensajeUsuario);
    this.cargando = true;
    this.debeHacerScroll = true;

    try {
      const respuesta = await this.chatService.enviarMensaje(this.mensajes);
      this.mensajes.push({ role: 'assistant', content: respuesta });
      this.debeHacerScroll = true;
    } catch (e: any) {
      this.error = 'Error al conectar con la IA';
      console.error(e);
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

  private resetearAlturaTextarea(): void {
    if (this.textareaInput) {
      this.textareaInput.nativeElement.style.height = 'auto';
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