import {AfterContentInit, Component, ContentChildren, QueryList, ViewEncapsulation} from '@angular/core';
import {BaseDrawer} from '../base-drawer';
import {BreakpointsService} from 'vebto-client/core/ui/breakpoints.service';
import {ActiveDrawerService} from '../active-drawer.service';
import {delay} from 'rxjs/operators';

@Component({
    selector: 'drawer-wrapper',
    templateUrl: './drawer-wrapper.component.html',
    styleUrls: ['./drawer-wrapper.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class DrawerWrapperComponent implements AfterContentInit {
    @ContentChildren('controlsDrawer', {descendants: true}) drawers: QueryList<BaseDrawer>;

    constructor(
        public breakpoints: BreakpointsService,
        public activeDrawer: ActiveDrawerService,
    ) {}

    ngAfterContentInit() {
        //need to delay changes so expression changed error is avoided
        this.drawers.changes.pipe(delay(0)).subscribe(() => {
            this.activeDrawer.set(this.drawers.last || this.drawers.first);
        });
    }
}
