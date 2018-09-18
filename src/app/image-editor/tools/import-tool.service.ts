import {Injectable} from '@angular/core';
import {FileValidator} from 'vebto-client/core/files/file-validator';
import {HistoryToolService} from '../history/history-tool.service';
import {CanvasService} from '../canvas/canvas.service';
import {Toast} from 'vebto-client/core/ui/toast.service';
import {Uploads} from 'vebto-client/core/files/uploads.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {FrameToolService} from './frame/frame-tool.service';
import {CropZoneService} from './crop/crop-zone.service';
import {Image} from 'fabric/fabric-impl';

@Injectable()
export class ImportToolService {

    /**
     * ExportToolService Constructor.
     */
    constructor(
        private validator: FileValidator,
        private history: HistoryToolService,
        private canvas: CanvasService,
        private toast: Toast,
        private uploads: Uploads,
        private config: Settings,
        private frame: FrameToolService,
        private cropzone: CropZoneService,
    ) {
        this.validator.rules.whitelist = this.config.get('pixie.tools.import.validExtensions');
    }

    /**
     * Open upload dialog, import selected file and open it in editor.
     */
    public openUploadDialog(options: {type?: 'image'|'state', backgroundImage?: boolean} = {type: 'image'}): Promise<any> {
        const accept = this.getUploadAcceptString(options.type);

        return new Promise(resolve => {
            this.uploads.openUploadDialog({accept}).then(files => {
                this.validateAndGetData(files[0]).then(file => {
                    if (options.backgroundImage && file.extension !== 'json') {
                        this.openBackgroundImage(file.data).then(obj => resolve(obj));
                    } else {
                        this.openFile(file.data, file.extension).then(obj => resolve(obj));
                    }
                });
            });
        })
    }

    /**
     * Open upload dialog, import file and return files data.
     */
    public importAndGetData(): Promise<string> {
        return new Promise(resolve => {
            this.uploads.openUploadDialog().then(files => {
                this.validateAndGetData(files[0]).then(file => resolve(file.data));
            });
        });
    }

    /**
     * File specified file and if it passes, return files data.
     */
    public validateAndGetData(file: File): Promise<{ data: string, extension: string }> {
        const errors = this.validator.validateFile(file),
            extension = FileValidator.getFileNameAndExtension(file.name).extension;

        return new Promise((resolve, reject) => {
            if (errors) {
                reject();
                return this.toast.open('Unsupported file type.');
            }

            this.readFile(file, extension).then(data => resolve({data, extension}));
        });
    }

    /**
     * Load specified pixie state data into editor.
     */
    public openStateFile(data: string): Promise<any> {
        return this.resetEditor().then(() => {
            return this.history.addFromJson(data);
        });
    }

    public resetEditor(): Promise<any> {
        this.canvas.fabric().clear();
        this.frame.remove();
        this.cropzone.remove();
        this.history.clear();
        return new Promise(resolve => setTimeout(() => resolve()));
    }

    /**
     * Open specified data or image element in editor.
     */
    public openFile(data: string|HTMLImageElement, extension: string = 'png'): Promise<Image|void> {
        if (data instanceof HTMLImageElement) data = data.src;

        if (extension === 'json') {
            return this.openStateFile(data);
        } else {
            return this.canvas.openImage(data);
        }
    }

    /**
     * Open specified data or image as background image.
     */
    public openBackgroundImage(data: string|HTMLImageElement): Promise<Image> {
        if (data instanceof HTMLImageElement) data = data.src;

        const mainImage = this.canvas.getMainImage();

        if (mainImage) {
            return this.canvas.changeMainImage(data);
        } else {
            return this.canvas.loadMainImage(data);
        }
    }

    /**
     * Read specified file and get its data.
     */
    private readFile(file: File, extension: string): Promise<string> {
        const reader = new FileReader();

        return new Promise(resolve => {
            reader.addEventListener('load', () => {
                resolve(reader.result);
            });

            if (extension === 'json') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        });
    }

    private getUploadAcceptString(type: 'image'|'state'|'all' = 'all'): string {
        switch (type) {
            case 'image':
                return 'image/*';
            case 'state':
                return '.json,application/json';
            case 'all':
            default:
                return 'image/*,.json,application/json';
        }
    }
}