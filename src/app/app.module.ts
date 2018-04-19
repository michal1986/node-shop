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
    component: HomeComponent,
    data: { title: 'Makers' }
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
  { path: '',
    redirectTo: '/home',
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
    MakersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
