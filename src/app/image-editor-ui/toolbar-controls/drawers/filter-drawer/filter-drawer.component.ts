import {Component, ViewEncapsulation} from '@angular/core';
import {Settings} from 'vebto-client/core/config/settings.service';
import {BaseDrawer} from '../base-drawer';
import {EditorControlsService} from '../../editor-controls.service';
import {Filter} from '../../../../image-editor/tools/filter/filters-list';
import {FilterToolService} from '../../../../image-editor/tools/filter/filter-tool.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';

@Component({
    selector: 'filter-drawer',
    templateUrl: './filter-drawer.component.html',
    styleUrls: ['./filter-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class FilterDrawerComponent extends BaseDrawer {

    /**
     * Currently selected filter.
     */
    public selectedFilter: Filter|null;

    /**
     * Name of this drawer.
     */
    public name = 'filter';

    /**
     * FilterDrawerComponent Constructor.
     */
    constructor(
        private settings: Settings,
        public filterTool: FilterToolService,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
    ) {
        super(history, controls);
    }

    public apply() {
        this.controls.closeAllPanels();
        super.apply();
    }

    /**
     * Toggle specified filter.
     */
    public toggleFilter(filter: Filter) {
        this.dirty = true;
        this.filterTool.apply(filter);
    }

    /**
     * Check if specified filter is already applied.
     */
    public filterApplied(filter: string): boolean {
        return this.filterTool.applied(filter);
    }

    /**
     * Get specified filter's preview image url.
     */
    public getFilterImage(filter: Filter) {
        const name = filter.name;
        return this.settings.getAssetUrl('images/filters/square/' + name.replace(' ', '-') + '.jpg');
    }

    public removeFilter(filter: Filter) {
        this.dirty = true;
        this.filterTool.remove(filter);
    }

    public showFilterConfig(filter: Filter) {
        this.dirty = true;
        this.selectedFilter = filter;
        this.controls.openPanel('filterControls');
    }
}
