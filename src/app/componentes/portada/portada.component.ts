import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-portada',
  imports: [RouterLink],
  templateUrl: './portada.component.html',
  styleUrl: './portada.component.scss'
})
export class PortadaComponent implements AfterViewInit {

  @ViewChild('bgVideo')
  bgVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.bgVideo.nativeElement;

    // Forzamos autoplay REAL
    video.muted = true;
    video.currentTime = 0;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Algunos navegadores bloquean el primer intento
        setTimeout(() => {
          video.play().catch(() => {});
        }, 100);
      });
    }
  }
}
