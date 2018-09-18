import {Injectable} from '@angular/core';
import {Group, IShadowOptions, IText, Object, Shadow} from 'fabric/fabric-impl';
import {FormControl, FormGroup} from '@angular/forms';
import {fabric} from 'fabric';
import {CanvasStateService} from './canvas-state.service';

@Injectable()
export class ActiveObjectService {

    public defaults = {
        fill: '#eee',
        opacity: 1,
        backgroundColor: '#000',
        stroke: {
            width: 0.1,
            color: '#000',
        },
        shadow: {
            color: '#000',
            blur: 0,
            offsetX: 3,
            offsetY: 3,
        },
        text: {
            align: 'initial',
            underline: false,
            linethrough: false,
            fontStyle: 'normal',
            fontFamily: 'Times New Roman',
            fontWeight: 400,
        }
    };

    public model = new FormGroup({
        fill: new FormControl('#eee'),
        opacity: new FormControl(1),
        backgroundColor: new FormControl('#000'),
        stroke: new FormGroup({
            width: new FormControl(0.1),
            color: new FormControl('#000'),
        }),
        shadow: new FormGroup({
            color: new FormControl('#000'),
            blur: new FormControl(0),
            offsetX: new FormControl(3),
            offsetY: new FormControl(3),
        }),
        text: new FormGroup({
            align: new FormControl('initial'),
            underline: new FormControl(false),
            linethrough: new FormControl(false),
            fontStyle: new FormControl('normal'),
            fontFamily: new FormControl('Times New Roman'),
            fontWeight: new FormControl(400),
        })
    });

    constructor(private canvasState: CanvasStateService) {
        window['activeObject'] = this;
    }

    public getControl(name: string) {
        return this.model.get(name);
    }

    /**
     * Check if active object is text.
     */
    public isText() {
        const obj = this.get();
        return obj && obj.type === 'i-text';
    }

    /**
     * Check if active object (like i-text) is currently being editing by user.
     */
    public isEditing() {
        return this.isText() && (this.get() as IText).isEditing;
    }

    public setValue(name: string, value: any) {
        this.getControl(name).setValue(value);
    }

    public getValue(name: string): string|number {
        return this.getControl(name).value;
    }

    public get() {
        const obj = this.canvasState.fabric.getActiveObject();
        if ( ! obj || ! obj.name) return null;
        if (obj.name.indexOf('crop.') > -1 || obj.name.indexOf('round.') > -1) return null;
        return obj;
    }

    public move(direction: 'top'|'right'|'bottom'|'left', amount: number) {
        const obj = this.get();
        if ( ! obj) return;
        obj.set(direction as any, obj[direction] + amount);
        this.canvasState.fabric.requestRenderAll();
    }

    public bringToFront() {
        const obj = this.get(); if ( ! obj) return;
        obj.bringToFront();
        this.canvasState.fabric.requestRenderAll();
    }

    public sendToBack() {
        const obj = this.get(); if ( ! obj) return;
        obj.sendToBack();
        this.canvasState.fabric.requestRenderAll();
    }

    public flipHorizontal() {
        const obj = this.get(); if ( ! obj) return;
        obj.flipX = !obj.flipX;
        this.canvasState.fabric.requestRenderAll();
    }

    public getId() {
        const obj = this.get();
        return obj && obj.data ? obj.data.id : null;
    }

    public init() {
        this.bindToObjectSelected();
        this.bindToModelChange();
        this.bindToObjectDeselected();
    }

    /**
     * Reset model to default values.
     */
    private bindToObjectDeselected() {
        this.canvasState.fabric.on('selection:cleared', e => {
            this.model.patchValue(this.defaults, {emitEvent: false});
        });
    }

    private bindToObjectSelected() {
        this.canvasState.fabric.on('selection:created', e => {
            const obj = e.target;
            const shadow = (obj.shadow || {}) as Shadow;

            const props = {
                fill: obj.fill,
                opacity: obj.opacity,
                backgroundColor: obj.backgroundColor,
                stroke: {
                    color: obj.stroke,
                    width: obj.strokeWidth
                },
                shadow: {
                    color: shadow.color || this.getControl('shadow.color').value,
                    blur: shadow.blur || this.getControl('shadow.blur').value,
                    offsetX: shadow.offsetX || this.getControl('shadow.offsetX').value,
                    offsetY: shadow.offsetY || this.getControl('shadow.offsetY').value,
                },
                text: {}
            };

            if (obj.type === 'i-text') {
                const text = obj as IText;
                props.text = {
                    align: text.textAlign,
                    underline: text.underline,
                    linethrough: text.strikeThrough,
                    fontStyle: text.fontStyle,
                    fontFamily: text.fontFamily,
                    fontWeight: text.fontWeight,
                }
            }

            this.model.patchValue(props, {emitEvent: false});
        });
    }

    private bindToModelChange() {
        //resize fill color to each svg line separately, so sticker
        //is not recolored when other values like shadow change
        this.getControl('fill').valueChanges.subscribe(color => {
            const obj = this.get();
            if ( ! obj || obj.name !== 'sticker') return;
            (obj as Group).forEachObject(path => path.set('fill', color));
        });

        this.model.valueChanges.subscribe(values => {
            const obj = this.get();
            if ( ! obj) return;

            let props = {
                strokeWidth: values.stroke.width,
                stroke: values.stroke.color,
                fill: values.fill,
                opacity: values.opacity,
                backgroundColor: values.backgroundColor,
            } as any;

            if (this.isText()) {
                props.textAlign = values.text.align;
                props.underline = values.text.underline;
                props.linethrough = values.text.linethrough;
                props.fontStyle = values.text.fontStyle;
                props.fontFamily = values.text.fontFamily;
            }

            obj.set(props);
            this.applyShadow(obj);

            this.canvasState.fabric.requestRenderAll();
        });
    }

    private applyShadow(obj: Object) {
        const values = this.model.get('shadow').value as IShadowOptions,
            shadow = obj.shadow as Shadow;

        if ( ! values.blur || ! values.color) return;

        if ( ! shadow) {
            obj.setShadow(new fabric.Shadow(values));
        } else {
            shadow.blur = values.blur;
            shadow.color = values.color;
            shadow.offsetX = values.offsetX;
            shadow.offsetY = values.offsetY;
        }
    }

    /**
     * Delete currently active fabric object.
     */
    public delete() {
        const obj = this.get();
        if ( ! obj) return;
        this.canvasState.fabric.remove(obj);
        this.canvasState.fabric.requestRenderAll();
    }

    public deselect() {
        this.canvasState.fabric.discardActiveObject();
        this.canvasState.fabric.requestRenderAll();
    }
}