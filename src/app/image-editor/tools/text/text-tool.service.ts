import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {CanvasService} from '../../canvas/canvas.service';
import {IText} from 'fabric/fabric-impl';
import {ActiveObjectService} from '../../canvas/active-object.service';
import {ObjectsService} from '../../objects/objects.service';
import {FontItem} from '../../../image-editor-ui/toolbar-controls/google-fonts-panel/font-item';

@Injectable()
export class TextToolService {

    private readonly minWidth: number = 250;

    /**
     * TextToolService Constructor.
     */
    constructor(
        private canvas: CanvasService,
        private activeObject: ActiveObjectService,
        private objects: ObjectsService,
    ) {}

    /**
     * Get specified style property of text.
     */
    public getStyle(name: string): string|number {
        return this.activeObject.getValue('text.'+name);
    }

    /**
     * Add a new text object to canvas.
     */
    public add(text = 'Double click here') {
        const options = Object.assign(
            {fill: 'rgb(30, 139, 195)'},
            {name: 'text', lockUniScaling: true}
        );

        const itext = new fabric.IText(text, options);
        this.canvas.fabric().add(itext);
        this.autoPositionText(itext);

        this.canvas.fabric().setActiveObject(itext);
        this.canvas.render();
    }

    /**
     * Auto position newly added text at center of canvas.
     */
    private autoPositionText(text: IText) {
        const canvasWidth = this.canvas.fabric().getWidth(),
              canvasHeight = this.canvas.fabric().getHeight();

        //make sure min width is not larger then canvas width
        const minWidth = Math.min(this.canvas.fabric().getWidth(), this.minWidth);

        text.scaleToWidth(Math.max(canvasWidth / 3, minWidth));

        //make sure text is not scaled outside canvas
        if (text.getScaledHeight() > canvasHeight) {
            text.scaleToHeight(canvasHeight - text.getScaledHeight() - 20);
        }

        text.viewportCenter();

        //push text down, if it intersects with another text object
        this.canvas.fabric().getObjects('i-text').forEach(obj => {
            if (obj === text) return;
            if (obj.intersectsWithObject(text)) {
                let offset = (obj.top - text.top) + obj.getScaledHeight(),
                    newTop = text.top + offset;

                //if pushing object down would push it outside canvas, position text at top of canvas
                if (newTop > this.canvas.state.original.height - obj.getScaledHeight()) {
                    newTop = 0;
                }

                text.set('top', newTop);
                text.setCoords();
            }
        });
    }

    /**
     * Set specified font family on active object.
     */
    public setFont(font: FontItem) {
        if ( ! this.activeObject.isText()) return;
        this.activeObject.get().data.font = font;
        this.activeObject.setValue('text.fontFamily', font.family);
    }

    /**
     * Get all custom fonts used on canvas.
     */
    public getUsedFonts(): FontItem[] {
        const fonts = [];

        this.objects.getAll()
            .filter(obj => obj.type === 'i-text')
            .forEach((obj: IText) => {
                if ( ! obj.data.font || obj.data.font.type === 'regular') return;
                fonts.push(obj.data.font);
            });

        return fonts;
    }
}
