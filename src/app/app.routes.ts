import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: '/products', pathMatch: 'full'},
    {path: 'products', loadComponent: () => import('./COMPONENTS/add-product/add-product.component').then(c => c.AddProductComponent)},
];
