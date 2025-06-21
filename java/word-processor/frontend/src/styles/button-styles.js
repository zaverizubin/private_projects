const $_documentContainer = document.createElement("template");

$_documentContainer.innerHTML = `<dom-module id="apm-vaadin-button-styles" theme-for="vaadin-button"> 
  <template> 
   <style>
            :host {
                background-color: var(--lumo-contrast-0pct);
                border-width: 2px;
                border-style: solid;
                border-color: var(--application-main-color);

                --lumo-primary-text-color: var(--color-nexus-dark-grey);
                cursor: pointer;
            }

            :host([theme~='primary']) {
                border: none;
            }

            :host([theme~='tertiary']) {
                border: none;
            }

            :host([disabled]) {
                border-color: var(--lumo-disabled-text-color);
                background-color: var(--lumo-contrast-0pct);
            }

            :host([theme~='link']) {
                border: none;
                -webkit-box-shadow: none;
                box-shadow: none;
                background: transparent;
                cursor: pointer;
                color: var(--color-link-blue);
                font-weight: normal;
            }

            :host([theme~='link']:not([disabled])) [part~='label'] {
                text-decoration: underline;
            }

            :host([theme~='link']:hover) {
                color: var(--color-link-blue-hover);
            }

            :host([theme~='link'][disabled]) {
                background-color: transparent;
            }

            :host([theme~='hidden']) {
                border: solid 1px transparent;
                min-width: var(--lumo-button-size);
                background: none;
            }

            :host([theme~='hidden']:hover) {
                border: solid 1px var(--application-main-color);
            }

            :host([theme~='delete-button']) {
                color: red;
                border: solid 1px transparent;
                min-width: var(--lumo-button-size);
                background: none;
            }

            :host([theme~='delete-button']:hover) {
                border: solid 1px red;
            }

            :host([theme~="icon-on-top"]) .vaadin-button-container {
                display: flex;
                flex-direction: column;
            }

            :host([theme~="icon-on-top"]) [part='prefix'] {
                margin: 0px;
            }

            /* dot breadcrumb button styles */
            :host([theme~='dot-button']) {
 	            color: var(--color-link-blue);
                font-size: large;
                border: none;
            }

            :host([theme~='dot-button']) [part~='label'] {
            	align-self: flex-end;
            }

        </style> 
  </template> 
 </dom-module>`;

document.head.appendChild($_documentContainer.content);
