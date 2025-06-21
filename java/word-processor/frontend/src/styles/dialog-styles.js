import { registerStyles, css } from "@vaadin/vaadin-themable-mixin/register-styles.js";

registerStyles(
    "vaadin-dialog",
    css`
        [part~="overlay"] {
            max-width: none !important;
        }
    `
);

registerStyles(
    "vaadin-dialog-overlay",
    css`
        :host [part="overlay"] {
            width: var(--dialog-content-width);
            border: 2px solid var(--application-main-color) ;
        }

        /* Make sure content fills the overlay. Padding, etc can be done on the vaadin layout if necessary */
        :host([theme~="full-screen"]) [part="content"] {
            padding: 0px;
            width: 100%;
            height: 100%;
        }

        :host([theme~="full-screen"]) [part="overlay"] {
            width: 100%;
            height: 100%;
        }

        :host([theme~="half-screen"]) [part="content"] {
            padding: 0px;
            width: 100%;
            height: 100%;
        }

        :host([theme~="half-screen"]) [part="overlay"] {
            width: 50%;
            height: 50%;
        }

        :host([theme~="move-to-front"]) {
            z-index: 999999;
        }

        :host([theme~="no-padding"]) [part="content"] {
            padding: 0px;
        }
    `
);
