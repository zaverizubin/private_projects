import "@polymer/polymer/polymer-legacy.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout.js";
import "@vaadin/vaadin-split-layout/src/vaadin-split-layout.js";
import "@vaadin/vaadin-grid/src/vaadin-grid.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
class EntityEditor extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles font-awesome">
                :host {
                    display: flex;
                    width: 100%;
                    flex-grow: 1;
                }

                [part="label"] {
                    align-self: flex-start;
                    color: var(--lumo-secondary-text-color);
                    font-weight: 500;
                    font-size: var(--lumo-font-size-s);
                    transition: color 0.2s;
                    line-height: 1;
                    padding-top: 1em;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    position: relative;
                    max-width: 100%;
                    box-sizing: border-box;
                }
                
                :host .font-large {
                    font-size: var(--lumo-font-size-l);
                }
                :host(:hover:not([readonly]):not([focused])) [part="label"] {
                    color: var(--lumo-body-text-color);
                }
            </style>
            <vaadin-vertical-layout id="mainVLayout" style="display: flex; flex-direction: column; width: 100%; flex-grow:1">
                <vaadin-horizontal-layout id = "hLayout" style="width:100%; ">
                    <label id="label" part="label" class="font-large" style="width:100%"></label>
                    <vaadin-horizontal-layout id = buttonsHLayout style="width:70%"></vaadin-horizontal-layout>    
                </vaadin-horizontal-layout>
                
                <vaadin-split-layout id="gridSplitLayout" style="width: 100%; flex-grow: 1" theme="minimal">
                    <vaadin-grid id="grid" style="flex-grow: 1; height: unset"></vaadin-grid>
                    <vaadin-vertical-layout id="detailsVLayout" style="flex-basis: 100px; height: 100%"></vaadin-vertical-layout>
                </vaadin-split-layout>
            </vaadin-vertical-layout>
        `;
    }

    static get is() {
        return "entity-editor";
    }
    static get properties() {
        return {
            // Declare your properties here.
        };
    }
}
customElements.define(EntityEditor.is, EntityEditor);
