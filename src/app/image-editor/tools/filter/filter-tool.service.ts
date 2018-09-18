import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {Filter, filtersList} from './filters-list';
import {CanvasService} from '../../canvas/canvas.service';
import {IBaseFilter, Image} from 'fabric/fabric-impl';
import {utils} from 'vebto-client/core/services/utils';

@Injectable()
export class FilterToolService {

    /**
     * List of all existing filters.
     */
    private filtersList = filtersList;

    /**
     * FilterToolService Constructor.
     */
    constructor(private canvas: CanvasService) {}

    /**
     * Apply specified filter to canvas.
     */
    public apply(filter: Filter) {
        if (this.applied(filter.name)) return this.remove(filter);

        const newFilter = this.create(filter);

        this.getImages().forEach(image => {
            image.filters.push(newFilter);
            image.applyFilters();
        });

        this.canvas.render();
    }

    public remove(filter: Filter) {
        this.canvas.state.loading = true;

        this.getImages().forEach(image => {
            const i = this.findFilterIndex(filter.name, image.filters);
            image.filters.splice(i, 1);
            image.applyFilters();
        });

        this.canvas.render();
        this.canvas.state.loading = false;
    }

    /**
     * Get all available filters.
     */
    public getAll(): Filter[] {
        return this.filtersList;
    }

    /**
     * Get filter by specified name.
     */
    public getByName(name: string): Filter {
        return this.filtersList.find(filter => filter.name === name);
    }

    public applied(name: string): boolean {
        const mainImage = this.canvas.getMainImage();
        if ( ! mainImage) return;
        return this.findFilterIndex(name, mainImage.filters) > -1;
    }

    /**
     * Find index of filter with specified name in fabric filters list.
     */
    private findFilterIndex(name: string, filters: IBaseFilter[]): number {
        if ( ! filters.length) return;

        const filter = this.getByName(name);

        return filters.findIndex(curr => {
            const type = curr.type.toLowerCase();

            //match by type
            if (type === name.toLowerCase()) return true;

            //match by matrix
            return type === 'convolute' && this.matrixAreEqual(filter.matrix, curr['matrix']);
        });
    }

    /**
     * Check if specified filter matrix arrays are equal.
     */
    private matrixAreEqual(matrix1: number[], matrix2: number[]): boolean {
        if ( ! matrix1 || ! matrix2 || matrix1.length !== matrix2.length) return false;

        for (let i = matrix1.length; i--;) {
            if (matrix1[i] !== matrix2[i]) return false;
        }

        return true;
    }

    /**
     * Apply specified value to currently active filter.
     */
    public applyValue(filter: Filter, optionName: string, optionValue: number|string) {
        this.canvas.state.loading = true;

        this.getImages().forEach(image => {
            const fabricFilter = image.filters.find(curr => {
                return curr.type.toLowerCase() === filter.name.toLowerCase();
            });

            fabricFilter[optionName] = optionValue;

            //filter has a special "resize" function that needs to be invoked
            if (filter.apply) filter.apply(fabricFilter, optionName, optionValue);

            image.applyFilters();
        });

        this.canvas.render();
    }

    public create(filter: Filter): IBaseFilter {
        let newFilter;

        if (filter.uses) {
            newFilter = new fabric.Image.filters[utils.ucFirst(filter.uses)]({ matrix: filter.matrix });
        } else {
            let options = {};

            for (let key in filter.options) {
                options[key] = filter.options[key].current;
            }

            newFilter = new fabric.Image.filters[utils.ucFirst(filter.name)](options);
        }

        return newFilter;
    }

    /**
     * Add a custom filter to fabric.
     */
    public addCustom(name: string, filter: object, options?: object) {
        fabric.Image.filters[name] = fabric.util.createClass(fabric.Image.filters.BaseFilter, filter);
        fabric.Image.filters[name].fromObject = fabric.Image.filters.BaseFilter['fromObject'];
        filtersList.push({name, options});
    }

    private getImages(): Image[] {
        return this.canvas.fabric().getObjects('image') as Image[];
    }
}
