import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container-unauth',
  templateUrl: './container-unauth.component.html',
  styles: [
  ]
})
export class ContainerUnauthComponent {

  @Input() isRegister: boolean = false;
}
