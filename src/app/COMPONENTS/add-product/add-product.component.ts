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
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  FormArray,
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
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { ProductService } from '../../services/product.service';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-add-product',
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
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  productForm: FormGroup;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('imageTabFocus', { static: false }) imageTabFocus!: ElementRef;
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
    {key:'Iphone', value: 'iphone'},
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

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      collection: [[], Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      discount: ['', Validators.required],
      stock: ['', Validators.required],
      newProduct: [false, Validators.requiredTrue],
      'images Details': this.fb.array([], Validators.required),
    });

    this.addImage(); // Add initial image entry
  }

  get imageDetails(): FormArray {
    return this.productForm.get('images Details') as FormArray;
  }

  newImage(): FormGroup {
    return this.fb.group({
      alt: ['image not found.', Validators.required],
      src: ['', Validators.required], // base64 string
      'variant Details': this.fb.array(
        [this.newVariant()],
        Validators.required
      ),
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

  Submit() {
    if (this.productForm.valid) {
      const formData = JSON.parse(JSON.stringify(this.productForm.value));

      // Clean preview fields if present
      formData['images Details'].forEach((img: any) => {
        delete img.preview;
      });

      // Static values
      formData.sale = true;
      formData.tags = ['s', 'm', 'pink', 'blue', 'biba'];

      // Call service
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          console.log('✅ Product created:', res);
          alert('Product created successfully!');
          this.productForm.reset();
        },
        error: (err) => {
          console.error('❌ Error creating product:', err);
          alert('Failed to create product.');
        },
      });
    } else {
      this.markFormGroupTouched(this.productForm);
      console.warn('⚠️ Form Invalid');
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    (Object as any).values(formGroup.controls).forEach((control: any) => {
      if (control.controls) {
        this.markFormGroupTouched(control); // recurse
      } else {
        control.markAsTouched();
      }
    });
  }

  goToTab(index: number) {
    this.tabGroup.selectedIndex = index;

    // Allow time for tab change before shifting focus
    setTimeout(() => {
      if (index === 1 && this.imageTabFocus) {
        this.imageTabFocus.nativeElement.focus();
      }
    }, 200); // Delay ensures tab is visible before focusing
  }
}
