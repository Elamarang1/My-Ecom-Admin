import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    NgFor,
    MatExpansionModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  imageUrl: any = [
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
  ];


  productForm1!: FormGroup;

  options: string[] = ['s', 'm', 'l', 'xl', 'xxl'];
  colors: string[] = ['yellow', 'white', 'pink', 'olive', 'navy', 'red'];
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.productForm1 = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: [''],
      brand: [''],
      collection: [[]],
      category: [''],
      price: [''],
      discount: [''],
      stock: [''],
      newProduct: [false],
    });
  }

  typeArray = [
    { key: 'Fashion', value: 'fashion' },
    { key: 'Shoes', value: 'shoes' },
    { key: 'Bags', value: 'bags' },
    { key: 'Watch', value: 'watch' },
    { key: 'Flower', value: 'flower' },
    { key: 'Pets', value: 'pets' },
    { key: 'Electronics', value: 'electronics' },
    { key: 'Vegetables', value: 'vegetables' },
    { key: 'Furniture', value: 'furniture' },
    { key: 'Beauty', value: 'beauty' },
    { key: 'Tools', value: 'tools' },
    { key: 'Gym', value: 'gym' },
    { key: 'Marijuana', value: 'marijuana' },
  ];

  brandArray = [
    { key: 'Nike', value: 'nike' },
    { key: 'Zara', value: 'zara' },
    { key: 'Denim', value: 'denim' },
    { key: 'Madame', value: 'madame' },
    { key: 'Biba', value: 'biba' },
    { key: 'Max', value: 'max' },
  ];

  collectionArray = [
    { key: 'New products', value: 'new products' },
    { key: 'Best sellers', value: 'best sellers' },
    { key: 'Featured products', value: 'featured products' },
    { key: 'On sale', value: 'on sale' },
    { key: 'New arrival', value: 'new arrival' },
    { key: 'Trending product', value: 'trending product' },
  ];
  categoryArray = [
    { key: 'Fashion', value: 'Women' },
    { key: 'Shoes', value: 'shoes' },
    { key: 'Bags', value: 'bags' },
    { key: 'Watch', value: 'watch' },
    { key: 'Flower', value: 'flower' },
    { key: 'Pets', value: 'pets' },
    { key: 'Electronics', value: 'electronics' },
    { key: 'Vegetables', value: 'vegetables' },
    { key: 'Furniture', value: 'furniture' },
    { key: 'Beauty', value: 'beauty' },
    { key: 'Tools', value: 'tools' },
    { key: 'Gym', value: 'gym' },
    { key: 'Marijuana', value: 'marijuana' },
  ];

  ngOnInit() {

  }


  jsonTest() {
    if (this.productForm1.valid) {
      const formData = this.productForm1.value;

      formData.sale = true;
      console.log('Form Data:', this.productForm1.value);
    } else {
      this.productForm1.markAllAsTouched();
    }
  }
}
