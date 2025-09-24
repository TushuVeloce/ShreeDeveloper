import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer-modal',
  templateUrl: './image-viewer-modal.component.html',
  styleUrls: ['./image-viewer-modal.component.scss'],
  standalone:false
})
export class ImageViewerModalComponent  implements OnInit {

 @Input() imageUrl: string='';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
