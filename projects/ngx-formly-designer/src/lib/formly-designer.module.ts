import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldEditorComponent } from './components/field-editor';
import { FieldPickerComponent } from './components/field-picker';
import { FieldsService } from './fields.service';
import { ConfigOption, FormlyConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlyDesignerComponent } from './formly-designer.component';
import { DesignerConfigOption, FormlyDesignerConfig, FORMLY_DESIGNER_CONFIG_TOKEN } from './formly-designer-config';
import { config, fieldComponents, wrapperComponents } from './config';
import { TypeSelectComponent } from './components/type-select';
import { WrapperEditorComponent } from './components/wrapper-editor';
import { WrapperSelectComponent } from './components/wrapper-select';
import { WrapperPickerComponent } from './components/wrapper-picker';
import { WrappersPickerComponent } from './components/wrappers-picker';
import { DecyclePipe } from './pipes/decycle';
import 'jquery';
import { DragulaModule } from 'ng2-dragula';
import { JavascriptFormlyFieldComponent } from './components/javascript-editor';

(window as any).global = window;

const formlyConfig: ConfigOption = {
    types: [
        { name: 'javascripteditor', component: JavascriptFormlyFieldComponent }
    ]
}

@NgModule({
    declarations: [
        FieldEditorComponent,
        FieldPickerComponent,
        FormlyDesignerComponent,
        TypeSelectComponent,
        WrapperEditorComponent,
        WrapperSelectComponent,
        WrapperPickerComponent,
        WrappersPickerComponent,
        DecyclePipe,
        JavascriptFormlyFieldComponent,
        fieldComponents,
        wrapperComponents
    ],
    imports: [
        CommonModule,
        DragulaModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forChild(formlyConfig)
    ],
    exports: [
        FormlyDesignerComponent
    ],
    providers: [
        FormlyDesignerConfig,
        FieldsService
    ],
    entryComponents: [FormlyForm]
})
export class FormlyDesignerModule {
    constructor(
        formlyConfig: FormlyConfig
    ) {
        formlyConfig.addConfig(config);
    }

    static forRoot(designerConfig: DesignerConfigOption = {}): ModuleWithProviders {
        return {
            ngModule: FormlyDesignerModule,
            providers: [
                { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: [fieldComponents, wrapperComponents], multi: true },
                { provide: FORMLY_DESIGNER_CONFIG_TOKEN, useValue: designerConfig, multi: true }
            ]
        };
    }
}
