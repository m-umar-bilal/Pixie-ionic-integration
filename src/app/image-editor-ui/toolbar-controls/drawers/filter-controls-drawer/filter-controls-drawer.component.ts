import {Component, Input, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {OverlayPanel} from 'vebto-client/core/ui/overlay-panel/overlay-panel.service';
import {FormControl} from '@angular/forms';
import {Filter} from '../../../../image-editor/tools/filter/filters-list';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {FilterToolService} from '../../../../image-editor/tools/filter/filter-tool.service';

@Component({
    selector: 'filter-controls-drawer',
    templateUrl: './filter-controls-drawer.component.html',
    styleUrls: ['./filter-controls-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class FilterControlsDrawerComponent {

    /**
     * Name of this drawer.
     */
    public name = 'filterOptions';

    @Input() selectedFilter: Filter;

    public colorFormControl = new FormControl();

    /**
     * ShadowControlsDrawer Constructor.
     */
    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
        private overlayPanel: OverlayPanel,
        private filterTool: FilterToolService,
    ) {}

    /**
     * Apply specified value to selected filter.
     */
    public applyFilterValue(optionName: string, value: string|number) {
        this.filterTool.applyValue(this.selectedFilter, optionName, value);
    }
}
