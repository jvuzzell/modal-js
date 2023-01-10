# Modal-Popups-js

Plugin for creating modals and popups. 

<br>

**Table of contents** 
- [Installation](#installation)
- Examples
    - [Basic Usage](#basic-usage)
    - [Multiple Triggers for One Popup](#multiple-triggers-for-one-popup)
    - [Custom Trigger Events](#trigger-events)
    - [Custom Callbacks](#)
- [Public Methods](#public-methods) 
    - Expandables - Class
        - .getModal()
        - .getModals() 
        - .registerModal()
        - .addCloseModalEvents()
    - Expandable - Instance 
        - .toggle()
        - .isVisible()
    - InitModals()
- [HTML Attributes](#html-attributes)
    - Body Tag & Overlay
    - Containers
    - Triggers 
    - Target

<br>

---

## Installation 

<br>

You can use NPM to download package into your project 
```
npm install modal-popups-js
```
OR you can import the module directly in your project with ES6 Modules

```HTML
<script type="module">
    import { Modals, initModals } from './modals-js/modals.js'; 
</script>
```

<br>

---

## Basic Usage
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/modal-js/tree/main/demo) in repo for complete example

<br>

**CSS**
```HTML
<link rel="stylesheet" href="./modals-js/modals.css">
```

**HTML**
```HTML
<button data-modal-trigger data-modal-target="example-modal">
    Trigger 1
</button> 

<div class="modal-containers">
    <div class="modal-container" data-modal-container="hidden" data-modal-target="example-modal">
        <p>Content goes here</p>
        <button data-close-modal="example-modal">Okay</button>
    </div>
</div>

```

**JavaScript**
```Javascript
<script type="module">
    // ES6 Module Import
    import { Modals, initModals } from './modals-js/modals.js'; 

    // Initialize Plugin
    initModals();
</script>
```

<br>

---

## Multiple Triggers for One Popup
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/modal-js/tree/main/demo) in repo for complete example

<br>


**HTML**
```HTML
<button data-modal-trigger data-modal-target="example-modal">
    Trigger 1
</button> 

<button data-modal-trigger data-modal-target="example-modal">
    Trigger 2
</button> 

<div class="modal-containers">
    <div class="modal-container" data-modal-container="hidden" data-modal-target="example-modal">
        <p>Content goes here</p>
        <button data-close-modal="example-modal">Okay</button>
    </div>
</div>

```
<br>

---
## Trigger Events
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/modal-js/tree/main/demo) in repo for complete example

<br>

By default the trigger event for modals is a click event. However, you can use other events by updating the **[data-modal-trigger]** attribute. 

<br>

**HTML**
```HTML
<button data-modal-trigger="mouseover" data-modal-target="example-modal">
    Trigger 1
</button> 

<div class="modal-containers">
    <div class="modal-container" data-modal-container="hidden" data-modal-target="example-modal">
        <p>Content goes here</p>
        <button data-close-modal="example-modal">Okay</button>
    </div>
</div>

```

**JavaScript**
```Javascript
<script type="module">
    // ES6 Module Import
    import { Modals, initModals } from './modals-js/modals.js'; 

    // Initialize Plugin
    initModals();
</script>
```

<br>

---
## Custom Callback

<br>

The default event for triggering modal visibility can be overwritten by adding [data-modal-override] and [data-modal-callback] attributes to the modal trigger. If you a developer does this, they become responsible for toggling the modal visibility exchange for being able to add custom behavior around the interaction.

<br>

**HTML**
```HTML
<button data-modal-trigger data-modal-target="example-modal">
    Trigger 1
</button> 

<div class="modal-containers">
    <div class="modal-container" data-modal-container="hidden" data-modal-target="example-modal" data-modal-override="true" data-modal-callback="exampleCallback">
        <p>Content goes here</p>
        <button data-close-modal="example-modal">Okay</button>
    </div>
</div>

```

**JavaScript**
```Javascript
<script type="module">
    // ES6 Module Import
    import { Modals, initModals } from './modals-js/modals.js'; 

    // Initialize Plugin
    initModals();

    // Custom callback where the developer has to trigger the modal's visibility 
    window.exampleCallback = ( event ) => {
        let targetName = event.target.getAttribute( 'data-modal-target' ); 
        Modals.getModal( targetName ).toggle(); 
        alert( 'Custom callback triggered on ' + targetName + '; visible = ' + Modals.getModal( targetName).getSettings().visible );
    } 
</script>
```

<br>

---

## Public Methods

<br>

|Object|Method|Description|
|---|---|---|
||initModals()|Initializes modals in the document by calling the Expandables.registerModal() for every modal within the .modal-containers HTML element.|
|Expandables|.getModal( name )| Expected string to equal value of [data-modal-target] attribute on modal HTML element. Returns single HTML element for corresponding modal. |
||.getModals()| Returns HTMLCollection of all modals. |
||.registerModal( HTMLElement )| Expected HTML element; Takes an HTML element representing the modal. The attributes are read from the modal element and used to build a modal instance. |
||.addCloseModalEvents()| Used when modals are registered outside of the initModals() method to attach eventlisteners to the window that detect whether the modal parent container or a corresponding close button has been clicked. |
|Expandable|.toggle()|Swaps the modal between 'visible' and 'hidden' states.|
||.isVisible()|Returns boolean of true or false representing whether the modal is visible.|



<br>

---

## HTML Attributes 
<br>

|HTML Element|Attribute(s)|Description|
|------------|---------|-----------|
|body|[data-modal][data-overlay]|The plugin manages these attributes and they can be used to manage overlays or other HTML elements within the document.<br>- [data-modal] Expected values 'active' or 'inactive'<br>- [data-overlay] Expected values 'active' or 'inactive' |
| Trigger - button (or anything clickable) | [data-modal-target]<br>[data-modal-trigger] | - [data-modal-target] Expected value equal to name of the modal to reveal <br>- [data-modal-target] Add to element where an event (such as a click), will be used to reveal the target modal. Click event is used by default, but developers can set the value of this attribute to another event type (i.e. 'mouseover')|
| |[data-modal-override]<br>[data-modal-callback]| - [data-modal-override] Expected value true. If set, this attribute instructs  <br>- [data-modal-callback] Name of custom event handler|
| div (or anything to be revealed) | data-modal-container | Denotes a modal; no expected value |
| div[data-modal-container] | data-modal-target | Denotes target of a [data-trigger-modal]. When the trigger event fires, then this modal will be revealed | 
| button (or anything clickable) :not([data-modal-trigger]) | data-close-modal | HTML element used to close modal. Expected value, is the name of the target modal.<br>Example [data-close-modal="example-modal"] === [data-modal-target="example-modal"] |