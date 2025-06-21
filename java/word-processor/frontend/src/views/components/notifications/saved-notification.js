import '@polymer/polymer/polymer-legacy.js';
import '@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class SavedNotification extends PolymerElement {
  static get template() {
    return html`
   <style include="shared-styles">
            :host {
                display: block;
                width: 100%;
            }
        </style> 
   <vaadin-horizontal-layout style="width: 100%; height: 100%;justify-content:center;color: green;"> 
    <iron-icon icon="lumo:checkmark"></iron-icon> 
    <span>[[title]]</span> 
   </vaadin-horizontal-layout> 
`;
  }

  static get is() {
      return 'saved-notification';
  }
  static get properties() {
      return {
          // Declare your properties here.
          
          title: {
              type: String,
              value: 'Saved'
          }
      };
  }
}
customElements.define(SavedNotification.is, SavedNotification);

