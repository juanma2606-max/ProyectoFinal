import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-portada',
  imports: [RouterLink],
  templateUrl: './portada.component.html',
  styleUrl: './portada.component.scss'
})
export class PortadaComponent implements AfterViewInit, OnDestroy {

  @ViewChild('video1') video1!: ElementRef<HTMLVideoElement>;
  @ViewChild('video2') video2!: ElementRef<HTMLVideoElement>;

  private videoActual: 1 | 2 = 1;

  ngAfterViewInit(): void {
    const v1 = this.video1.nativeElement;
    const v2 = this.video2.nativeElement;

    v1.muted = true;
    v2.muted = true;
    v1.playbackRate = 0.75;
    v2.playbackRate = 0.75;

    v1.play().catch(() => {
      setTimeout(() => v1.play(), 100);
    });

    v1.addEventListener('ended', () => {
      this.cambiarAVideo2();
    });

    v2.addEventListener('ended', () => {
      this.cambiarAVideo1();
    });
  }

  private cambiarAVideo2(): void {
    const v1 = this.video1.nativeElement;
    const v2 = this.video2.nativeElement;

    v1.style.opacity = '0';
    v2.style.opacity = '1';
    v2.currentTime = 0;
    v2.play();
    this.videoActual = 2;
  }

  private cambiarAVideo1(): void {
    const v1 = this.video1.nativeElement;
    const v2 = this.video2.nativeElement;

    v2.style.opacity = '0';
    v1.style.opacity = '1';
    v1.currentTime = 0;
    v1.play();
    this.videoActual = 1;
  }

  ngOnDestroy(): void {
    this.video1?.nativeElement.pause();
    this.video2?.nativeElement.pause();
  }
}