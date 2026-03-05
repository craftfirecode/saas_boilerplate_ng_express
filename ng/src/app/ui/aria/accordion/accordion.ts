import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';

export interface AccordionItem {
  title: string;
  content: string;
}

@Component({
  selector: 'app-accordion',
  imports: [
    AccordionContent,
    AccordionGroup,
    AccordionPanel,
    AccordionTrigger,
  ],
  templateUrl: './accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accordion {
  readonly items = input<AccordionItem[]>([]);
}
