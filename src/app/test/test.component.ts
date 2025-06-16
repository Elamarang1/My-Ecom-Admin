import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  productForm: FormGroup;

  imageUrl: any[] = [
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
  ];

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

  options: string[] = ['s', 'm', 'l', 'xl', 'xxl'];
  colors: string[] = ['yellow', 'white', 'pink', 'olive', 'navy', 'red'];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
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
      'images Details': this.fb.array([]),
    });

    this.addImage(); // Add initial image entry
  }

  get imageDetails(): FormArray {
    return this.productForm.get('images Details') as FormArray;
  }

  newImage(): FormGroup {
    return this.fb.group({
      alt: ['', Validators.required],
      src: ['', Validators.required], // base64 string
      preview: [''], // for UI preview only
      'variant Details': this.fb.array([this.newVariant()]),
    });
  }

  newVariant(): FormGroup {
    return this.fb.group({
      sku: ['', Validators.required],
      size: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  addImage() {
    this.imageDetails.push(this.newImage());
  }

  removeImage(index: number) {
    this.imageDetails.removeAt(index);
  }

  getVariants(imageIndex: number): FormArray {
    return this.imageDetails.at(imageIndex).get('variant Details') as FormArray;
  }

  addVariant(imageIndex: number) {
    this.getVariants(imageIndex).push(this.newVariant());
  }

  removeVariant(imageIndex: number, variantIndex: number) {
    this.getVariants(imageIndex).removeAt(variantIndex);
  }

  async onFileChange(event: any, imageIndex: number) {
    const file = event.target.files[0];
    if (file) {
      const base64 = await this.convertToBase64(file);
      const group = this.imageDetails.at(imageIndex);
      group.patchValue({ src: base64, preview: base64 });
    }
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  jsonTest() {
    console.log('Form Data:', this.productForm.value);
    if (this.productForm.valid) {
      const formData = JSON.parse(JSON.stringify(this.productForm.value));
      formData['images Details'].forEach((img: any) => delete img.preview);
      formData.sale = true;
      console.log('Final Payload:', formData);
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
