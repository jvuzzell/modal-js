export let Modals = (function() {

    let store = {};

    let Constructor = function( options ) {

        var publicMethods = {};
        var settings; 

        // Private
        var show = function( target ) {
            if( settings.targetGroup != null ) hideSiblings( settings.targetGroup );  
            target.setAttribute( 'data-modal-container', 'visible' ); 
            publicMethods.updateState( { 'visible' : true } );

            document.querySelector( 'body' ).setAttribute( 'data-modal', 'active' );
            document.querySelector( 'body' ).setAttribute( 'data-overlay', 'active' );
        }

        var hide = function( target ) {
            target.setAttribute( 'data-modal-container', 'hidden' );
            publicMethods.updateState( { 'visible' : false } );
        }

        // Public

        publicMethods.toggle = function toggle( e ) {

            if( e !== undefined ) {
                // Check for field to update based on result of modal Transaction
                settings.fieldToUpdate = ( e.target.getAttribute( 'data-target-update-field' ) == undefined ) ? null : e.target.getAttribute( 'data-target-update-field' ); 
            }

            if( settings.container.getAttribute( 'data-modal-container' ) == 'hidden' ) {
                show( settings.target );
            } else {
                hide( settings.target );
            }        

        }

        publicMethods.getFieldToUpdate = function getFieldToUpdate() {
            return ( settings.fieldToUpdate == undefined ) ? null : settings.fieldToUpdate;  
        }
        
        publicMethods.init = ( options ) => {
        
            settings = options; // This makes arguments available in the scope of other methods within this object 

            if( settings.override === 'true' ) {

                try {    
                    settings.callback = ( event ) => { 
                        window[ settings.customCallback ]( event );
                    }; 
                } catch( error ) {
                    console.error( 'Modal Plugin, custom callback for Modal ID: ' + settings.id + '  failed. Message: ' + error.message );
                }

            } else {
                settings.callback = ( event ) => Modals.getModal( settings.id ).toggle( event );
            }

            for( let i = 0; i < settings.triggers.length; i++ ) {
                
                settings.triggers[ i ].setAttribute( 'data-trigger-id', i );
                let triggerEvent = settings.triggers[ i ].getAttribute( 'data-modal-trigger' ); 
                triggerEvent = ( triggerEvent !== undefined && triggerEvent !== '' ) ? triggerEvent : 'click'; 
                settings.triggers[ i ].addEventListener( triggerEvent, settings.callback );

            }

            function transitionEnd( event ) { 

                let multipleOpenModals = document.querySelectorAll( '[data-modal-container="visible"]' );

                if( multipleOpenModals.length < 1 ) { 
                        document.querySelector( 'body' ).setAttribute( 'data-modal', 'inactive' );
                        document.querySelector( 'body' ).setAttribute( 'data-overlay', 'inactive' );
                }

            }

            settings.target.addEventListener( 'transitionend', transitionEnd ); 

            if( !settings.visible ) {
                hide( settings.target );
            }

        };

        publicMethods.updateState = function( state ) {
            
            for( let setting in state ) {
                settings[ setting ] = state[ setting ];
            }

        }
        
        publicMethods.getSettings = function() {
            return settings;
        }

        publicMethods.isVisible = function() {
            return settings.visible;
        }

        // Initialize plugin
        publicMethods.init( options );
        
        return publicMethods;
        
    }

    const setModal = function( name, obj ) {
        store[ name ] = obj;
    }

    const getModal = function( name ) {
        return store[ name ];
    }
	
    const getModals = function() {
        return store;
    }

    const addCloseModalEvents = function() {

        const modalParentContainer = document.querySelector( '.modal-containers' );

        // Collapse all containers if Fly-Container tag is clicked
        // Allow users to exit modal without having to click 'close' button
        window.addEventListener( 'click', function( event ) {

            const closeTrigger = event.target.getAttribute( 'data-close-modal' ); 
            
            //If you click in the gray overlay space (the main modal parent container), hide every modal.
            if( event.target == modalParentContainer ) { 
                let modals = document.querySelectorAll( '[data-modal-container]' );

                for( let i = 0; i < modals.length; i++ ) {
                    const modal = Modals.getModal( modals[i].getAttribute('data-modal-target') );
                    if( modal.isVisible() ) {
                        modal.toggle();
                    }
                }     
            }

            //If you click the X button, close that single modal.
            if( closeTrigger !== null ) { 
                Modals.getModal( closeTrigger ).toggle();
            }

        });

    }

    const registerModal = function( modal, iterator ) {

        let modalTarget          = modal;
        let modalName            = modalTarget.getAttribute( 'data-modal-target' );
        let modalTriggerSelector = '[data-modal-target=' + modalName + '][data-modal-trigger]';
        let modalTriggers        = document.querySelectorAll( modalTriggerSelector ); 
        let isVisible            = ( modal.getAttribute( 'data-modal-container' ) == 'hidden' ) ? false : true;
        let modalCallback        = null;
        let callbackName;

        //modalCallback will be called if you set modalOverride to 'true' (string val).
        //The first (and only) argument to modalCallback will be e (the click event).
        //If you do this, you will need to open the modal on your own. You will also need to obtain the field to update.
        //See toggle() above for how to do this. Or, you could just call toggle() on your own and pass e along to it.
        let modalOverride = modal.getAttribute( 'data-modal-override' );

        if( modalOverride !== undefined && modalOverride !== 'false' ) {
            callbackName = modal.getAttribute( 'data-modal-callback' ); 
            modalCallback = ( callbackName == undefined ) ? null : callbackName; // string, name of function to call
            if( modalCallback == null ) { console.warn( 'Modals Plugin did not detect custom callback for override, Node:', modal ); }
        }

        if( modalTarget == null ) { console.warn( 'Modal Plugin, did not detect target, Node:', modal ); }
        if( modalTriggers.length == 0 ) { console.warn( 'Modal Plugin, did not detect trigger, Node:', modal ) ; }

        //As you instantiate new modalPlugins, insert them in the modalStore object, indexed by the name of the modal.
        this.storeModal( 
            modalName,
            new Modals.launch({
                id               : modalName,
                container        : modalTarget, 
                triggerSelector  : modalTriggerSelector, 
                triggers         : modalTriggers,  
                target           : modalTarget, 
                override         : modalOverride,
                customCallback   : modalCallback,
                visible          : isVisible,
            })
        );

        function findAncestor(el, sel) {
            while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
            return el;
        }

    }
    
    const closeModal = function( modalName ) {
	    this.getModal( modalName ).toggle();
    }

    return { 
        launch              : Constructor, 
        registerModal       : registerModal, 
        storeModal          : setModal, 
        getModal            : getModal, 
		getModals           : getModals,
        addCloseModalEvents : addCloseModalEvents, 
        closeModal          : closeModal
    };  
  
})();

export let initModals = function( modalContainer = '.modal-containers' ){

    const modalParentContainer = document.querySelector( modalContainer );
    let modals = modalParentContainer.querySelectorAll( '[data-modal-container]' );
    if( modals.length === 0 ) { console.warn( 'Modal plugin not initialized; div.modal-container not defined' ); return; }; 

    for( let i = 0; i < modals.length; i++ ) {
        Modals.registerModal( modals[ i ], i );
    }

    Modals.addCloseModalEvents();

}