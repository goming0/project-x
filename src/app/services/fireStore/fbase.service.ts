import { Injectable } from '@angular/core';
import { Product } from '../../types/products';
import {
  Firestore,
  collection,
  setDoc,
  collectionData,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CurrencyStateService } from '../currency-State/currency-state.service';
/**

 * This is an Angular service that provides functionality for interacting with Firebase Firestore. It encapsulates methods related to retrieving, adding, and retrieving all products from the Firestore database.
 * @Observable @method getAllProducts()
 * @async @method getProduct()
 * @async @method addData()
 */
@Injectable({
  providedIn: 'root',
})
export class FBaseService {
  prodacts$: Observable<Product[]>;

  dbInstance = collection(this.firestore, 'shoesProducts');

  currentCurrency?: Observable<string>;

  constructor(private firestore: Firestore, private currencyState: CurrencyStateService) {
    this.prodacts$ = this.getAll();
    this.currentCurrency = this.currencyState.selectedCurrency$;
  }

  genFireId(): string {
    return doc(collection(this.firestore, 'id')).id;
  }

  /**

  Retrieves all products from Firestore.
  @returns {Observable<Product[]>} An Observable that emits an array of product objects.
  */
  getAllProducts(): Observable<Product[]> {
    return this.prodacts$;
  }

  /**

  Retrieves a product from Firestore based on the provided document ID.
  @param {string} docId - The document ID of the product to retrieve.
  @returns {Promise<Product | null>} A Promise that resolves to the retrieved product object if it exists,
  or null if the product does not exist.
  */
  async getProduct(docId: string, path = 'shoesProducts'): Promise<Product | null> {
    // Create a Firestore document reference using the product ID
    const docRef = doc(this.firestore, path, docId);

    // Retrieve the document snapshot from Firestore
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Product;
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
      return null;
    }
  }

  /**

  Adds a new product data to Firestore.
  @param {Product} data - The product data to be added to Firestore.
  @param {string} path - Is optional. Default path = 'shoesProducts'.
  @returns {Promise<void>} A Promise that resolves when the data is successfully added to Firestore.
  */
  async addData(data: Product, path = 'shoesProducts'): Promise<void> {
    // Generate a new ID for the product by Firebase
    data.id = this.genFireId();
    data.docId = this.genFireId();
    const docRef = doc(this.firestore, path, data.docId);
    try {
      await setDoc(docRef, data);
      console.log('Data send');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.massage);
    }
  }

  async deleteData(product: Product): Promise<void> {
    const docRef = doc(this.firestore, 'shoesProducts', product.docId);
    return deleteDoc(docRef);
  }

  async updateData(docId: string, dataForUpdate: Partial<Product>): Promise<void> {
    const docRef = doc(this.firestore, 'shoesProducts', docId);
    return setDoc(docRef, dataForUpdate);
  }

  /**

  Retrieves all products from Firestore.
  @returns {Observable<Product[]>} An Observable that emits an array of product objects.
  */
  private getAll(): Observable<Product[]> {
    return collectionData(this.dbInstance, { idField: 'docId' }) as Observable<Product[]>;
  }

  titlePrepareForSearch(title: string): Array<string> {
    title = title.toUpperCase();
    const arrOfWords = title.split(' ');
    const titleArr: string[] = [];
    arrOfWords.push(title);

    const length = arrOfWords.length;
    for (let i = 0; i < length; i += 1) {
      const el = arrOfWords[i];
      titleArr.push(...this.spreadTitleByCharts(el));
    }
    return titleArr;
  }

  private spreadTitleByCharts(str: string) {
    const result: string[] = [];
    const bound = str.length;
    for (let i = 0; i < bound; i++) {
      if (result.length === 0) {
        result.push(str[i]);
      } else {
        result.push(result[i - 1] + str[i]);
      }
    }
    return result;
  }

  filterProductsFromServe(str: string): Observable<Product[]> {
    str = str.toUpperCase();
    const q = query(this.dbInstance, where('title_arr', 'array-contains', str));
    return collectionData(q, { idField: 'docId' }) as Observable<Product[]>;
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const str = category[0].toUpperCase() + category.slice(1).toLowerCase();
    const q = query(this.dbInstance, where('category', '==', str));
    return collectionData(q, { idField: 'docId' }) as Observable<Product[]>;
  }
}
