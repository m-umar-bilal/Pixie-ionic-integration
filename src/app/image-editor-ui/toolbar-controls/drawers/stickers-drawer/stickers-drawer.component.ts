import {Component, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {BaseDrawer} from '../base-drawer';
import {StickerCategory} from '../../../../image-editor/tools/shapes/default-stickers';
import {ShapesToolService} from '../../../../image-editor/tools/shapes/shapes-tool.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';

@Component({
    selector: 'stickers-drawer',
    templateUrl: './stickers-drawer.component.html',
    styleUrls: ['./stickers-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class StickersDrawerComponent extends BaseDrawer {
    public categories: StickerCategory[];
    public activeCategory: StickerCategory;

    /**
     * Name of this drawer.
     */
    public name = 'stickers';

    /**
     * ShapesDrawerComponent Constructor.
     */
    constructor(
        public shapesTool: ShapesToolService,
        protected history: HistoryToolService,
        public editorControls: EditorControlsService,
        private config: Settings,
    ) {
        super(history, editorControls);
        this.categories = this.config.get('pixie.tools.stickers.items');
    }

    /**
     * Add specified sticker to canvas.
     */
    public addSticker(category: StickerCategory, name: number|string) {
        this.shapesTool.addSticker(category, name).then(() => {
            this.dirty = true;
        });
    }

    public openStickersCategory(category: StickerCategory) {
        this.activeCategory = category;
        this.editorControls.openPanel('shapes.stickers.'+category.name);
    }

    /**
     * Get iterable for specified categories items.
     */
    public getStickersIterable(category: StickerCategory): (string|number)[] {
        if (category.list) return category.list;
        return Array.from(Array(category.items).keys());
    }
}

