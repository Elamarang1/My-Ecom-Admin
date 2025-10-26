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
import { ProductListComponent } from "../product-list/product-list.component";

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
    ProductListComponent
],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  productForm: FormGroup;
  productIdToUpdate: string | null = null;
  checker:any
  // @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('imageTabFocus', { static: false }) imageTabFocus!: ElementRef;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;




  imageUrl: any[] = [
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
    '../../../assts/add-img.webp',
  ];

  typeArray = [
    { key: 'Homemade Products', value: 'Homemade Products' },
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
    { key: 'Dreamy Craft', value: 'Dreamy Craft' },
    { key: 'Nike', value: 'nike' },
    {key:'Iphone', value: 'iphone'},
    { key: 'samsung', value: 'samsung' },
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
    { key: 'Homemade Products', value: 'Homemade Products' },
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
skuOptions: string[] = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004'];
  options: string[] = ['s', 'm', 'l', 'xl', 'xxl'];
  colors: string[] = ['yellow', 'white', 'pink', 'olive', 'navy', 'red'];
sizeOptions: string[] = ['XS', 'S', 'M', 'L', 'XL'];
colorOptions: string[] = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink'];

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
        length: [0],
  breadth: [0],
  height: [0],
  weight: [0]
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
      size: ['0', Validators.required],
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
  console.log('Form Submitted:', this.productForm.value);
  if (this.productForm.valid) {
    this.checker = 'valid'
    const formData = JSON.parse(JSON.stringify(this.productForm.value));

    formData['images Details'].forEach((img: any) => {
      // Remove preview key if present
      delete img.preview;

      // ⚠️ Normalize `src` to relative path if it's a full URL
      if (img.src && typeof img.src === 'string' && img.src.startsWith('http://localhost:3000/')) {
        img.src = img.src.replace(/^http:\/\/localhost:3000\//, '');
      }
    });

    formData.sale = true;
    formData.tags = ['s', 'm', 'pink', 'blue', 'biba'];

    if (this.productIdToUpdate) {
      // 🔄 Update
      this.productService.updateProduct(this.productIdToUpdate, formData).subscribe({
        next: (res) => {
          console.log('✅ Product updated:', res);
          alert('Product updated successfully!');
          this.productForm.reset();
          this.productIdToUpdate = null;
          this.checker = 'submitted'; // Reset checker
        },
        error: (err) => {
          console.error('❌ Error updating product:', err);
          alert('Failed to update product.');
        },
      });
    } else {
      // 🆕 Create
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          console.log('✅ Product created:', res);
          alert('Product created successfully!');
          this.productForm.reset();
           this.checker = 'submitted'; // Reset checker
        },
        error: (err) => {
          console.error('❌ Error creating product:', err);
          alert('Failed to create product.');
        },
      });
    }
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

goToTab(index: number): void {

  this.tabGroup.selectedIndex = index;

  console.log('Tab changed to index:', this.tabGroup.selectedIndex);
}




patchFormData(product: any) {
  this.productIdToUpdate = product._id; // Set ID for update

  this.productForm.patchValue({
    title: product.title,
    description: product.description,
    type: product.type,
    brand: product.brand,
    collection: product.collection,
    category: product.category,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
    newProduct: product.new,
        length: product.dimensions?.length || 0,
    breadth: product.dimensions?.breadth || 0,
    height: product.dimensions?.height || 0,
    weight: product.dimensions?.weight || 0
  });

  this.imageDetails.clear();

  product.images.forEach((image: any) => {
    const variants = product.variants.filter(
      (variant: any) => variant.image_id === image.image_id
    );

    const variantFormGroups = variants.map((variant: any) =>
      this.fb.group({
        sku: [variant.sku, Validators.required],
        size: [variant.size, Validators.required],
        color: [variant.color, Validators.required],
      })
    );

    const imageFormGroup = this.fb.group({
      alt: [image.alt, Validators.required],
      src: [`http://localhost:3000/${image.src}`, Validators.required],
      preview: [`http://localhost:3000/${image.src}`],
      'variant Details': this.fb.array(variantFormGroups, Validators.required),
    });

    this.imageDetails.push(imageFormGroup);
  });
}




}
