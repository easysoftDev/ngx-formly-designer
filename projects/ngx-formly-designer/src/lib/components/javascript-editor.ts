import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import CodeFlask from 'codeflask';

@Component({
    selector: 'javascript-editor-formly-field-input',
    template: `
        <label>{{field.templateOptions.label}}</label><br>
        <div id="container" style="width:100%;height:100px;border:1px solid #4f559c" 
             [formlyAttributes]="field" #container></div>
    `,
    styles: [
        `
        `
    ]
})
export class JavascriptFormlyFieldComponent extends FieldType implements AfterViewInit {

    @ViewChild('container', { static: false }) containerElement: ElementRef;

    flask: CodeFlask;
    /**
     *
     */
    constructor() {
        super();
    }

    ngAfterViewInit(): void {
        this.flask = new CodeFlask(this.containerElement.nativeElement, { language: 'js', lineNumbers: true });
        //closure
        const that = this;
        this.flask.onUpdate((code) => {
            // do something with code here.
            // this will trigger whenever the code
            // in the editor changes.
            if (code) {
                that.model[this.field.key.toString()]  = code;
            } else {
                that.model[this.field.key.toString()] = undefined;
            }
        });

    }


}
