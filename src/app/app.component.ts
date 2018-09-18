import {Component, ElementRef, HostBinding, ViewChild, ViewEncapsulation} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {EditorUiService} from './image-editor-ui/editor-ui.service';
import * as svg4everybody from 'svg4everybody';

@Component({
  selector: 'pixie-editor',
  templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('editorVisible', [
            state('true', style({
                opacity: '*',
                display: 'block',
            })),
            state('false', style({
                opacity: '0',
                display: 'none'
            })),
            transition('true <=> false', animate('325ms cubic-bezier(.4,0,.2,1)'))
        ]),
    ]
})
export class AppComponent {

    @ViewChild('overlay') overlay: ElementRef;

    @HostBinding('@editorVisible') get animate() {
        return this.editorUi.isVisible();
    }

    @HostBinding('class.theme-dark') get darkTheme() {
        return this.editorUi.getTheme() === 'dark';
    }

    @HostBinding('class.theme-light') get lightTheme() {
        return this.editorUi.getTheme() === 'light';
    }

    @HostBinding('class.mode-overlay') get overlayMode() {
        return this.editorUi.getMode() === 'overlay';
    }

    @HostBinding('class.mode-inline') get inlineMode() {
        return this.editorUi.getMode() === 'inline';
    }

    @HostBinding('style.width') get width() {
        return this.editorUi.getWidth();
    }

    @HostBinding('style.height') get height() {
        return this.editorUi.getHeight();
    }

    @HostBinding('class.ui-compact') get compact() {
        return this.editorUi.isCompact();
    }

    constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private el: ElementRef,
    private editorUi: EditorUiService,
  ) {
    this.initializeApp();
        this.editorUi.init({root: this.el, overlay: this.overlay});

        // svg icons polyfill
        svg4everybody();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
