import "@polymer/polymer/polymer-legacy.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout.js";
import "@vaadin/vaadin-button/src/vaadin-button.js";
import "../styles/shared-styles.js";
import "@vaadin/vaadin-checkbox/src/vaadin-checkbox.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";

class DbMigrationView extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles apm-vaadin-notification-card-styles">
                :host {
                    display: block;
                }

                #mainDiv {
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-position: center;
                    background-size: cover;
                }

                #centerVLayout {
                    background-color: rgba(255, 255, 255, 0.9);
                    padding: 20px !important;
                    border-radius: 10px;
                    border: solid 2px;
                    border-color: rgba(var(--application-main-color-rgb), 0.5);
                    align-items: center;
                }
            </style>
            <div id="mainDiv" style="background-image: url('{{backgroundImagePath}}')" slot="content">
                <vaadin-vertical-layout id="centerVLayout" style="align-items:center;">
                    <div id="headerDiv" style="font-size: 20px;font-weight: bold">License Server Database Migration</div>
                    <div id="messageDiv" style="text-align: center;">[[message]]</div>
                    <vaadin-checkbox id="agreeCheckBox"> I Agree </vaadin-checkbox>
                    <vaadin-button id="migrateButton"> Migrate </vaadin-button>
                </vaadin-vertical-layout>
            </div>
        `;
    }

    static get is() {
        return "db-migration-view";
    }
    static get properties() {
        return {
            // Declare your properties here.
            message: {
                type: String,
                value: '',
            },
            logoImagePath: {
                type: String,
                value: "",
            },
            backgroundImagePath: {
                type: String,
                value: "",
            },
        };
    }

    constructor() {
        super();

        /* This is a bit of a hack, but this is how I'm ensuring that styles and favicons are different for each application. */

        let $faviconLocation = "frontend/src/images/favicon.ico";

        let $favicon = document.querySelector('link[rel="icon"]');
        // If a <link rel="icon"> element already exists,
        // change its href to the given link.
        if ($favicon !== null) {
            $favicon.href = $faviconLocation;
            // Otherwise, create a new element and append it to <head>.
        } else {
            $favicon = document.createElement("link");
            $favicon.rel = "icon";
            $favicon.href = $faviconLocation;
            document.head.appendChild($favicon);
        }

        // Set this attribute so we can use it in css to apply global application styles
        let htmlTag = document.querySelector("html");
        htmlTag.setAttribute("app", "home");
    }

}
customElements.define(DbMigrationView.is, DbMigrationView);
