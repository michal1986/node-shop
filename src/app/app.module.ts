import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BookComponent } from './book/book.component';
import { SignupComponent } from './signup/signup.component';
import { TopmenuComponent } from './topmenu/topmenu.component';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { MakersComponent } from './makers/makers.component';
import { OrderDeliveryComponent } from './order-delivery/order-delivery.component';
import { OrderPaymentMethodComponent } from './order-payment-method/order-payment-method.component';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { CartComponent } from './cart/cart.component';
import { AddedToCartDialogComponent } from './added-to-cart-dialog/added-to-cart-dialog.component';
import { MatDialogModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderConfirmedDialogComponent } from './order-confirmed-dialog/order-confirmed-dialog.component';
import { MessageSentDialogComponent } from './message-sent-dialog/message-sent-dialog.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { MakerStoryComponent } from './maker-story/maker-story.component';
import { ItemsComponent } from './items/items.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { AppMyPagination } from "./app.my.pagination";

import { UICarouselModule } from 'ng-carousel-iuno'
import { NgxPaginationModule } from 'ngx-pagination'; 

const appRoutes: Routes = [
  {
    path: 'books',
    component: BookComponent,
    data: { title: 'Book List' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Sign Up' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home Page' }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { title: 'Contact Us' }
  },
  {
    path: 'makers',
    component: MakersComponent,
    data: { title: 'Makers' }
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: { title: 'About us' }
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Market' }
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    data: { title: 'Product' }
  },
  {
    path: 'items',
    component: ItemsComponent,
    data: { title: 'Market' }
  },
  {
    path: 'item/:id',
    component: ItemDetailsComponent,
    data: { title: 'Product' }
  },
  {
    path: 'cart',
    component: CartComponent,
    data: { title: 'Cart' }
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
    data: { title: 'My account' }
  },
  {
    path: 'my-orders/:status',
    component: MyOrdersComponent,
    data: { title: 'My Orders' }
  },
  {
    path: 'order-delivery',
    component: OrderDeliveryComponent,
    data: { title: 'Order delivery' }
  },
  {
    path: 'order-confirm',
    component: OrderConfirmComponent,
    data: { title: 'Order Confirm' }
  },
  {
    path: 'order-payment-method',
    component: OrderPaymentMethodComponent,
    data: { title: 'Order payment method' }
  },
  {
    path: 'payment-result',
    component: PaymentResultComponent,
    data: { title: 'PaymentResult' }
  },
  {
    path: 'blog',
    component: BlogComponent,
    data: { title: 'Blog' }
  },
  {
    path: 'blog/post/:id',
    component: BlogPostComponent,
    data: { title: 'Blog Id' }
  },
  {
    path: 'maker-story/:id',
    component: MakerStoryComponent,
    data: { title: 'Maker Story' }
  },
  { path: '',
    redirectTo: '/items',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BookComponent,
    SignupComponent,
    TopmenuComponent,
    BlogComponent,
    HomeComponent,
    FooterComponent,
    ContactComponent,
    AboutUsComponent,
    MyAccountComponent,
    MyOrdersComponent,
    ProductsComponent,
    ProductDetailsComponent,
    BlogPostComponent,
    MakersComponent,
    OrderDeliveryComponent,
    OrderPaymentMethodComponent,
    OrderConfirmComponent,
    CartComponent,
    AddedToCartDialogComponent,
    OrderConfirmedDialogComponent,
    MessageSentDialogComponent,
    PaymentResultComponent,
    MakerStoryComponent,
    ItemsComponent,
    ItemDetailsComponent,
    AppMyPagination
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
    ),
    UICarouselModule,
    NgxPaginationModule
  ],
  entryComponents: [
    AddedToCartDialogComponent,
    OrderConfirmedDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
