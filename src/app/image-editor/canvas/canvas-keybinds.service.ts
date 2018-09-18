import {Injectable} from '@angular/core';
import {Keybinds} from 'vebto-client/core/keybinds/keybinds.service';
import {ActiveObjectService} from './active-object.service';
import {CanvasStateService} from './canvas-state.service';

@Injectable()
export class CanvasKeybindsService {

    /**
     * CanvasKeybindsService Constructor.
     */
    constructor(
        private state: CanvasStateService,
        private keybinds: Keybinds,
        private activeObject: ActiveObjectService,
    ) {
        this.init();
    }

    init() {
        this.state.loaded.subscribe(() => {
            this.keybinds.add('arrow_up', () => {
                this.activeObject.move('top', -1);
            });

            this.keybinds.add('arrow_right', () => {
                this.activeObject.move('left', 1);
            });

            this.keybinds.add('arrow_down', () => {
                this.activeObject.move('top', 1);
            });

            this.keybinds.add('arrow_left', () => {
                this.activeObject.move('left', -1);
            });

            this.keybinds.add('delete', () => {
                if (this.activeObject.isEditing()) return;
                this.activeObject.delete();
            });
        });
    }
}