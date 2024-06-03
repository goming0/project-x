import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  Inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IntersectionService } from '../../service/intersection.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './imageSlider.component.html',
  styleUrls: ['./imageSlider.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSliderComponent implements AfterViewInit {
  @ViewChild('lazyLoadTag') private lazyLoadTag?: ElementRef<HTMLImageElement>;

  @ViewChild('sliderEl') private sliderEl?: ElementRef<HTMLDivElement>;

  @Input() slides: string[] = [];

  // @Input() imageObserver?: IntersectionObserver;

  @Input() isShowDot = true;

  @Output() clickOnImage: EventEmitter<void> = new EventEmitter();

  private imagesIsLoaded: number[] = [0];

  public currentIndex = 0;

  constructor(
    @Inject('IsNotMobileDeviceService') public isNotMobileDevice: boolean,
    private imageLoaderService: IntersectionService,
  ) {}

  ngAfterViewInit(): void {
    this.imageLoaderService.imageObserver.observe(this.lazyLoadTag?.nativeElement as unknown as Element);
  }

  showDots(): boolean {
    return this.isShowDot && this.slides.length > 1;
  }

  currentSlideForDot(slideIndex: number): string {
    if (slideIndex === this.currentIndex) {
      return '#316cf4';
    }
    return '#656565';
  }

  goToPrevious(): void {
    if (this.currentIndex !== 0) {
      const img = this.sliderEl!.nativeElement.getElementsByTagName('img')[0];
      this.currentIndex -= 1;
      this.sliderEl!.nativeElement.style.transform = `translate(-${img.width * this.currentIndex}px, 0px)`;
    }
  }

  goToNext(): void {
    if (this.currentIndex < this.slides.length - 1) {
      const img = this.sliderEl!.nativeElement.getElementsByTagName('img')[0];
      this.currentIndex += 1;
      this.sliderEl!.nativeElement.style.transform = `translate(-${img.width * this.currentIndex}px, 0px)`;
    }
  }

  goToSlide(slideIndex: number): void {
    this.preloadImages(slideIndex);
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl() {
    return `url('${this.slides[this.currentIndex]}')`;
  }

  onClickToImage() {
    this.clickOnImage.emit();
  }

  private preloadImages(index: number) {
    if (index !== this.slides.length) {
      if (!this.imagesIsLoaded.includes(index)) {
        const image = new Image();
        image.src = this.slides[index];
        this.imagesIsLoaded.push(index);
      }
    }
  }
}
