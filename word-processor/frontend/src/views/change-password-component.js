import "@polymer/polymer/polymer-legacy.js";
import "@vaadin/vaadin-text-field/src/vaadin-password-field.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout.js";
import "@vaadin/vaadin-button/src/vaadin-button.js";
import "@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";

class ChangePasswordComponent extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                    width: 100%;
                    height: 80%;
                }

                #mainDiv {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-position: center;
                    background-size: cover;
                    width:100%;
                    height:100%;
                }

                #centerVerticalLayout {
                    padding: 20px !important;
                    align-items: center !important;
                    width: 500px;
                }

                #logoImage {
                    height: 100px;
                    margin-bottom: 10px;
                }

                #passwordResetHeader{
                    font-size:22px;
                }
                
                #currentPasswordField,
                #passwordResetInstruction,
                #newPasswordField,
                #confirmNewPasswordField {
                    width: 100%;
                }
            </style>

           
            <vaadin-vertical-layout id="centerVerticalLayout">
                <label id="passwordResetInstruction"></label>
                <vaadin-password-field id="currentPasswordField" theme="align-center"></vaadin-password-field>
                <vaadin-password-field id="newPasswordField" theme="align-center"></vaadin-password-field>
                <vaadin-password-field id="confirmNewPasswordField" theme="align-center"></vaadin-password-field>
                <vaadin-button id="changePasswordButton" theme="button"></vaadin-button>
            </vaadin-vertical-layout>
           
        `;
    }
    static get is() {
        return "change-password-component";
    }
    static get properties() {
        return {
            newPassword: {
                type: String,
            },
            confirmNewPassword: {
                type: String,
            },
        };
    }
}
customElements.define(ChangePasswordComponent.is, ChangePasswordComponent);
