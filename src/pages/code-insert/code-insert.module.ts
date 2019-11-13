import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CodeInsertPage} from './code-insert';

@NgModule({
    declarations: [
        CodeInsertPage,
    ],
    imports: [
        IonicPageModule.forChild(CodeInsertPage),
    ],
})
export class CodeInsertPageModule {
}
