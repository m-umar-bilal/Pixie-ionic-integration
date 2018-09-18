import {ElementRef, Injectable} from '@angular/core';
import {Settings} from 'vebto-client/core/config/settings.service';
import {NavItem} from '../image-editor/default-settings';
import {BreakpointsService} from 'vebto-client/core/ui/breakpoints.service';
import {Translations} from 'vebto-client/core/translations/translations.service';
import {Localization} from 'vebto-client/core/types/models/Localization';

@Injectable()
export class EditorUiService {

    private rootEl: ElementRef;

    private visible: boolean = true;

    constructor(
        private config: Settings,
        private breakpoints: BreakpointsService,
        private i18n: Translations,
    ) {}

    public close() {
        if (this.config.get('pixie.ui.allowEditorClose')) {
            this.visible = false;
        }

        this.executeCallback('onClose');
    }

    public open(): Promise<any> {
        this.visible = true;
        this.executeCallback('onOpen');
        return new Promise(resolve => setTimeout(() => resolve()));
    }

    public isOverlayMode() {
        return this.config.get('pixie.ui.mode') === 'overlay';
    }

    public isVisible() {
        return this.visible;
    }

    public getMode(): string {
        return this.config.get('pixie.ui.mode');
    }

    public getTheme(): string {
        return this.config.get('pixie.ui.theme');
    }

    public getControlsPosition(): 'top'|'bottom'|'none' {
        if (this.breakpoints.isMobile) return 'bottom';
        return this.config.get('pixie.ui.nav.position', 'top');
    }

    public init(els: {root: ElementRef, overlay: ElementRef}) {
        this.rootEl = els.root;

        //editor should be closed by default, if mode is overlay
        if (this.config.get('pixie.ui.mode') === 'overlay') {
            this.visible = false;
        }

        this.bindToOverlayClick(els.overlay);
        this.setLocalization();
    }

    public getWidth(): string {
        return this.config.get('pixie.ui.width');
    }

    public getHeight(): string {
        return this.config.get('pixie.ui.height');
    }

    /**
     * Get editor navigation items.
     */
    public getNavItems(): NavItem[] {
        return this.config.get('pixie.ui.nav.items');
    }

    /**
     * Check whether editor toolbar should be hidden.
     */
    public shouldHideToolbar(): boolean {
        return this.config.get('pixie.ui.toolbar.hide');
    }

    /**
     * Check whether editor ui should be compact.
     */
    public isCompact(): boolean {
        return this.config.get('pixie.ui.compact');
    }

    private bindToOverlayClick(overlay: ElementRef) {
        // overlay.nativeElement.addEventListener('click', () => {
        //     this.close();
        // });
    }

    private executeCallback(name: 'onClose'|'onOpen') {
        const callback = this.config.get('pixie.'+name) as Function;
        callback && callback();
    }

    private setLocalization() {
        const active = this.config.get('pixie.languages.active', 'default');
        if (active === 'default') return;

        this.config.set('i18n.enable', true);
        const lines = this.config.get(`pixie.languages.custom.${active}`);

        this.i18n.setLocalization({
            model: new Localization({name: active}),
            lines: lines,
        });
    }
}