import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  TemplateRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

export interface ScrubFrame {
  url: string;
}

type PinState = 'before' | 'pinned' | 'after';

@Component({
  selector: 'app-scroll-scrub',
  standalone: true,
  imports: [NgTemplateOutlet],  
  templateUrl: './scroll-scrub.html',
  styleUrl: './scroll-scrub.css',
})
export class ScrollScrub {
  @Input({ required: true }) frames: ScrubFrame[] = [];
  @Input() stageHeightVh = 400;

  // Each <ng-template> passed as content becomes the info overlay for the
  // frame at the same index, so callers can render real, live content
  // (stat lists, team logos) instead of plain strings.
  @ContentChildren(TemplateRef) infoTemplates!: QueryList<TemplateRef<unknown>>;

  private host = inject(ElementRef<HTMLElement>);
  private ticking = false;

  progress = signal(0);
  pinState = signal<PinState>('before');
  pinLeft = signal(0);
  pinWidth = signal(0);

  constructor() {
    afterNextRender(() => this.updateProgress());
  }

  // position: sticky can't be used here because an ancestor in the app
  // shell has overflow:hidden with an auto height, which neutralizes
  // sticky in Chrome/Safari (it never "scrolls" from the sticky element's
  // point of view). So the pin is done manually with position: fixed.
  @HostListener('window:scroll')
  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.updateProgress();
      this.ticking = false;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateProgress();
  }

  frameOpacity(index: number): number {
    if (this.frames.length <= 1) return 1;
    const scaled = this.progress() * (this.frames.length - 1);
    const distance = Math.abs(scaled - index);
    return Math.max(0, 1 - distance);
  }

  // Overlay content can't crossfade the same way images do: two overlapping
  // blocks of text/lists read as garbled noise, unlike two blended photos.
  // So only the nearest frame's info block is ever shown, toggled with a
  // CSS transition instead of following the scroll position continuously.
  isActiveInfo(index: number): boolean {
    if (this.frames.length <= 1) return true;
    const scaled = this.progress() * (this.frames.length - 1);
    return Math.round(scaled) === index;
  }

  private updateProgress() {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const scrollableHeight = rect.height - viewportH;

    if (scrollableHeight <= 0) {
      this.progress.set(0);
      this.pinState.set('before');
      return;
    }

    const raw = -rect.top / scrollableHeight;
    this.progress.set(Math.min(1, Math.max(0, raw)));

    if (rect.top > 0) {
      this.pinState.set('before');
    } else if (rect.bottom <= viewportH) {
      this.pinState.set('after');
    } else {
      this.pinState.set('pinned');
      this.pinLeft.set(rect.left);
      this.pinWidth.set(rect.width);
    }
  }
}
