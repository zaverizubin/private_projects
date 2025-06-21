import "@vaadin/vaadin-lumo-styles/color.js";
import "@vaadin/vaadin-lumo-styles/typography.js";
import "@vaadin/vaadin-lumo-styles/badge.js";
import "@vaadin/vaadin-icons/vaadin-icons.js";
import "./notification-styles.js";
import "./dialog-styles.js";
import "./vaadin-styles.js";
import "./grid-styles.js";
import "./button-styles.js";
import "./font-awesome.js";

const $_documentContainer = document.createElement("template");

$_documentContainer.innerHTML = `<dom-module id="shared-styles"> 
  <template> 
   <style>
            .text-color-white {
                color: white;
            }

            .text-link-color {
                color: var(--color-link-blue);
            }

            .text-color-application-main-color {
                color: var(--application-main-color);
            }

            .no-padding-on-top {
                padding-top: 0px;
                padding-right: var(--lumo-space-m);
                padding-left: var(--lumo-space-m);
                padding-bottom: var(--lumo-space-m);
            } 
            
            .dialog-header-text {
                font-size: 20px;
                align-self: center;
            }
            
            .cursor-pointer{
                cursor: pointer;
            }
        </style> 
  </template> 
 </dom-module>
 <custom-style> 
  <style include="shared-styles font-awesome lumo-badge">
        body {
            /* Avoid horizontal scrollbars, mainly on IE11 */
            overflow-x: hidden;
        }

        /* Colors */
        html {
            --color-link-red: #FF0000;
            --color-link-blue: #007cfc;
            --color-nexus-blue: #41537f;
            --color-nexus-blue-rgb: 65, 83, 127;
            --color-nexus-dark-grey: #262729;
            --main-header-height: 50px;
            --application-main-color: var(--color-nexus-blue);
            --application-main-color-rgb: var(--color-nexus-blue-rgb);
            --lumo-primary-color: var(--application-main-color);
            --lumo-primary-color-50pct: rgba(var(--application-main-color-rgb), 0.5);
            --lumo-primary-color-20pct: rgba(var(--application-main-color-rgb), 0.2);
        }

        

        /* Make the content of the notification full width by default */
        vaadin-notification-card flow-component-renderer {
            width: 100%;
        }

        .text-link-color {
            color: var(--color-nexus-blue);
        }

        

        
  
    </style> 
 </custom-style>`;

document.head.appendChild($_documentContainer.content);
