import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf,
        CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnChanges {
    @Output() dataEmitter = new EventEmitter<string>();
    @Input() listUpdate: any;
  products: any[] = [];
displayedColumns: string[] = [
  'title', 'brand', 'category', 'price', 'discount', 'stock','image', 'actions'
];


  constructor(private productService: ProductService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listUpdate'] && this.listUpdate == 'submitted') {
      this.productList();
    }
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['product'] && this.product) {
  //   }
  // }

  ngOnInit() {
    this.productList();
  }



  viewProduct(product: any) {
  console.log('View:', product);
  // Navigate to view page or open dialog
}

editProduct(product: any) {
  console.log('Edit:', product);
  this.dataEmitter.emit(product);
  // Navigate to edit page or open dialog
}


productList() {
      this.productService.getAllProducts().subscribe((products) => {
        console.log('Products:', products);
      this.products = products;
    });
}

deleteProduct(id: string) {
  if (confirm('Are you sure you want to delete this product?')) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(p => p._id !== id);
      console.log('Deleted:', id);
      this.productList();
    });
  }
}

}

