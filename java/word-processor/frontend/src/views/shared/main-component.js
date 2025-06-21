import "@vaadin/vaadin-split-layout/src/vaadin-split-layout.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout.js";
import "@vaadin/vaadin-select/src/vaadin-select.js";
import "@vaadin/vaadin-tabs/src/vaadin-tabs.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js";
import "@vaadin/vaadin-tabs/src/vaadin-tab.js";
import "@vaadin/vaadin-list-box/src/vaadin-list-box.js";
import "@vaadin/vaadin-item/src/vaadin-item.js";
import "./header-component.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../../styles/shared-styles.js";

class MainComponent extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles font-awesome lumo-badge"></style>
            <div id="mainDiv" style="width: 1000px; height: 920px; margin:auto; border:1px solid #007cfc">
                <vaadin-split-layout id="mainHSplitLayout" theme="minimal" style="height: 100%;width: 100%;">
                    <vaadin-vertical-layout id="contentMainVLayout" style="height: 100%;width: 100%;">
                        <div id="headerDiv" style="width: 100%"></div>
                        <slot style="width: 100%;height: 100%;display:flex"></slot>
                    </vaadin-vertical-layout>
                </vaadin-split-layout>
            </div>
        `;
    }

    static get is() {
        return "main-component";
    }
    static get properties() {
        return {
            // Declare your properties here.

            logoPath: {
                type: String,
            },
        };
    }
}
customElements.define(MainComponent.is, MainComponent);
