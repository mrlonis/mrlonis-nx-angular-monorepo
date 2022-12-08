/* eslint-disable import/no-deprecated */
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { CdkHeaderRowDef } from '@angular/cdk/table';
import { AfterContentInit, ContentChild, Directive, forwardRef, Input, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { combineLatest, from, Subject } from 'rxjs';
import { delayWhen, distinctUntilChanged, filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { FixedSizeTableVirtualScrollStrategy } from './fixed-size-table-virtual-scroll-strategy';
import { NgxTableVirtualScrollDataSource } from './ngx-table-data-source';

export function _tableVirtualScrollDirectiveStrategyFactory(tableDir: TableItemSizeDirective) {
  return tableDir.scrollStrategy;
}

const stickyHeaderSelector = '.mat-header-row .mat-table-sticky, .mat-header-row.mat-table-sticky';
const stickyFooterSelector = '.mat-footer-row .mat-table-sticky, .mat-header-row.mat-table-sticky';

const defaults = {
  rowHeight: 48,
  headerHeight: 56,
  headerEnabled: true,
  footerHeight: 48,
  footerEnabled: false,
  bufferMultiplier: 0.7
};

@Directive({
  selector: 'cdk-virtual-scroll-viewport[mrlonisTvsItemSize]',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: _tableVirtualScrollDirectiveStrategyFactory,
      deps: [forwardRef(() => TableItemSizeDirective)]
    }
  ]
})
export class TableItemSizeDirective implements OnChanges, AfterContentInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  // tslint:disable-next-line:no-input-rename
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mrlonisTvsItemSize')
  rowHeight: string | number = defaults.rowHeight;

  @Input()
  headerEnabled: boolean = defaults.headerEnabled;

  @Input()
  headerHeight: string | number = defaults.headerHeight;

  @Input()
  footerEnabled: boolean = defaults.footerEnabled;

  @Input()
  footerHeight: string | number = defaults.footerHeight;

  @Input()
  bufferMultiplier: string | number = defaults.bufferMultiplier;

  @ContentChild(MatTable, { static: false })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table!: MatTable<any>;

  scrollStrategy = new FixedSizeTableVirtualScrollStrategy();

  dataSourceChanges = new Subject<void>();

  private stickyPositions = new Map<HTMLElement, number>();
  private resetStickyPositions = new Subject<void>();

  constructor(private zone: NgZone) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.dataSourceChanges.complete();
  }

  private isStickyEnabled(): boolean {
    return (
      !!this.scrollStrategy.viewport &&
      (this.table['_headerRowDefs'] as CdkHeaderRowDef[])
        .map((def) => def.sticky)
        .reduce((prevState, state) => prevState && state, true)
    );
  }

  ngAfterContentInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const switchDataSourceOrigin = this.table['_switchDataSource'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.table['_switchDataSource'] = (dataSource: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      switchDataSourceOrigin.call(this.table, dataSource);
      this.connectDataSource(dataSource);
    };

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const updateStickyColumnStylesOrigin = this.table.updateStickyColumnStyles;
    this.table.updateStickyColumnStyles = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const stickyColumnStylesNeedReset = this.table['_stickyColumnStylesNeedReset'];
      updateStickyColumnStylesOrigin.call(this.table);
      if (stickyColumnStylesNeedReset) {
        this.resetStickyPositions.next();
      }
    };

    this.connectDataSource(this.table.dataSource);

    combineLatest([
      this.scrollStrategy.stickyChange,
      this.resetStickyPositions.pipe(
        startWith(void 0),
        delayWhen(() => this.getScheduleObservable()),
        tap(() => {
          this.stickyPositions = new Map<HTMLElement, number>();
        })
      )
    ])
      .pipe(
        filter(() => this.isStickyEnabled()),
        takeUntil(this.destroyed$)
      )
      .subscribe(([stickyOffset]) => {
        if (!this.stickyPositions) {
          this.initStickyPositions();
        }
        this.setSticky(stickyOffset);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectDataSource(dataSource: any) {
    this.dataSourceChanges.next();
    if (dataSource instanceof NgxTableVirtualScrollDataSource) {
      dataSource.dataToRender$
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.dataSourceChanges),
          takeUntil(this.destroyed$),
          tap((data) => (this.scrollStrategy.dataLength = data.length)),
          switchMap((data) =>
            this.scrollStrategy.renderedRangeStream.pipe(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              map(({ start, end }) => (typeof start !== 'number' || typeof end !== 'number' ? data : data.slice(start, end)))
            )
          )
        )
        .subscribe((data) => {
          this.zone.run(() => {
            dataSource.dataOfRange$.next(data);
          });
        });
    } else {
      throw new Error(
        '[mrlonisTvsItemSize] requires MrlonisTableVirtualScrollDataSource be set as [dataSource] of [mat-table]'
      );
    }
  }

  ngOnChanges() {
    const config = {
      rowHeight: +this.rowHeight || defaults.rowHeight,
      headerHeight: this.headerEnabled ? +this.headerHeight || defaults.headerHeight : 0,
      footerHeight: this.footerEnabled ? +this.footerHeight || defaults.footerHeight : 0,
      bufferMultiplier: +this.bufferMultiplier || defaults.bufferMultiplier
    };
    this.scrollStrategy.setConfig(config);
  }

  setSticky(offset: number) {
    this.scrollStrategy.viewport.elementRef.nativeElement
      .querySelectorAll(stickyHeaderSelector)
      .forEach((value: Element, _key: number, _parent: NodeListOf<Element>) => {
        const parentElement = value.parentElement;
        let baseOffset = 0;
        if (parentElement !== null && this.stickyPositions.has(parentElement)) {
          baseOffset = this.stickyPositions.get(parentElement) ?? 0;
        }
        (value as HTMLElement).style.top = `${baseOffset - offset}px`;
      });
    this.scrollStrategy.viewport.elementRef.nativeElement
      .querySelectorAll(stickyFooterSelector)
      .forEach((value: Element, _key: number, _parent: NodeListOf<Element>) => {
        const parentElement = value.parentElement;
        let baseOffset = 0;
        if (parentElement !== null && this.stickyPositions.has(parentElement)) {
          baseOffset = this.stickyPositions.get(parentElement) ?? 0;
        }
        (value as HTMLElement).style.bottom = `${-baseOffset + offset}px`;
      });
  }

  private initStickyPositions() {
    this.stickyPositions = new Map<HTMLElement, number>();
    this.scrollStrategy.viewport.elementRef.nativeElement.querySelectorAll(stickyHeaderSelector).forEach((el) => {
      const parent = el.parentElement;
      if (parent !== null && !this.stickyPositions.has(parent)) {
        this.stickyPositions.set(parent, parent.offsetTop);
      }
    });
    this.scrollStrategy.viewport.elementRef.nativeElement.querySelectorAll(stickyFooterSelector).forEach((el) => {
      const parent = el.parentElement;
      if (parent !== null && !this.stickyPositions.has(parent)) {
        this.stickyPositions.set(parent, -parent.offsetTop);
      }
    });
  }

  private getScheduleObservable() {
    // Use onStable when in the context of an ongoing change detection cycle so that we
    // do not accidentally trigger additional cycles.
    return this.zone.isStable ? from(Promise.resolve(undefined)) : this.zone.onStable.pipe(take(1));
  }
}
