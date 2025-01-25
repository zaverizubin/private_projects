import "@polymer/polymer/polymer-legacy.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js";
import "@vaadin/vaadin-button/src/vaadin-button.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
class SaveButtonsComponent extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles font-awesome">
                :host {
                    display: block;
                }
            </style>
            <vaadin-horizontal-layout id="mainHLayout" theme="spacing" style="width: 100%; height: 100%;">
                <vaadin-button id="cancelButton" theme="error primary"> <iron-icon icon="lumo:cross" slot="prefix"></iron-icon>[[cancelButtonText]] </vaadin-button>
                <vaadin-button id="saveButton" theme="primary success"> <iron-icon icon="lumo:checkmark" slot="prefix"></iron-icon>[[saveButtonText]] </vaadin-button>
                <vaadin-button id="saveAndCloseButton" theme="primary"> <iron-icon icon="lumo:arrow-right" slot="suffix"></iron-icon>[[saveAndCloseButtonText]] </vaadin-button>
            </vaadin-horizontal-layout>
        `;
    }

    static get is() {
        return "save-buttons-component";
    }
    static get properties() {
        return {
            // Declare your properties here.
            cancelButtonText: {
                type: String,
                value: "Cancel",
            },

            saveButtonText: {
                type: String,
                value: "Save",
            },

            saveAndCloseButtonText: {
                type: String,
                value: "Save & Close",
            },
        };
    }
}
customElements.define(SaveButtonsComponent.is, SaveButtonsComponent);
