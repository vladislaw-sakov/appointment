import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { FBMLAttribute, FBMLComponent } from '../fbml-component';

/**
 * @name Quote Plugin
 * @shortdesc Quote plugin component
 * @fbdoc https://developers.facebook.com/docs/plugins/quote
 * @description
 * The quote plugin lets people select text on your page and add it to their share, so they can tell a more expressive story.
 * Note that you do not need to implement Facebook login or request any additional permissions through app review in order to use this plugin.
 * @usage
 * ```html
 * <fb-quote></fb-quote>
 * ```
 */
@Component({
  selector: 'fb-quote',
  template: ''
})
export class FBQuoteComponent extends FBMLComponent {

  /**
   * The absolute URL of the page that will be quoted.
   * Defaults to the current URL
   */
  @Input()
  @FBMLAttribute
  href: string;

  /**
   * Can be set to quote or button. Defaults to quote.
   */
  @Input()
  @FBMLAttribute
  layout: string;

  constructor(
    el: ElementRef,
    rnd: Renderer
  ) {
    super(el, rnd, 'fb-quote');
  }

}
