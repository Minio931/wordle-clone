import {Component, input} from "@angular/core";
import {NgClass} from "@angular/common";

@Component({
    selector: "app-key",
    standalone: true,
    templateUrl: "key.component.html",
    imports: [
        NgClass
    ],
    styleUrl: "key.component.scss"
})
export class KeyComponent {
    key = input.required<string>();
    isPressed = input<boolean>(false);
}