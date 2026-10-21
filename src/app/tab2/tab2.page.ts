import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  AlertController,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { camera, trash } from 'ionicons/icons';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
  ],
})
export class Tab2Page {
  public photoService = inject(PhotoService);
  private alertController = inject(AlertController);

  // Variable para rastrear la foto seleccionada actualmente
  public selectedPhotoPath: string | null = null;

  constructor() {
    addIcons({ camera, trash });
  }

  async addPhotoToGallery() {
    try {
      await this.photoService.addNewToGallery();
    } catch (error) {
      console.error('Error al tomar la fotografía:', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo tomar o guardar la fotografía.',
        buttons: ['Aceptar'],
      });

      await alert.present();
    }
  }

  // Método para seleccionar o deseleccionar una foto al hacer clic en ella
  selectPhoto(photo: UserPhoto) {
    if (this.selectedPhotoPath === photo.filepath) {
      this.selectedPhotoPath = null; // Si ya estaba seleccionada, la deseleccionamos
    } else {
      this.selectedPhotoPath = photo.filepath; // Seleccionamos la nueva
    }
  }

  async deletePhoto(filepath: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar fotografía',
      message: '¿Deseas eliminar esta fotografía de la aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.photoService.deletePhoto(filepath);
              this.selectedPhotoPath = null; // Limpiamos la selección al borrar
            } catch (error) {
              console.error('Error al eliminar la fotografía:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async ionViewWillEnter() {
    await this.photoService.loadSavedPhotos();
  }
}