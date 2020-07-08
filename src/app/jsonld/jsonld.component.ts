import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'app-jsonld',
  // template: "<script type='application/ld+json'>{{jsonLD}}</script>",
  template: '<div [innerHTML]="jsonLD"></div>'
})
export class JsonldComponent {
  jsonLD: SafeHtml;
  constructor(private sanitizer: DomSanitizer) { this.init() }

  init() {
    const json = {
      '@context': 'http://schema.org',
      '@type': 'Application',
      url: 'https://argovis.colorado.edu',
      name: 'Argovis',
    };

    this.jsonLD = this.getSafeHTML(json);
  }

  getSafeHTML(value: {}) {
    // If value convert to JSON and escape / to prevent script tag in JSON
    const json = value
      ? JSON.stringify(value, null, 2).replace(/\//g, '\\/')
      : '';
    const html = `${json}`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
