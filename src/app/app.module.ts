import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyTabsModule } from 'ngx-formly-tabs';

import { FormlyDesignerModule } from 'ngx-formly-designer';

import { config, fieldComponents } from './config';
import { designerConfig } from './designer-config';

import { AppComponent } from './app.component';
import { ExpanderComponent } from './components/expander.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        ExpanderComponent,

        fieldComponents
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,


        FormlyBootstrapModule,
        FormlyModule.forRoot(config),
        //FormlyTabsModule,
        FormlyDesignerModule.forRoot(designerConfig),
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
