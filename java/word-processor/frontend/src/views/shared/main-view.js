import "@polymer/polymer/polymer-legacy.js";
import "../../styles/shared-styles.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";


class MainView extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                    width:100%;
                    height:100%;
                }
            </style>
            <slot></slot>
        `;
    }

    static get is() {
        return "main-view";
    }
    static get properties() {
        return {
            // Declare your properties here.
        };
    }

    constructor() {
        super();


    }
}
customElements.define(MainView.is, MainView);
