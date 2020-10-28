import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldsService } from './fields.service';
import { FormlyDesignerService } from './formly-designer.service';
import { merge, NEVER, Subscription, timer } from 'rxjs';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';

@Component({
    selector: 'formly-designer',
    template: `
        <formly-designer-field-picker (selected)="onFieldSelected($event)">
        </formly-designer-field-picker>
        <form novalidate class="grid-stack" >
            <!--Drag and drop support-->
            <formly-form  [options]="options" [model]="model" [form]="form" [fields]="fields" [dragula]="'FIELDS'">
            </formly-form>
        </form>
        <!--<div>
            Designer Fields Debug:
            <pre>{{ fields | decycle | json }}</pre>
        </div>-->
    `,
    styles: [`
        formly-designer-field-picker .form-group > .input-group > formly-designer-type-select > select {
            border-radius: .25rem 0 0 .25rem;
            border-right: 0;
        }
        formly-designer-wrapper-editor .card > .card-body .form-control {
            width: 100%;
        }
        formly-designer-wrapper-picker .form-group > .input-group > formly-designer-wrapper-select > select {
            border-radius: .25rem 0 0 .25rem;
            border-right: 0;
        }

        .gu-mirror {
          position: fixed !important;
          margin: 0 !important;
          z-index: 9999 !important;
          opacity: 0.8;
          -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
          filter: alpha(opacity=80);
          pointer-events: none;
        }
        /* high-performance display:none; helper */
        .gu-hide {
          left: -9999px !important;
        }
        /* added to mirrorContainer (default = body) while dragging */
        .gu-unselectable {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        /* added to the source element while its mirror is dragged */
        .gu-transit {
          opacity: 0.2;
          -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
          filter: alpha(opacity=20);
        }
    `],
    encapsulation: ViewEncapsulation.None,
    providers: [FormlyDesignerService]
})
export class FormlyDesignerComponent implements OnDestroy, OnInit {
    @ViewChild('formlyFormContainer', { read: ViewContainerRef, static: false }) formlyFormContainer;
    @Output() fieldsChange = new EventEmitter<FormlyFieldConfig[]>();
    @Output() modelChange = new EventEmitter<any>();

    types: string[] = [];
    wrappers: string[] = [];
    properties: string[] = [];
    debugFields: FormlyFieldConfig[] = [];

    form: FormGroup;
    options: any = {};

    private readonly subscriptions: Subscription[] = [];

    constructor(
        private fieldsService: FieldsService,
        private formBuilder: FormBuilder,
        private formlyDesignerService: FormlyDesignerService,
        private dragulaService: DragulaService
    ) {

        this.subscriptions.push(this.dragulaService.drop("FIELDS")
            .subscribe(({ name, el, target, source, sibling }) => {
                this.reorder();
                console.log(el);
            })
        );
    }
    reorder() {
        let me = this;
        setTimeout(()=>{
            const newConfig: FormlyFieldConfig[] = [];
            const elements = document.getElementsByClassName('keypath');
            Array.from(elements).forEach((entry) => {
                let element = me.fields.filter(f => f.key == entry.id );
                if (element)
                    newConfig.push(element[0]);
            });
            me.fields = newConfig;
        }, 300);
    }

    @Input()
    get disabled(): boolean {
        return this.formlyDesignerService.disabled;
    }

    set disabled(value: boolean) {
        this.formlyDesignerService.disabled = value;
    }

    @Input()
    get fields(): FormlyFieldConfig[] {
        return this.formlyDesignerService.fields;
    }

    set fields(value: FormlyFieldConfig[]) {
        const fields = this.formlyDesignerService.convertFields(value);
        this.fieldsService.mutateFields(fields, false);
        this.formlyDesignerService.fields = fields;
    }

    @Input()
    get model(): any {
        return this.formlyDesignerService.model;
    }

    set model(value: any) {
        this.formlyDesignerService.model = value;
    }

    ngOnInit(): void {
        // Designer forms will be restricted to a single field depth; all designer keys should be
        // complex (e.g. "templateOptions.some.property")
        this.form = this.formBuilder.group({});

        this.subscriptions.push(this.formlyDesignerService.fields$
            .subscribe(() => {
                this.form = this.formBuilder.group({});
                this.fieldsChange.emit(this.formlyDesignerService.createDesignerFields());
            }));

        this.subscriptions.push(merge(
            this.formlyDesignerService.model$,
            this.form.valueChanges
        )
            .pipe(debounceTime(50))
            .subscribe(() => this.modelChange.emit(this.formlyDesignerService.model)));
    }

    ngOnDestroy(): void {
        this.subscriptions.splice(0).forEach(subscription => subscription.unsubscribe());
    }

    onFieldSelected(field: FormlyFieldConfig): void {
        timer().pipe(
            tap(() => {
                if (this.fieldsService.checkField(field, this.formlyDesignerService.fields)) {
                    this.formlyDesignerService.addField(field);
                }
            }),
            catchError(() => NEVER)).subscribe();
    }

}
