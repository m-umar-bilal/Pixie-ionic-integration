import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {OverlayPanelRef} from 'vebto-client/core/ui/overlay-panel/overlay-panel-ref';
import {GoogleFontsPanelService} from './google-fonts-panel.service';
import {FontCategories} from './font-categories';
import {FontItem} from './font-item';

@Component({
    selector: 'google-fonts-panel',
    templateUrl: './google-fonts-panel.component.html',
    styleUrls: ['./google-fonts-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GoogleFontsPanelComponent implements OnInit, OnDestroy {

    public fontCategories = FontCategories;

    /**
     * GoogleFontsPanelComponent Constructor.
     */
    constructor(
        public overlayPanelRef: OverlayPanelRef,
        public fonts: GoogleFontsPanelService,
    ) {

    }

    ngOnInit() {
        this.fonts.init();
    }

    ngOnDestroy() {
        this.fonts.paginator.reset();
    }

    public applyFont(font: FontItem) {
        this.overlayPanelRef.emitValue(font);
        this.overlayPanelRef.close();
    }
}
