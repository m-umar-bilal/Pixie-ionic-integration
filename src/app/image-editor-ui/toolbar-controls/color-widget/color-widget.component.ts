import {Component, ElementRef, HostBinding, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ColorpickerPanelComponent} from 'vebto-client/core/ui/color-picker/colorpicker-panel.component';
import {OverlayPanel, PanelConfig} from 'vebto-client/core/ui/overlay-panel/overlay-panel.service';
import {Settings} from 'vebto-client/core/config/settings.service';

@Component({
    selector: 'color-widget',
    templateUrl: './color-widget.component.html',
    styleUrls: ['./color-widget.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: ColorWidgetComponent,
        multi: true,
    }]
})
export class ColorWidgetComponent implements ControlValueAccessor {
    @ViewChild('colorPickerButton', {read: ElementRef}) colorPickerButton: ElementRef;

    @Input() @HostBinding('class.compact') compact: boolean = false;

    /**
     * Currently selected color;
     */
    public selectedColor: string = '#000';

    /**
     * Preset colors to display in the widget.
     */
    public colors: string[];

    public propagateChange: Function;

    /**
     * ColorWidgetComponent Constructor.
     */
    constructor(
        private overlayPanel: OverlayPanel,
        private config: Settings,
    ) {
        this.colors = this.config.get('pixie.ui.colorPresets');
    }

    public changeColor(color: string) {
        this.selectedColor = color;
        this.propagateChange(color);
    }

    /**
     * Open color picker and update color once selected.
     */
    public openColorPicker() {
        const config = {position: 'bottom', hasBackdrop: true, origin: this.colorPickerButton} as PanelConfig;

        this.overlayPanel.open(ColorpickerPanelComponent, config)
            .valueChanged().subscribe(color => this.changeColor(color));
    }

    public writeValue(value: string|null) {
        this.selectedColor = value;
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}
}
