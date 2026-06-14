import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private readonly CLOUD_NAME = 'dedqzjwq3';
  private readonly UPLOAD_PRESET = 'Huerting';
  private readonly UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

  /**
   * Sube una imagen a Cloudinary y devuelve la URL segura
   */
  async subirImagen(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);

    const response = await fetch(this.UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir imagen a Cloudinary: ${errorText}`);
    }

    const data = await response.json();
    return data.secure_url as string;
  }
}