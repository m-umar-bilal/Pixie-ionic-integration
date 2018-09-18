import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {CropZoneService} from '../crop/crop-zone.service';
import {HistoryToolService} from '../../history/history-tool.service';
import { saveAs } from 'file-saver';
import * as b64toBlob from "b64-to-blob";
import {Settings} from 'vebto-client/core/config/settings.service';
import {HttpClient} from '@angular/common/http';
import {WatermarkToolService} from '../watermark-tool.service';
import {Toast} from 'vebto-client/core/ui/toast.service';

type ValidFormats = 'png'|'jpeg'|'json';

@Injectable()
export class ExportToolService {

    private defaultFormat: ValidFormats;
    private defaultQuality: number;
    private defaultName: string;

    /**
     * ExportToolService Constructor.
     */
    constructor(
        private canvas: CanvasService,
        private cropzone: CropZoneService,
        private history: HistoryToolService,
        private config: Settings,
        private http: HttpClient,
        private watermark: WatermarkToolService,
        private toast: Toast,
    ) {
        this.defaultName = this.config.get('pixie.tools.export.defaultName');
        this.defaultFormat = this.config.get('pixie.tools.export.defaultFormat');
        this.defaultQuality = this.config.get('pixie.tools.export.defaultQuality');
    }

    /**
     * Export current editor state in specified format.
     */
    public export(name?: string, format?: ValidFormats, quality?: number) {
        if ( ! name) name = this.defaultName;
        if ( ! format) format = this.defaultFormat;
        if ( ! quality) quality = this.defaultQuality;

        const filename = name + '.' + format;

        const data = this.getWaterMarkedDataUrl(format, quality);

        if ( ! data) return;

        if (this.config.has('pixie.saveUrl')) {
            this.http.post(this.config.get('pixie.saveUrl'), {data, filename, format});
        } else if (this.config.has('pixie.onSave')) {
            (this.config.get('pixie.onSave') as Function)(data, filename, format);
        } else {
            this.getCanvasBlob(format, data).then(blob => {
                saveAs(blob, filename);
            });
        }
    }

    private getCanvasBlob(format: ValidFormats, data: string): Promise<Blob> {
        return new Promise(resolve => {
            let blob;

            if (format === 'json') {
                blob = new Blob([data], {type: "application/json"});
            } else {
                const contentType = 'image/'+format;
                data = data.replace('data:'+contentType+';base64,', '');
                blob = (b64toBlob as any)(data, contentType);
            }

            resolve(blob);
        });
    }

    /**
     * Export current editor state as data url.
     */
    public getDataUrl(format: ValidFormats = this.defaultFormat, quality: number = this.defaultQuality): string {
        this.prepareCanvas();

        if (format === 'json') {
            return this.getJsonState();
        }

        try {
            return this.canvas.fabric().toDataURL({
                format: format,
                quality: quality,
                multiplier: this.canvas.state.original.width / this.canvas.fabric().getWidth(),
            });
        } catch(e) {
            if (e.message.toLowerCase().indexOf('tainted') === -1) return null;
            this.toast.open('Could not export canvas with external image.');
        }
    }

    private getJsonState(): string {
        return JSON.stringify(this.history.getCurrentCanvasState());
    }

    private prepareCanvas() {
        this.canvas.fabric().discardActiveObject();
        this.canvas.pan.reset();
        this.cropzone.remove();
    }

    /**
     * Get data url with added watermark.
     */
    public getWaterMarkedDataUrl(format: ValidFormats, quality: number) {
        if (this.config.has('pixie.watermarkText')) {
            this.watermark.add(this.config.get('pixie.watermarkText'));
        }

        const data = this.getDataUrl(format, quality);

        this.watermark.remove();

        return data;
    }
}