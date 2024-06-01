import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { FBaseService } from '../services/fireStore/fbase.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../types/products';
import { CloudStoreService } from '../services/fireCloudStore/cloudStore.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css'],
})
export class AdminMainComponent implements OnInit {
  @ViewChild('addFiles') addFiles?: ElementRef<HTMLInputElement>;

  constructor(private fBaseService: FBaseService, private cloudService: CloudStoreService) {
    this.activeBlock = 'add';
  }

  /////////////проверка блока///////
  setActiveBlock(blockName: string) {
    if (blockName === 'add') {
      this.showForm = true;
    } else if (blockName === 'delete') {
      this.showForm = false;
    }
    this.activeBlock = blockName;
  }

  activeBlock = '';

  showErrorMessage = false;

  showForm = true;

  showSection = false;

  /////////////////////////////форма//////////////////////////

  selectedFiles: File[] = [];

  size8 = false;

  size9 = false;

  size10 = false;

  size11 = false;

  size12 = false;

  size13 = false;

  size14 = false;

  size15 = false;

  selectedCategory = 'All';

  // setSelectedCategory(category: string) {
  //   this.selectedCategory = category;
  // }

  // isProductMatchingCategory(product: Product): boolean {
  //   return this.selectedCategory === 'All' || product.typeModel === this.selectedCategory;
  // }

  onFileInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList = inputElement.files;
    if (fileList) {
      this.selectedFiles = Array.from(fileList);
      // Извлекаем названия файлов и сохраняем их в imagesUrls
      this.formData.imagesUrls = this.selectedFiles.map((file) => file.name);
    }
  }

  // validateInput
  validateLettersAndSpaces(event: KeyboardEvent) {
    const allowedKeys = [32]; // Коды клавиш: 32 - пробел
    const allowedCharacters = /[a-zA-Z\s]/; // Разрешенные символы: буквы и пробел

    if (!allowedKeys.includes(event.keyCode) && !allowedCharacters.test(event.key)) {
      event.preventDefault();
    }
  }

  validateLettersSpacesAndNumbers(event: KeyboardEvent) {
    const allowedKeys = [32]; // Коды клавиш: 32 - пробел
    const allowedCharacters = /[a-zA-Z\s\d]/; // Разрешенные символы: буквы, пробелы и цифры

    if (!allowedKeys.includes(event.keyCode) && !allowedCharacters.test(event.key)) {
      event.preventDefault();
    }
  }

  validateNumbers(event: KeyboardEvent) {
    const allowedKeys = [8, 9, 13, 27, 46]; // Коды клавиш: 8 - Backspace, 9 - Tab, 13 - Enter, 27 - Esc, 46 - Delete
    const allowedCharacters = /\d/; // Разрешенные символы: цифры

    if (!allowedKeys.includes(event.keyCode) && !allowedCharacters.test(event.key)) {
      event.preventDefault();
    }
  }

  sizeIsUntouched(arr: NgModel[]) {
    const [size8, size9, size10, size11, size12, size13, size14, size15] = arr;
    if (
      !size8.value &&
      !size9.value &&
      !size10.value &&
      !size11.value &&
      !size12.value &&
      !size13.value &&
      !size14.value &&
      !size15.value
    ) {
      return true;
    }

    return false;
  }

  isAnySizeSelected(): boolean {
    return (
      this.size8 || this.size9 || this.size10 || this.size11 || this.size12 || this.size13 || this.size14 || this.size15
    );
  }

  isFilesSelected(): boolean {
    return this.selectedFiles.length > 0;
  }

  formData: Product = {
    id: '',
    docId: '',
    category: '',
    title: '',
    title_arr: [],
    subtitle: '',
    currency: 'USD',
    price: 1,
    sizes: [],
    imagesUrls: [],
    color: {
      type: '',
      name: '',
      hex: '',
    },
    colors: [],
    rating: 0,
    reviews: [],
    description: '',
    typeModel: 'Sports',
  };

  async onSubmit(form: NgForm) {
    const selectedSizes = [
      this.size8,
      this.size9,
      this.size10,
      this.size11,
      this.size12,
      this.size13,
      this.size14,
      this.size15,
    ];

    if (selectedSizes.every((size) => !size) || this.selectedFiles.length === 0) {
      this.showErrorMessage = true;
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.showErrorMessage = true;
      return;
    }

    if (form.valid) {
      const object: Product = {
        id: this.formData.id,
        docId: this.formData.docId,
        category: this.formData.category,
        title: this.formData.title,
        title_arr: [],
        subtitle: this.formData.subtitle,
        currency: this.formData.currency,
        price: Number(this.formData.price),
        sizes: [
          this.size8 ? 8 : null,
          this.size9 ? 9 : null,
          this.size10 ? 10 : null,
          this.size11 ? 11 : null,
          this.size12 ? 12 : null,
          this.size13 ? 13 : null,
          this.size14 ? 14 : null,
          this.size15 ? 15 : null,
        ].filter((size) => size !== null),
        imagesUrls: [''],
        color: {
          type: this.formData.color.type,
          name: this.formData.color.name,
          hex: this.formData.color.hex,
        },
        colors: this.formData.colors,
        rating: this.formData.rating,
        reviews: this.formData.reviews,
        description: this.formData.description,
        typeModel: this.formData.typeModel,
      };
      try {
        // Добавление данных и ожидание завершения операции
        object.title_arr = this.fBaseService.titlePrepareForSearch(object.title);
        object.imagesUrls = await this.cloudService.uploadFile(this.selectedFiles, object.category, object.title);
        await this.fBaseService.addData(object);
        this.addFiles!.nativeElement.value = '';
        form.reset();
        this.showErrorMessage = false;
        this.selectedFiles = [];
        console.log('Object added to Firestore', object);
      } catch (error) {
        console.log('Error adding object to Firestore:', error);
      }
    } else if (!form.valid) {
      this.showErrorMessage = true;
    }
  }

  //////////////////delete///////////////////

  private productsOrigin?: Observable<Product[]>;

  prod$?: Observable<Product[]>;

  filteredProducts$?: Observable<Product[]>;

  searchValue = '';

  ngOnInit(): void {
    this.productsOrigin = this.prod$ = this.fBaseService.getAllProducts();
    this.filteredProducts$ = this.prod$;
  }

  submitSearch(value: string) {
    this.searchValue = value;
    this.selectedCategory = 'All';
    this.prod$ = this.filterProductsByTitles(value);
    this.filterProducts();
  }

  setSelectedCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  private filterProducts() {
    // Фильтруем массив продуктов на основе выбранной категории
    this.filteredProducts$ = this.productsOrigin?.pipe(
      map((products: Product[]) => {
        const filteredByCategory =
          this.selectedCategory === 'All'
            ? products
            : products.filter((product) => product.typeModel === this.selectedCategory);
        return filteredByCategory;
      }),
    );
  }

  filterProductsByTitles(productName: string): Observable<Product[]> | undefined {
    const reg = new RegExp(`${productName}`, 'gi');

    return this.productsOrigin?.pipe(
      map((products: Product[]) => products.filter((product) => reg.test(product.title))),
    );
  }

  deleteProduct(product: Product) {
    this.fBaseService
      .deleteData(product)
      .then(() => {
        console.log('Product deleted successfully');
      })
      .catch((error) => {
        console.log('Error deleting product:', error);
      });
  }
}
