import '@polymer/polymer/polymer-legacy.js';
import '@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class GeneralNotification extends PolymerElement {
  static get template() {
    return html`
   <style include="shared-styles">
            :host  {
                display: block;
                max-width: 20vw;
	        	min-width: 400px;
	        	min-height: 150px;
            }
            :host #titleDiv{
            	font-weight:bold;
            	font-size:22px;
            	margin: 10px 2px;
            }
            :host #messageDiv{
            	font-size:16px;
            	margin: 10px 2px;
            }
        </style> 
   <vaadin-vertical-layout style="width: 100%; height: 100%;justify-content:center;"> 
    <div id="titleDiv">
     [[title]]
    </div> 
    <div id="messageDiv"></div> 
    <vaadin-horizontal-layout style="width: 100%;justify-content:center;">
        <vaadin-button id="okButton" on-click="closeNotification"></vaadin-button> 
    </vaadin-horizontal-layout>    
   </vaadin-vertical-layout> 
`;
  }

  static get is() {
      return 'general-notification';
  }
  static get properties() {
      return {
          // Declare your properties here.
          
          title: {
              type: String,
              value: ''
          }
      };
  }
}
customElements.define(GeneralNotification.is, GeneralNotification);

