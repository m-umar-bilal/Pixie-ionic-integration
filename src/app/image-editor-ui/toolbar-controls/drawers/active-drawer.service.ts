import {BaseDrawer} from './base-drawer';
import {EditorControlsService} from '../editor-controls.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ActiveDrawerService {

    private drawers: BaseDrawer[] = [];

    constructor(private controls: EditorControlsService) {
        this.bindToPanelClose();
    }

    public set(drawer: BaseDrawer|null) {
        if ( ! drawer) return;
        this.drawers.push(drawer);
    }

    public isOpen(): boolean {
        return this.drawers.length > 0;
    }

    public close() {
        const active = this.getActive();
        active ? active.close() : this.controls.closeCurrentPanel();
    }

    public apply() {
        this.getActive().apply();
    }

    public dirty(): boolean {
        return this.getActive() && this.getActive().dirty;
    }

    public getName(): string {
        return this.getActive() && this.getActive().name;
    }

    public getDisplayName(): string {
        const name = this.getName();
        return name ? name.replace(/([A-Z])/g, ' $1') : '';
    }

    public canApplyChanges(): boolean {
        return this.getName() !== 'objectSettings' && this.dirty();
    }

    public getActive(): BaseDrawer|null {
        return this.drawers[this.drawers.length - 1];
    }

    /**
     * Remove drawer when corresponding panel is closed.
     */
    private bindToPanelClose() {
        this.controls.onClose$.subscribe(() => {
            this.drawers.forEach((drawer, i) => {
                if (!this.controls.panelIsOpen(drawer.name)) {
                    this.drawers.splice(i, 1);
                }
            });
        });
    }
}