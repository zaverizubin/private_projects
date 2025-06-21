import { registerStyles, css } from "@vaadin/vaadin-themable-mixin/register-styles.js";

registerStyles(
    "vaadin-grid",
    css`
        :host {
            --_lumo-grid-selected-row-color: rgba(var(--application-main-color-rgb), 0.7);
        }

        :host .error-cell {
            background-color: red;
        }

        :host .success-cell {
            background-color: green;
        }

        :host .warning-cell {
            background-color: yellow;
        }

        :host [part~="row"] {
            background: black;
            /* background-color: var(--custom-background-color, var(--lumo-base-color)); */
        }

        /* Make striped rows the default */
        :host(:not([theme~="no-border"])) [part~="row"]:not([odd]) [part~="body-cell"],
        :host(:not([theme~="no-border"])) [part~="row"]:not([odd]) [part~="details-cell"] {
            background-image: linear-gradient(var(--lumo-primary-color-20pct), var(--lumo-primary-color-20pct));
            background-repeat: repeat-x;
        }

        :host([theme~="header-filter"]) [part~="header-cell"] {
            background: var(--application-main-color);
            color: black;
        }

        /* Make column headers dark with white letters the default */
        :host [part~="header-cell"] {
            background: var(--color-nexus-dark-grey);
            color: white;
        }

        /* Make rows compact by default */
        :host [part="row"]:only-child [part~="header-cell"] {
            min-height: var(--lumo-size-xs);
        }

        :host [part~="cell"] {
            min-height: var(--lumo-size-xs);
        }

        :host [part="row"][first] [part~="cell"]:not([part~="details-cell"]) {
            min-height: calc(var(--lumo-size-xs) - var(--_lumo-grid-border-width));
        }

        :host [part~="cell"] ::slotted(vaadin-grid-cell-content) {
            padding: var(--lumo-space-xs) var(--lumo-space-m);
        }

        /* Add border and border radius to table by default */
        :host(:not([theme~="no-border"])) {
            border: 1px solid var(--color-nexus-dark-grey);
            border-radius: 5px;
        }

        /* Make column borders the default */
        :host [part~="cell"]:not([last-column]):not([part~="details-cell"]) {
            border-right: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
        }

        /* Clickable Rows */
        :host([theme~="clickable-rows"]) [part="row"]:hover {
            border: 1px solid var(--application-main-color);
            cursor: pointer;
        }

        :host([theme~="clickable-rows"]) [part~="cell"] ::slotted(vaadin-grid-cell-content) {
            cursor: pointer;
        }
        /* End Clickable Rows */

        /* Background Colors */
        :host .grid-cell-background-green {
            background-color: green;
            color:white;
        }

        :host .grid-cell-background-yellow {
            background-color: yellow;
            color:white;
        }

        :host .grid-cell-background-red {
            background-color: red;
            color:white;
        }

        :host .dynamic-background-color {
            background-color: var(--custom-background-color, var(--lumo-base-color));
        }

        :host .background-red {
            background-color: red;
            color:white;
        }

        :host .background-blue {
            background-color: blue;
            color:white;
        }

        :host .background-green {
            background-color: green;
            color:white;
        }

        :host .background-yellow {
            background-color: yellow;
        }

        :host .background-orange {
            background-color: orange;
        }
        :host .background-indigo {
            background-color: indigo;
            color:white;
        }

        :host .background-violet {
            background-color: violet;
            color:white;
        }

        /* End Background Colors */
        
        :host .full-size-cell ::slotted(vaadin-grid-cell-content) {
            padding: 0px;
            margin: 0px;
            height: 100%;
        }
    `
);

registerStyles(
    "vaadin-grid-sorter",
    css`
        :host([direction]) {
            color: #5bc0fb;
        }
    `
);
