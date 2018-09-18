import {AfterContentInit, Directive, ElementRef, NgZone} from '@angular/core';
import {ObjectsService} from '../../../image-editor/objects/objects.service';
import {CanvasStateService} from '../../../image-editor/canvas/canvas-state.service';
import * as Sortable from "sortablejs";

@Directive({
  selector: '[reorderObjects]'
})
export class ReorderObjectsDirective implements AfterContentInit {

    /**
     * ReorderObjectsDirective Constructor.
     */
    constructor(
        private el: ElementRef,
        private objects: ObjectsService,
        private zone: NgZone,
        private canvasState: CanvasStateService,
    ) {}

    ngAfterContentInit() {
        new Sortable(this.el.nativeElement, {
            draggable: '.reorder-item-wrapper',
            animation: 250,
            onUpdate: () => {
                const ids = Array.from(this.el.nativeElement.querySelectorAll('.item'))
                    .map((el: HTMLElement) => el.dataset.id).reverse();

                ids.forEach((id, index) => this.objects.getById(id).moveTo(index));

                this.canvasState.fabric.requestRenderAll();
                this.objects.syncObjects();
            }
        });
    }
}
