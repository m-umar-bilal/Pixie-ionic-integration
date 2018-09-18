import {NgModule} from '@angular/core';
import {GoogleFontsPanelComponent} from './google-fonts-panel.component';
import {SvgIconModule} from 'vebto-client/core/ui/svg-icon/svg-icon.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {GoogleFontsPanelService} from './google-fonts-panel.service';
import {FontsPaginatorService} from './fonts-paginator.service';
import {MapToIterableModule} from 'vebto-client/core/ui/map-to-iterable/map-to-iterable.module';

@NgModule({
    imports: [
        SvgIconModule,
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        MapToIterableModule,
    ],
    entryComponents: [
        GoogleFontsPanelComponent,
    ],
    declarations: [
        GoogleFontsPanelComponent,
    ],
    providers: [
        GoogleFontsPanelService,
        FontsPaginatorService,
    ],
    exports: [
        GoogleFontsPanelComponent,
    ],
})
export class GoogleFontsModule {
}
