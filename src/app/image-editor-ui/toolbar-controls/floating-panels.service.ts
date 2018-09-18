import {ElementRef, Injectable} from '@angular/core';
import {HistoryPanelComponent} from '../../image-editor-ui/panels/history-panel/history-panel.component';
import {OverlayPanel, PanelConfig} from 'vebto-client/core/ui/overlay-panel/overlay-panel.service';
import {OverlayPanelRef} from 'vebto-client/core/ui/overlay-panel/overlay-panel-ref';
import {ObjectsPanelComponent} from '../panels/objects-panel/objects-panel.component';
import {CanvasStateService} from '../../image-editor/canvas/canvas-state.service';
import {OpenSampleImagePanelService} from '../panels/open-sample-image-panel/open-sample-image-panel.service';
import {BreakpointsService} from 'vebto-client/core/ui/breakpoints.service';

@Injectable()
export class FloatingPanelsService {

    private historyPanelRef: OverlayPanelRef;
    private objectsPanelRef: OverlayPanelRef;

    /**
     * FloatingPanelsService Constructor.
     */
    constructor(
        private overlayPanel: OverlayPanel,
        private state: CanvasStateService,
        private openSampleImageDialog: OpenSampleImagePanelService,
        private breakpoints: BreakpointsService,
    ) {
    }

    public openSampleImagePanel() {
        this.openSampleImageDialog.open();
    }

    /**
     * Toggle history panel.
     */
    public toggleHistory() {
        this.closePanel('objects');

        if (this.panelIsOpen('history')) {
            this.historyPanelRef.close();
        } else {
            this.openHistoryPanel();
        }
    }

    /**
     * Toggle objects panel.
     */
    public toggleObjects() {
        this.closePanel('history');

        if (this.panelIsOpen('objects')) {
            this.objectsPanelRef.close();
        } else {
            this.openObjectsPanel();
        }
    }

    /**
     * Open history panel.
     */
    public openHistoryPanel() {
        this.historyPanelRef = this.overlayPanel.open(
            HistoryPanelComponent,
            this.getPanelConfig(),
        );
    }

    /**
     * Open objects panel.
     */
    public openObjectsPanel() {
        this.objectsPanelRef = this.overlayPanel.open(
            ObjectsPanelComponent,
            this.getPanelConfig(),
        );
    }

    /**
     * Close specified panel.
     */
    public closePanel(name: 'history' | 'objects' | 'objectOptions') {
        switch (name) {
            case 'history':
                this.historyPanelRef && this.historyPanelRef.close();
                break;
            case 'objects':
                this.objectsPanelRef && this.objectsPanelRef.close();
                break;
        }
    }

    public panelIsOpen(name: 'history' | 'objects'): boolean {
        const ref = (name === 'history' ? this.historyPanelRef : this.objectsPanelRef);
        return ref && ref.isOpen();
    }

    private getPanelConfig(): PanelConfig {
        return {
            hasBackdrop: false,
            positionStrategy: this.getPositionStrategy(),
            panelClass: 'floating-panel',
        }
    }

    private getPositionStrategy() {
        if (this.breakpoints.isMobile) {
            return this.overlayPanel.overlay.position()
                .flexibleConnectedTo(new ElementRef(this.state.wrapperEl))
                .withPositions([{overlayX: 'center', overlayY: 'center', originX: 'center', originY: 'center'}]);
        }

        return this.overlayPanel.overlay.position()
            .flexibleConnectedTo(new ElementRef(this.state.wrapperEl))
            .withPositions([{
                overlayX: 'end',
                overlayY: 'bottom',
                originX: 'end',
                originY: 'bottom',
                offsetY: -10,
                offsetX: -10
            }]);
    }
}
