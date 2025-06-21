import '@polymer/polymer/polymer-legacy.js';
import '@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js';
import '@vaadin/vaadin-button/src/vaadin-button.js';
import '@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class ErrorNotification extends PolymerElement {
  static get template() {
    return html`
   <style include="shared-styles">
            :host {
                display: block;
            }
        </style> 
   <vaadin-horizontal-layout style="width: 100%; height: 100%;justify-content:center;color: white;background-color:red;align-items:center" theme="spacing"> 
    <vaadin-vertical-layout style="flex-grow:1"> 
     <div id="titleDiv" style="font-weight:bold;font-size:var(--lumo-font-size-xl)"></div></br>
     <div id="messageDiv" style="width: 100%; height: 100%;background-color:red; color:white;font-size:var(--lumo-font-size-m)"></div> 
    </vaadin-vertical-layout> 
    <vaadin-button theme="icon small" aria-label="Add new" id="closeButton" style="color:white;/*border-radius:50%;*/border: solid 1px white;padding:0px;" on-click="closeNotification"> 
     <iron-icon icon="lumo:cross" slot="prefix"></iron-icon> 
    </vaadin-button> 
   </vaadin-horizontal-layout> 
`;
  }

  static get is() {
      return 'error-notification';
  }
  static get properties() {
      return {
          // Declare your properties here.
      };
  }

  constructor() {
      super();
  }

  ready() {
      super.ready();
  }
}
customElements.define(ErrorNotification.is, ErrorNotification);

