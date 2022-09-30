import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  ComponentFixture,
  // fakeAsync,
  // flush,
  TestBed,
} from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
// import { animationFrameScheduler } from 'rxjs';
// import { FixedSizeTableVirtualScrollStrategy } from './fixed-size-table-virtual-scroll-strategy';
import { TableVirtualScrollDataSource } from './table-data-source';
import { TableItemSizeDirective } from './table-item-size.directive';
import { MrlonisTableVirtualScrollModule } from './table-virtual-scroll.module';

@Component({
  template: `
    <div class="test">
      <cdk-virtual-scroll-viewport
        mrlonisTvsItemSize="10"
        headerHeight="20"
        footerHeight="15"
        bufferMultiplier="0.5"
        [headerEnabled]="headerEnabled"
        [footerEnabled]="footerEnabled"
        class="wrapper"
        scrollWindow
      >
        <table mat-table [dataSource]="dataSource">
          <ng-container *ngIf="headerEnabled">
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          </ng-container>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          <ng-container *ngIf="footerEnabled">
            <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
          </ng-container>

          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>No.</th>
            <td mat-cell *matCellDef="let element">el - {{ element.id }}</td>
            <td mat-footer-cell *matFooterCellDef class="footer-cell">End.</td>
          </ng-container>
        </table>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [
    `
      .test {
        height: 1000px;
        width: 1000px;
      }

      .wrapper {
        height: 40px;
      }

      tr {
        height: auto !important;
      }

      th {
        height: 20px !important;
      }

      td {
        height: 10px !important;
      }

      th,
      td {
        padding: 0 !important;
        margin: 0 !important;
        border-width: 0 !important;
        border-style: none !important;
        font-size: 8px;
      }

      .footer-cell {
        height: 15px !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
class TableVirtualScrollComponent {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport!: CdkVirtualScrollViewport;

  @ViewChild(TableItemSizeDirective, { static: true })
  directive!: TableItemSizeDirective;

  displayedColumns = ['id'];

  dataSource = new TableVirtualScrollDataSource(
    Array(50)
      .fill(0)
      .map((_, i) => ({ id: i }))
  );

  headerEnabled = true;
  footerEnabled = false;

  changeDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(
      Array(50)
        .fill(0)
        .map((_, i) => ({ id: i + 50 }))
    );
  }
}

/** Finish initializing the virtual scroll component at the beginning of a test. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function finishInit(fixture: ComponentFixture<any>) {
//   // On the first cycle we render and measure the viewport.
//   fixture.detectChanges();
//   flush();

//   // On the second cycle we render the items.
//   fixture.detectChanges();
//   flush();

//   // Flush the initial fake scroll event.
//   animationFrameScheduler.flush();
//   flush();
//   fixture.detectChanges();
// }

/** Trigger a scroll event on the viewport (optionally setting a new scroll offset). */
// function triggerScroll(viewport: CdkVirtualScrollViewport, offset?: number) {
//   if (offset !== undefined) {
//     viewport.scrollToOffset(offset);
//   }
//   animationFrameScheduler.flush();
// }

// function dispatchFakeEvent(node: Node | Window, type: string, canBubble = false, cancelable = true): Event {
//   const event = createFakeEvent(type, canBubble, cancelable);
//   document.dispatchEvent(event);
//   return event;
// }

// function createFakeEvent(type: string, canBubble = false, cancelable = true) {
//   return new Event(type, { bubbles: canBubble, cancelable: cancelable });
// }

describe('TableItemSizeDirective', () => {
  let fixture: ComponentFixture<TableVirtualScrollComponent>;
  // let testComponent: TableVirtualScrollComponent;
  // let viewport: CdkVirtualScrollViewport;
  // let strategy: FixedSizeTableVirtualScrollStrategy;
  let directive: TableItemSizeDirective;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ScrollingModule, MatTableModule, MrlonisTableVirtualScrollModule],
      declarations: [TableVirtualScrollComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableVirtualScrollComponent);
    // testComponent = fixture.componentInstance;
    // viewport = testComponent.viewport;
    // strategy = testComponent.directive.scrollStrategy;
    const directiveEl = fixture.debugElement.query(By.directive(TableItemSizeDirective));
    directive = directiveEl.injector.get(TableItemSizeDirective) as TableItemSizeDirective;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  // it('should init correct state', fakeAsync(() => {
  //   finishInit(fixture);

  //   const tbody = fixture.nativeElement.querySelector('tbody');

  //   expect(tbody.children.length).toBe(
  //     8
  //     // 'should render 8 10px row to fill 40px + 40px * 0.5 (buffer before) + 40px * 0.5 (buffer after) space'
  //   );
  // }));

  // it('get the rendered range', fakeAsync(() => {
  //   finishInit(fixture);

  //   expect(viewport.getRenderedRange()).toEqual(
  //     { start: 0, end: 8 }
  //     // 'should render 8 10px row to fill 40px + 40px * 0.5 (buffer before) + 40px * 0.5 (buffer after) space'
  //   );
  // }));

  // it('should set the correct rendered range on scroll', fakeAsync(() => {
  //   finishInit(fixture);

  //   viewport.scrollToOffset(100);

  //   dispatchFakeEvent(viewport.elementRef.nativeElement, 'scroll');
  //   animationFrameScheduler.flush();
  //   fixture.detectChanges();
  //   flush();

  //   expect(viewport.getRenderedRange()).toEqual(
  //     { start: 8, end: 16 }
  //     // 'scrolled ten items down, so items 10-14 should be visible, with items 8-16 rendered in the buffer'
  //   );
  // }));

  // it('should subscribe and rerender after dataSource is changed', fakeAsync(() => {
  //   finishInit(fixture);
  //   const tbody = fixture.nativeElement.querySelector('tbody');

  //   expect(tbody.children[0].children[0].innerHTML).toBe('el - 0');

  //   testComponent.changeDataSource();
  //   fixture.detectChanges();
  //   flush();

  //   expect(tbody.children[0].children[0].innerHTML).toBe('el - 50');
  // }));

  // it('should have correct height by default', fakeAsync(() => {
  //   finishInit(fixture);

  //   expect(viewport.elementRef.nativeElement.scrollHeight).toEqual(
  //     520
  //     // 'default height is incorrect'
  //   );
  // }));

  // it('should have correct height with footer', fakeAsync(() => {
  //   testComponent.footerEnabled = true;
  //   finishInit(fixture);

  //   expect(viewport.elementRef.nativeElement.scrollHeight).toEqual(
  //     535
  //     // 'height with footer is incorrect'
  //   );
  // }));

  // it('should have correct height without header', fakeAsync(() => {
  //   testComponent.headerEnabled = false;
  //   testComponent.footerEnabled = false;
  //   finishInit(fixture);

  //   expect(viewport.elementRef.nativeElement.scrollHeight).toEqual(
  //     500
  //     // 'height without footer and header is incorrect'
  //   );

  //   fixture.destroy();
  // }));
});
