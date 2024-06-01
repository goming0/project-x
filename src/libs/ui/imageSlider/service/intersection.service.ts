import { Injectable } from '@angular/core';

const options = {
  // root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  // threshold: 1.0,
};

@Injectable({
  providedIn: 'root',
})
export class IntersectionService {
  public imageObserver = new IntersectionObserver(this.imageLazyLoadingHandler, options);

  imageLazyLoadingHandler(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    for (let i = 0; i < entries.length; i++) {
      const element = entries[i];
      if (element.isIntersecting) {
        const src = element.target.getAttribute('data-src');
        const preload = element.target.getAttribute('data-src-preload');
        if (src && preload) {
          (element.target as HTMLElement).style.backgroundImage = src;
          const image = new Image();
          image.src = preload;
          element.target.removeAttribute('data-src');
          element.target.removeAttribute('data-src-preload');
          observer.unobserve(element.target);
        }
      }
    }
  }
}
