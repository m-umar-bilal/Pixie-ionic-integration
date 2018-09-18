import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {Image, Image as FImage, Object} from 'fabric/fabric-impl';
import {Observable} from 'rxjs';
import {CanvasPanService} from './canvas-pan.service';
import {ActiveObjectService} from './active-object.service';
import {CanvasZoomService} from './canvas-zoom.service';
import {utils} from 'vebto-client/core/services/utils';
import {Settings} from 'vebto-client/core/config/settings.service';
import {staticObjectConfig} from '../objects/static-object-config';
import {CanvasStateService} from './canvas-state.service';

@Injectable()
export class CanvasService {

    private readonly minWidth: number = 50;
    private readonly minHeight: number = 50;

    /**
     * CanvasService Constructor.
     */
    constructor(
        public pan: CanvasPanService,
        public zoom: CanvasZoomService,
        public state: CanvasStateService,
        public activeObject: ActiveObjectService,
        private config: Settings,
    ) {}

    /**
     * Render fabric canvas.
     */
    public render() {
        this.state.fabric.requestRenderAll();
    }

    /**
     * Get fabric instance.
     */
    public fabric(): fabric.Canvas {
        return this.state.fabric;
    }

    /**
     * Get object matching specified id.
     */
    public getObjectById(id: string): Object|null {
        return this.state.fabric.getObjects().find(obj => {
            return obj.data && obj.data.id === id;
        });
    }

    public init(): Observable<any> {
        const canvasEl = document.querySelector('canvas') as HTMLCanvasElement;
        this.state.fabric = new fabric.Canvas(canvasEl);

        this.state.fabric.selection = false;
        this.state.fabric.renderOnAddRemove = false;

        const objectDefaults = this.config.get('pixie.objectDefaults');

        for (let key in objectDefaults) {
            fabric.Object.prototype[key] = objectDefaults[key];
        }

        //add ID to all objects
        this.state.fabric.on('object:added', e => {
            if (e.target.data && e.target.data.id) return;
            if ( ! e.target.data) e.target.data = {};
            e.target.data.id = utils.randomString(10);
        });

        this.pan.init();
        this.zoom.init();
        this.activeObject.init();

        this.initContent().then(() => this.state.loaded.next(null));

        return this.state.loaded;
    }

    public initContent(): Promise<any>|null {
        let image = this.config.get('pixie.image');
        if (image instanceof HTMLImageElement) image = image.src;
        const size = this.config.get('pixie.blankCanvasSize');

        if (image) {
            return this.loadMainImage(image);
        } else if (size) {
            return this.openNew(size.width, size.height);
        }

        return new Promise(resolve => resolve());
    }

    public resize(width: number, height: number) {
        this.state.fabric.setWidth(width * this.zoom.get());
        this.state.fabric.setHeight(height * this.zoom.get());
        this.state.original.width = width;
        this.state.original.height = height;
    }

    public loadMainImage(url: string): Promise<Image> {
        return new Promise(resolve => {
            this.loadImage(url).then(img => {
                this.fabric().clear();
                img.set(staticObjectConfig);
                img.name = 'mainImage';
                this.state.fabric.add(img);
                this.resize(img.width, img.height);
                this.zoom.fitToScreen();
                resolve(img);
            })
        });
    }

    public changeMainImage(data: string): Promise<Image> {
        const mainImage = this.getMainImage();

        return new Promise(resolve => {
            if ( ! mainImage) resolve(null);

            mainImage.setSrc(data, () => {
                mainImage.setCoords();
                this.resize(mainImage.width, mainImage.height);
                this.render();
                resolve(mainImage);
            });
        })
    }

    public loadImage(data: string): Promise<Image> {
        return new Promise(resolve => {
            fabric.util.loadImage(data, img => resolve(new fabric.Image(img)));
        });
    }

    /**
     * Create a blank canvas with specified dimensions.
     */
    public openNew(width: number, height: number): Promise<any> {
        width = width < this.minWidth ? this.minWidth : width;
        height = height < this.minHeight ? this.minHeight : height;

        this.state.fabric.clear();
        this.resize(width, height);

        return new Promise(resolve => {
            setTimeout(() => {
                this.zoom.fitToScreen();
                resolve();
            });
        })
    }

    /**
     * Open image at given url in canvas.
     */
    public openImage(url): Promise<Image> {
        return new Promise(resolve => {
            fabric.util.loadImage(url, image => {
                if ( ! image) return;

                let object = new fabric.Image(image);
                object.name = 'image';

                //use either main image or canvas dimensions as outter boundaries for scaling new image
                let maxWidth  = this.state.original.width,
                    maxHeight = this.state.original.height;

                //if image is wider or higher then the current canvas, we'll scale it down
                if (object.width >= maxWidth || object.height >= maxHeight) {

                    //calc new image dimensions (main image height - 10% and width - 10%)
                    let newWidth  = maxWidth - (0.1 * maxWidth),
                        newHeight = maxHeight - (0.1 * maxHeight),
                        scale     = 1 / (Math.min(newHeight / object.getScaledHeight(), newWidth / object.getScaledWidth()));

                    //scale newly uploaded image to the above dimensions
                    object.scaleX = object.scaleX * (1 / scale);
                    object.scaleY = object.scaleY * (1 / scale);
                }

                //center and render newly uploaded image on the canvas
                this.state.fabric.add(object);
                object.viewportCenter();
                object.setCoords();
                this.render();
                this.zoom.fitToScreen();
                resolve(object);
            });
        })
    }

    /**
     * Get main image object, if it exists.
     */
    public getMainImage(): FImage {
        return this.state.fabric.getObjects()
            .find(obj => obj.name === 'mainImage') as FImage;
    }
}
