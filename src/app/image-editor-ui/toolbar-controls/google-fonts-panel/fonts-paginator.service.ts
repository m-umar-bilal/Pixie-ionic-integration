import {BehaviorSubject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FontCategories} from './font-categories';
import {Settings} from 'vebto-client/core/config/settings.service';
import {FontItem} from './font-item';
import {Injectable} from '@angular/core';

@Injectable()
export class FontsPaginatorService {

    public original: FontItem[] = [];
    public filtered: FontItem[][] = [];

    private readonly defaultCategory = 'handwriting';

    /**
     * Filters for paginator.
     */
    public filters = new FormGroup({
        search: new FormControl(),
        category: new FormControl(this.defaultCategory),
    });

    /**
     * Total number of pages.
     */
    private totalPages: number = 0;

    /**
     * Number of fonts per page.
     */
    private perPage: number = 10;

    /**
     * Current page of paginator.
     */
    public currentPage = 0;

    /**
     * Fonts of current paginator page.
     */
    public current$: BehaviorSubject<FontItem[]> = new BehaviorSubject<FontItem[]>([]);

    constructor(private config: Settings) {
        this.defaultCategory = this.config.get('pixie.tools.text.defaultCategory');
        this.bindToFilters();
    }

    /**
     * Open next google fonts page.
     */
    public next() {
        const nextPage = this.currentPage+1;

        if (this.totalPages > nextPage) {
            this.setPage(this.currentPage + 1);
        }
    }

    /**
     * Open previous google fonts page.
     */
    public previous() {
        const previousPage = this.currentPage - 1;

        if (previousPage > 0) {
            this.setPage(this.currentPage - 1)
        }
    }

    /**
     * Set specified page as current.
     */
    public setPage(page: number) {
        this.currentPage = page;
        this.current$.next(this.filtered[this.currentPage]);
    }

    public filter(category: keyof FontCategories, query?: string) {
        let filtered = [];

        this.original.forEach(font => {
            const matchesQuery = ! query || font.family.toLowerCase().indexOf(query) > -1,
                matchesCategory = font.category.toLowerCase() === category;

            if (matchesCategory && matchesQuery) {
                filtered.push(font);
            }
        });

        this.filtered = this.chunkFonts(filtered);
        this.totalPages = this.filtered.length;
        this.setPage(0);
    }

    /**
     * Set new font items to paginate.
     */
    public setFonts(fonts: FontItem[]) {
        this.original = fonts;
        this.filter(this.filters.get('category').value);
    }

    public reset() {
        this.filters.setValue({
            search: null,
            category: this.defaultCategory
        });

        this.original = [];
        this.totalPages = 0;
        this.currentPage = 0;
        this.current$.next([]);
    }

    /**
     * Split fonts array into page chunks.
     */
    private chunkFonts(fonts: FontItem[]) {
        let chunked = [];

        while (fonts.length > 0) {
            chunked.push(fonts.splice(0, this.perPage));
        }

        return chunked;
    }

    /**
     * Perform a search when user types into search input.
     */
    private bindToFilters() {
        this.filters.valueChanges
            .pipe(debounceTime(100), distinctUntilChanged())
            .subscribe(e => this.filter(e.category, e.search));
    }
}