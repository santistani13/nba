import { Directive, ElementRef, HostBinding, Input, afterNextRender, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective {
  private el = inject(ElementRef<HTMLElement>);

  @Input('appReveal') delayMs: number | string = 0;

  @HostBinding('class.reveal') readonly revealClass = true;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      const delay = Number(this.delayMs) || 0;
      if (delay) {
        node.style.transitionDelay = `${delay}ms`;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add('reveal-visible');
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(node);
    });
  }
}
