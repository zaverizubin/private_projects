const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="apm-vaadin-styles" theme-for="vaadin-*"> 
  <template> 
   <style>
            /* Required indicator on field labels */
            [part="label"]::after {
                content: var(--lumo-required-field-indicator, "•");
                transition: opacity 0.2s;
                opacity: 0;
                color: var(--lumo-error-text-color);
                position: absolute;
                right: 0;
                width: unset;
                text-align: center;
                font-size: 20px;
                top: -2px;
            }
        </style> 
  </template> 
 </dom-module>`;

document.head.appendChild($_documentContainer.content);

