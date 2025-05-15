import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-loadingpopup',
  imports: [
    NgIf
  ],
  templateUrl: './loadingpopup.component.html',
  styleUrl: './loadingpopup.component.css'
})
export class LoadingpopupComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'En cours d\'enregistrement...';
}
