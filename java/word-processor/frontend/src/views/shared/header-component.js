import "@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js";
import "@vaadin/vaadin-button/src/vaadin-button.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
class HeaderComponent extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                    width: 100%;
                    height: var(--main-header-height);
                    background-color: var(--application-main-color);
                    flex-basis: auto;
                }
            </style>
            <vaadin-horizontal-layout id="headerComponentHLayout" style="width: 100%; height: 100%; padding-left: var(--lumo-space-m); color: white; align-items: center;">
                <vaadin-horizontal-layout id="firstSectionHLayout" theme="spacing" style="flex-grow:1; width:100%; height: 100%; align-items: center">
                    <span id="titleSpan" style="font-size: 20px;">[[title]]</span>
                    <vaadin-horizontal-layout id="firstSectionComponentsHLayout"></vaadin-horizontal-layout>
                </vaadin-horizontal-layout>
                <vaadin-horizontal-layout id="menuSectionHLayout" style="flex-grow:0;"></vaadin-horizontal-layout>
            </vaadin-horizontal-layout>
        `;
    }

    static get is() {
        return "header-component";
    }
    static get properties() {
        return {
            // Declare your properties here.
            title: {
                type: String,
                reflectToAttribute: true,
            },
        };
    }
}
customElements.define(HeaderComponent.is, HeaderComponent);
