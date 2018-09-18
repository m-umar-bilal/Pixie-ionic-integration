import {InjectionToken} from '@angular/core';
import {Frame} from './tools/frame/frame';
import {BasicShape, defaultShapes} from './tools/shapes/default-shapes';
import {defaultStickers, StickerCategory} from './tools/shapes/default-stickers';
import {BrushSizes, BrushTypes} from './tools/draw/draw-defaults';
import {FontItem} from '../image-editor-ui/toolbar-controls/google-fonts-panel/font-item';

export const MERGED_CONFIG = new InjectionToken<PixieConfig>('MERGED_CONFIG');

export const PIXIE_VERSION = '2.0.7';

export interface NavItem {
    name?: string;
    display_name?: string;
    action?: string|Function|'merge';
    icon?: string;
    type?: 'separator'|'button';
}

export interface PixieConfig {
    selector?: string;
    image?: string|HTMLImageElement;
    blankCanvasSize?: {width: number, height: number};
    watermarkText?: string;
    urls?: {
        base?: string,
        assets?: string,
    };
    ui?: {
        theme: 'dark'|'light',
        mode: 'overlay'|'inline',
        allowEditorClose?: boolean,
        colorPresets?: string[],
        width?: string,
        height?: string,
        compact?: boolean,
        nav: {
            position: 'top'|'bottom'|'none',
            replaceDefault?: boolean,
            items: NavItem[],
        },
        openImageDialog?: {
            show: boolean,
            sampleImages?: {url: string, thumbnail?: string}[],
        },
        toolbar?: {
            hide?: boolean,
            hideOpenButton?: boolean,
            hideCloseButton?: boolean,
            hideSaveButton?: boolean,
            openButtonAction?: Function,
        },
    };
    languages?: {
        custom?: {[key: string]: {[key: string]: string}},
        active: string,
    };
    saveUrl?: string;
    onSave?: Function;
    onLoad?: Function;
    onClose?: Function;
    onOpen?: Function;
    googleFontsApiKey?: string;
    tools?: {
        crop?: {
            replaceDefault?: boolean,
            items: string[],
        },
        draw: {
            replaceDefault?: boolean,
            brushSizes: number[],
            brushTypes: string[],
        }
        text?: {
            replaceDefault?: boolean,
            defaultCategory?: string,
            items: FontItem[],
        }
        frame?: {
            replaceDefault?: boolean,
            items?: Frame[],
        },
        shapes?: {
            replaceDefault?: boolean,
            items?: BasicShape[],
        },
        stickers?: {
            replaceDefault?: boolean,
            items?: StickerCategory[],
        },
        import?: {
            validExtensions?: string[],
        },
        export?: {
            defaultFormat: 'png'|'jpeg'|'json',
            defaultQuality: number,
            defaultName: string,
        },
    };
    objectDefaults?: {
        transparentCorners: boolean,
        borderOpacityWhenMoving: number,
        cornerStyle: 'circle'|'rect'
        cornerColor: string,
        cornerStrokeColor: string,
        cornerSize: number,
        strokeWidth: number,
        lockUniScaling: boolean,
    };
}

export const DEFAULT_CONFIG: PixieConfig  = {
    selector: 'pixie-editor',
    ui: {
        mode: 'inline',
        theme: 'light',
        allowEditorClose: true,
        toolbar: {
            hideOpenButton: false,
            hideCloseButton: true,
        },
        nav: {
            position: 'top',
            replaceDefault: false,
            items: [
                {name: 'filter', icon: 'filter-custom', action: 'filter'},
                {type: 'separator'},
                {name: 'resize', icon: 'resize-custom', action: 'resize'},
                {name: 'crop', icon: 'crop-custom', action: 'crop'},
                {name: 'transform', icon: 'transform-custom', action: 'rotate'},
                {type: 'separator'},
                {name: 'draw', icon: 'pencil-custom', action: 'draw'},
                {name: 'text', icon: 'text-box-custom', action: 'text'},
                {name: 'shapes', icon: 'polygon-custom', action: 'shapes'},
                {name: 'stickers', icon: 'sticker-custom', action: 'stickers'},
                {name: 'frame', icon: 'frame-custom', action: 'frame'},
                {type: 'separator'},
                {name: 'corners', icon: 'rounded-corner-custom', action: 'round'},
                {name: 'background', icon: 'background-custom', action: 'background'},
                {name: 'merge', icon: 'merge-custom', action: 'merge'},
            ]
        },
        openImageDialog: {
            show: true,
            sampleImages: [
                {
                    url: 'assets/images/samples/sample1.jpg',
                    thumbnail: 'assets/images/samples/sample1_thumbnail.jpg',
                },
                {
                    url: 'assets/images/samples/sample2.jpg',
                    thumbnail: 'assets/images/samples/sample2_thumbnail.jpg',
                },
                {
                    url: 'assets/images/samples/sample3.jpg',
                    thumbnail: 'assets/images/samples/sample3_thumbnail.jpg',
                },
            ]
        },
        colorPresets: [
            '#000',
            '#fff',
            'rgb(242, 38, 19)',
            'rgb(249, 105, 14)',
            'rgb(253, 227, 167)',
            'rgb(4, 147, 114)',
            'rgb(30, 139, 195)',
            'rgb(142, 68, 173)',
        ],
    },
    languages: {
        active: 'default',
    },
    googleFontsApiKey: 'AIzaSyDOrI6VJiMbR6XLvlp3CdCPZj1T2PzVkKs',
    objectDefaults: {
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStyle: 'circle',
        cornerColor: '#ccc',
        cornerStrokeColor: '#fff',
        cornerSize: 16,
        strokeWidth: 0.05,
        lockUniScaling: true,
    },
    tools: {
        crop: {
            replaceDefault: false,
            items: ['3:2', '5:3', '4:3', '5:4', '6:4', '7:5', '10:8', '16:9']
        },
        draw: {
            replaceDefault: false,
            brushSizes: BrushSizes,
            brushTypes: BrushTypes,
        },
        shapes: {
            replaceDefault: false,
            items: defaultShapes.slice(),
        },
        stickers: {
            replaceDefault: false,
            items: defaultStickers,
        },
        import: {
            validExtensions: ['png', 'jpg', 'jpeg', 'svg', 'json', 'gif'],
        },
        export: {
            defaultFormat: 'png',
            defaultQuality: 0.8,
            defaultName: 'image',
        },
        frame: {
            replaceDefault: false,
            items: [
                {
                    name: 'basic',
                    mode: 'basic',
                    size: {
                        min: 1,
                        max: 35,
                        default: 10,
                    }
                },
                {
                    name: 'pine',
                    mode: 'stretch',
                    size: {
                        min: 1,
                        max: 35,
                        default: 15,
                    }
                },
                {
                    name: 'oak',
                    mode: 'stretch',
                    size: {
                        min: 1,
                        max: 35,
                        default: 15,
                    }
                },
                {
                    name: 'rainbow',
                    mode: 'stretch',
                    size: {
                        min: 1,
                        max: 35,
                        default: 15,
                    }
                },
                {
                    name: 'grunge1',
                    display_name: 'grunge #1',
                    mode: 'stretch',
                    size: {
                        min: 1,
                        max: 35,
                        default: 15,
                    }
                },
                {
                    name: 'grunge2',
                    display_name: 'grunge #2',
                    mode: 'stretch',
                    size: {
                        min: 1,
                        max: 35,
                        default: 20,
                    }
                },
                {
                    name: 'ebony',
                    mode: 'stretch',
                    size: {
                        min: 1,
                        max: 35,
                        default: 15,
                    }
                },
                {
                    name: 'art1',
                    display_name: 'Art #1',
                    mode: 'repeat',
                    size: {
                        min: 10,
                        max: 70,
                        default: 55,
                    },
                },
                {
                    name: 'art2',
                    display_name: 'Art #2',
                    mode: 'repeat',
                    size: {
                        min: 10,
                        max: 70,
                        default: 55,
                    },
                }
            ]
        }
    }
};
