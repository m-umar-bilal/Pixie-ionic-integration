import {Component, ViewEncapsulation} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {EditorControlsService} from './editor-controls.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {ActiveDrawerService} from './drawers/active-drawer.service';
import {ActiveObjectService} from '../../image-editor/canvas/active-object.service';

@Component({
    selector: 'editor-controls',
    templateUrl: './editor-controls.component.html',
    styleUrls: ['./editor-controls.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('navAnimation', [
            state('true', style({
                opacity: '*',
                display: 'block',
            })),
            state('false', style({
                opacity: '0',
                display: 'none'
            })),
            transition('true <=> false', animate('225ms cubic-bezier(.4,0,.2,1)'))
        ]),
        trigger('controlsAnimation', [
            state('true', style({
                opacity: '*',
                display: 'flex',
            })),
            state('false', style({
                opacity: '0',
                display: 'none'
            })),
            transition('true <=> false', animate('225ms cubic-bezier(.4,0,.2,1)'))
        ]),
    ]
})
export class EditorControlsComponent {

    /**
     * EditorControlsComponent Constructor. 
     */
    constructor(
        public controls: EditorControlsService,
        private settings: Settings,
        public activeDrawer: ActiveDrawerService,
        public activeObject: ActiveObjectService,
    ) {}

    public getControlsPosition(): string {
        return this.settings.get('pixie.ui.controls.position', 'top');
    }
}
