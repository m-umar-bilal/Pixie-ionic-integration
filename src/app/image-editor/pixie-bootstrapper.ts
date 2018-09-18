import {AppModule} from '../app.module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DEFAULT_CONFIG, PixieConfig, MERGED_CONFIG, PIXIE_VERSION} from './default-settings';
// import merge from 'deepmerge';
import merge from '../../../node_modules/deepmerge/dist/es.js';
import * as Dot from 'dot-object';
import {ApplicationRef, Injector, NgModuleRef, NgZone} from '@angular/core';
import {CanvasService} from './canvas/canvas.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {ToolsService} from './tools/tools.service';
import {SerializedCanvas} from './history/serialized-canvas';
import {HttpClient} from '@angular/common/http';
import {EditorUiService} from '../image-editor-ui/editor-ui.service';
import {ImportToolService} from './tools/import-tool.service';
import {OpenSampleImagePanelService} from '../image-editor-ui/panels/open-sample-image-panel/open-sample-image-panel.service';
import {EditorControlsService} from '../image-editor-ui/toolbar-controls/editor-controls.service';
import {Type} from '@angular/core/src/type';
import {InjectionToken} from '@angular/core/src/di/injection_token';
import {HistoryToolService} from './history/history-tool.service';

export class PixieBootstrapper {

    private injector: Injector;

    public version = PIXIE_VERSION;

    constructor(config: PixieConfig) {
        this.initPixie(config);
    }

    /**
     * Open specified image and then editor.
     */
    public openEditorWithImage(data: string|HTMLImageElement, asMainImage: boolean = true) {
        this.openFile(data, 'png', asMainImage).then(() => this.open());
    }

    /**
     * Open specified photo as main canvas image.
     */
    public openMainImage(data: string|HTMLImageElement) {
        this.openFile(data, 'png', true);
    }

    /**
     * Open specified file in the editor.
     */
    public openFile(data: string|HTMLImageElement, extension: string = 'png', asMainImage: boolean = false) {
        const importTool = this.getTool('import') as ImportToolService;

        let promise;

        if (asMainImage) {
            promise = importTool.openBackgroundImage(data);
        } else {
            promise = importTool.openFile(data, extension);
        }

        this.injector.get(ApplicationRef).tick();

        return promise;
    }

    /**
     * Open new canvas with specified with and height.
     */
    public newFile(width: number, height: number) {
        return this.getTool('canvas').openNew(width, height);
    }

    /**
     * Load canvas state from json.
     */
    public loadState(state: string|SerializedCanvas) {
        this.get(NgZone).run(() => {
            state = typeof state !== 'string' ? JSON.stringify(state) : state;
            return this.getTool('history').addFromJson(state);
        });
    }

    /**
     * Get current canvas state as json.
     */
    public getState() {
        return JSON.stringify(this.getTool('history').getCurrentCanvasState());
    }

    /**
     * Open pixie editor.
     */
    public open(config?: PixieConfig) {
        this.get(NgZone).run(() => {
            if (config) { this.mergeConfig(config); }
            this.get(EditorUiService).open().then(() => {
                this.getTool('canvas').zoom.fitToScreen();
                this.get(OpenSampleImagePanelService).open();
            });
        });
    }

    /**
     * Close pixie editor.
     */
    public close() {
        this.get(NgZone).run(() => {
            return this.get(EditorUiService).close();
        });
    }

    public resetEditor(key: string|PixieConfig, value?: any) {
        return new Promise(resolve => {
            this.get(NgZone).run(() => {
                this.get(ImportToolService).resetEditor();
                if (key) { this.setConfig(key, value); }
                this.getTool('canvas').initContent().then(() => {
                    this.get(EditorControlsService).closeAllPanels();
                    this.get(OpenSampleImagePanelService).open();
                    if (key) { this.get(HistoryToolService).addInitial(); }
                    resolve();
                });
            });
        });
    }

    public resetAndOpenEditor(key: string|PixieConfig, value?: any) {
        this.resetEditor(key, value).then(() => this.open());
    }

    /**
     * Set specified config value via dot notation.
     */
    public setConfig(key: string|PixieConfig, value?: any) {
        const settings = this.get(Settings);

        // set config if key and value is provided
        if (typeof key === 'string' && typeof value !== 'undefined') {
            this.get(NgZone).run(() => {
                const prefixedKey = key.indexOf('vebto.') > -1 ? key : 'pixie.' + key;
                settings.set(prefixedKey, value);
            });

        // set config if config object is provided
        } else if (typeof key === 'object') {
            this.get(NgZone).run(() => {
                const config = {pixie: key};

                if (config.pixie['sentry_public']) {
                    settings.set('logging.sentry_public', config.pixie['sentry_public']);
                }

                settings.merge(config);
            });
        }

    }

    public getDefaultConfig(key: string): any {
        return Dot.pick(key, DEFAULT_CONFIG);
    }

    /**
     * Get pixie http client.
     */
    public http(): HttpClient {
        return this.get(HttpClient);
    }

    /**
     * Get pixie tool by specified name.
     */
    public getTool(name: string) {
        if ( ! this.injector) { throw new Error(('Pixie is not loaded yet. Are you using "onLoad" callback?')); }
        return this.get(ToolsService).get(name);
    }

    public get<T>(token: Type<T> | InjectionToken<T>): T {
        return this.injector.get(token);
    }

    private initPixie(config: PixieConfig) {
        const merged = this.mergeConfig(config);

        platformBrowserDynamic([{provide: MERGED_CONFIG, useValue: merged}])
            .bootstrapModule(AppModule)
            .then(this.onAngularReady.bind(this))
            .catch(err => console.log(err));
    }

    private mergeConfig(userConfig: PixieConfig) {
        const merged = merge(DEFAULT_CONFIG, userConfig || {});
        return this.replaceDefaultConfigItems(merged, userConfig);
    }

    /**
     * Remove default items if "replaceDefault" is true in user config.
     */
    private replaceDefaultConfigItems(config: object, userConfig: object) {
        for (const key in config) {
            if (key === 'replaceDefault' && config[key]) {
                config['items'] = userConfig['items'];
            } else if (typeof config[key] === 'object') {
                this.replaceDefaultConfigItems(config[key], userConfig && userConfig[key]);
            }
        }

        return config;
    }

    private onAngularReady(appModule: NgModuleRef<AppModule>) {
        this.injector = appModule.injector;
        this.get(CanvasService).state.loaded.subscribe(() => {
            const settings = this.get(Settings);
            const onLoad = settings.get('pixie.onLoad') as Function;
            if (onLoad) { onLoad(); }
        });
    }
}
