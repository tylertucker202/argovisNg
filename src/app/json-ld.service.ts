import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class JsonLDService {
	static scriptType = 'application/json+ld';
	static websiteSchema = (url="https://argovis.colorado.edu", name="Argovis") => {
		return {
			'@context': 'http://schema.org',
			'@type'      : "Application",
			url          : url,
			name         : name,
			"sameAs": ["https://twitter.com/ArgovisCU"]
			};
	};
	static orgSchema = () => ({
			'@context'  :
				'https://schema.org',
			'@type'     :
				'Organization',
			url         :
				'https://google.com',
			name        :
				'Google',
			contactPoint: {
				'@type'    :
					'ContactPoint',
				telephone  :
					'01293019413',
				contactType:
					'Customer service'
			}
		});

	constructor(@Inject(DOCUMENT) private _document: Document) {}

	removeStructuredData(): void {
		const els = [];
		[ 'structured-data', 'structured-data-org' ].forEach(c => {
			els.push(...Array.from(this._document.head.getElementsByClassName(c)));
		});
		els.forEach(el => this._document.head.removeChild(el));
	}

	insertSchema(schema: Record<string, any>, className = 'structured-data'): void {
		let script;
		let shouldAppend = false;
		if (this._document.head.getElementsByClassName(className).length) {
			script = this._document.head.getElementsByClassName(className)[0];
		} else {
			script = this._document.createElement('script');
			shouldAppend = true;
		}
		script.setAttribute('class', className);
		script.type = JsonLDService.scriptType;
		script.text = JSON.stringify(schema);
		if (shouldAppend) {
			this._document.head.appendChild(script);
		}
	}
}