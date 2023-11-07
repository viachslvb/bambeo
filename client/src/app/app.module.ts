import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";
import { DatePipe } from '@angular/common';
import { PromotionsModule } from './promotions/promotions.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        PromotionsModule,
        HttpClientModule
    ]
})
export class AppModule { }
