import "@polymer/polymer/polymer-legacy.js";
import "@vaadin/vaadin-text-field/src/vaadin-text-field.js";
import "@vaadin/vaadin-text-field/src/vaadin-password-field.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout.js";
import "@vaadin/vaadin-button/src/vaadin-button.js";
import '@vaadin/vaadin-combo-box/src/vaadin-combo-box.js';
import "@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";

class LoginComponent extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
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
                    background-color: rgba(255, 255, 255, 1);
                    padding: 20px !important;
                    border-radius: 10px;
                    border: solid 2px;
                    border-color: rgba(var(--application-main-color-rgb), 0.5);
                }
            </style>
            <div id="mainDiv" style="width: 1000px; height: 920px; margin:auto; border:1px solid #007cfc; background-image: url('[[backgroundImagePath]]');">
                <vaadin-vertical-layout id="centerVLayout" style="align-items:center;">
                    <div id="headerDiv">Login</div>
                    <vaadin-text-field id="emailAddressTextField" placeholder="Username" style="width:300px;" theme="align-center"></vaadin-text-field>
                    <vaadin-password-field id="passwordField" placeholder="Password" style="width:300px;" theme="align-center"></vaadin-password-field>
                    <vaadin-button id="loginButton">Login</vaadin-button>
                </vaadin-vertical-layout>
            </div>
        `;
    }

    static get is() {
        return "login-component";
    }
    static get properties() {
        return {
            // Declare your properties here.

            emailAddress: {
                type: String,
            },

            password: {
                type: String,
            },

            backgroundImagePath: {
                type: String,
            },

            logoImagePath: {
                type: String,
            },
        };
    }
}
customElements.define(LoginComponent.is, LoginComponent);
