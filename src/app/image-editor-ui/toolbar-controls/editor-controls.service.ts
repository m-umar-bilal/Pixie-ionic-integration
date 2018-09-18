import {Injectable} from '@angular/core';
import {Settings} from 'vebto-client/core/config/settings.service';
import {NavItem} from '../../image-editor/default-settings';
import {EditorUiService} from '../editor-ui.service';
import {Subject} from 'rxjs';

@Injectable()
export class EditorControlsService {

    private breadcrumbs = ['navigation'];

    public onClose$ = new Subject();

    constructor(
        private config: Settings,
        private editorUI: EditorUiService,
    ) {}

    public openPanel(panels: string | string[]) {
        if ( ! Array.isArray(panels)) panels = [panels];

        panels.forEach(panel => {
            if (this.breadcrumbs.indexOf(panel) > -1) return;
            this.breadcrumbs.push(panel);
        });
    }

    public togglePanel(name: string) {
        if (this.panelIsVisible(name)) {
            this.closePanel(name);
        } else {
            this.closeAllPanels();
            this.openPanel(name);
        }
    }

    public closePanel(name: string) {
        const i = this.breadcrumbs.indexOf(name);
        this.breadcrumbs.splice(i, 1);
        this.onClose$.next();
    }

    /**
     * Close currently visible panel.
     */
    public closeCurrentPanel() {
        //navigation panel should always stay open
        if (this.breadcrumbs.length < 2) return;
        this.closePanel(this.breadcrumbs[this.breadcrumbs.length - 1]);
    }


    /**
     * Close all currently open panels.
     */
    public closeAllPanels() {
        this.breadcrumbs = ['navigation'];
        this.onClose$.next();
    }

    /**
     * Check if specified panel is open and on top.
     */
    public panelIsVisible(name: string): boolean {
        return this.breadcrumbs[this.breadcrumbs.length - 1] === name;
    }

    /**
     * Check if specified panel is open, regardless if it's on top.
     */
    public panelIsOpen(name: string): boolean {
        return this.breadcrumbs.indexOf(name) > -1;
    }

    /**
     * Open controls drawer based on specified event.
     */
    public openObjectDrawer(name: string) {
        switch (name) {
            case 'shape':
            case 'sticker':
                this.closeAllPanels();
                this.openPanel(['objectSettings']);
                break;
            case 'text':
                this.closeAllPanels();
                this.openPanel(['text']);
                break;
            case 'drawing':
                this.closeAllPanels();
                this.openPanel(['draw']);
                break;
        }
    }

    /**
     * Get icon name for specified tool.
     */
    public getIconName(toolName: string): string|null {
        const navItems = this.editorUI.getNavItems(),
            item = navItems.find((item: NavItem) => item.name === toolName);

        const formattedName = toolName.replace(/([A-Z])/g, '-$1').toLowerCase();

        return item ? item.icon : formattedName+'-custom';
    }
}
