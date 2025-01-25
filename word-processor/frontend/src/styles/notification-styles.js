const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="apm-vaadin-notification-card-styles" theme-for="vaadin-notification-card"> 
  <template> 
   <style>
	        
	        	:host([part='content']) {
	        		padding: 0px;
	        	}
	        
	        	flow-component-renderer {
	        		width: 100%;
	        	}
	        
	        	:host([theme='notification-general']) [part='overlay'] {
	        		border: 2px solid var(--application-main-color) ;
	        		background: #fff;
	        	}
	        	
	        	:host([theme='notification-saved']) [part='overlay'] {
	        		border-bottom: 2px solid green;
	        	}
	        	
	        	:host([theme='notification-error']) [part='overlay'] {
	        		background: red;
	        	}
	        	
	        	:host([theme='notification-error']) {
	        		max-width: 60vw;
	        		width: auto;
	        	}
	        
	        	#vaadin-notification-card {
	        		background: green;
	        	}
	        
			    :host flow-component-renderer {
				    width: 100%;
				} 
			
	        </style> 
  </template> 
 </dom-module><custom-style> 
  <style>
    
    </style> 
 </custom-style>`;

document.head.appendChild($_documentContainer.content);

