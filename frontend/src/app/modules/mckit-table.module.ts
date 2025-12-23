import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MCTable } from 'mc-kit/projects/mckit/table/src/lib/components/table/table.component';
import { MCTdTemplateDirective } from 'mc-kit/projects/mckit/table/src/lib/directives/td-template.directive';
import { MCThTemplateDirective } from 'mc-kit/projects/mckit/table/src/lib/directives/th-template.directive';

/**
 * Módulo wrapper para MC-Kit Table
 * Permite usar MC-Table en componentes standalone de Angular
 */
@NgModule({
  declarations: [
    MCTable,
    MCTdTemplateDirective,
    MCThTemplateDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MCTable,
    MCTdTemplateDirective,
    MCThTemplateDirective
  ]
})
export class MCKitTableModule { }