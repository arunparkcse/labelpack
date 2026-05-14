import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { CompanyComponent } from './pages/company/company';
import { QualityPolicyComponent } from './pages/quality-policy/quality-policy';
import { MarketFocusComponent } from './pages/market-focus/market-focus';
import { ProductsComponent } from './pages/products/products';
import { ServicesComponent } from './pages/services/services';
import { GalleryComponent } from './pages/gallery/gallery';
import { ContactComponent } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'quality-policy', component: QualityPolicyComponent },
  { path: 'market-focus', component: MarketFocusComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
