import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ApplicationRef, ErrorHandler, Injector, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Settings} from 'vebto-client/core/config/settings.service';
import {PIXIE_VERSION, MERGED_CONFIG} from './image-editor/default-settings';
import {environment} from './../environments/environment';
import {ImageEditorUIModule} from './image-editor-ui/image-editor-ui.module';
import {noBackendErrorHandlerFactory} from 'vebto-client/core/errors/no-backend-error-handler';
import {IonicModule} from '@ionic/angular';
import {AppRoutingModule} from './app-routing.module';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
export function init_app(settings, mergedConfig) {
    return () => {
        const baseConfig = {
            baseUrl: null,
            version: PIXIE_VERSION,
            logging: {
                sentry_public: null,
            },
            vebto: {
                environment: environment.production ? 'production' : 'dev',
                assetsUrl: null,
                assetsPrefix: null,
            }
        };

        if (mergedConfig.urls && mergedConfig.urls.base) {
            baseConfig.baseUrl = mergedConfig.urls.base;
        }

        if (mergedConfig.urls && mergedConfig.urls.assets) {
            baseConfig.vebto.assetsUrl = mergedConfig.urls.assets;
        }

        //set sentry api key, if provided
        if (mergedConfig.sentry_public) {
            baseConfig.logging.sentry_public = mergedConfig.sentry_public;
        }

        settings.setMultiple(Object.assign({}, baseConfig, {pixie: mergedConfig}));
        return new Promise(resolve => resolve());
    }
}

@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ImageEditorUIModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: init_app,
            deps: [Settings, MERGED_CONFIG],
            multi: true,
        },
        {
            provide: ErrorHandler,
            useFactory: noBackendErrorHandlerFactory,
            deps: [Settings],
        },
        StatusBar,
        SplashScreen
    ],
})
export class AppModule {
    constructor(private injector: Injector) {}

    ngDoBootstrap(app: ApplicationRef) {
        const selector = this.injector.get(MERGED_CONFIG).selector;
        app.bootstrap(AppComponent, selector);
    }
}
