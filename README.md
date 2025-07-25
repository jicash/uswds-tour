# USWDS Tour

A lightweight, accessible, dependency-free JavaScript library for creating guided tours and tooltips on USWDS-based sites. Fully Section 508 compliant and easy to integrate.

## Features
- USWDS modal styling and utility classes
- Spotlight overlay with cutout for target elements
- Keyboard navigation and focus management
- Declarative tour support via HTML attributes
- No dependencies, works with any site


## Installation

### For direct browser use (no build tools)
Include the minified script in your HTML:

```html
<script src="uswds-tour.min.js"></script>
```
This will expose a global `USWDSTour` object for use in your scripts.

### For modern build tools (ES modules)
Import as a module:

```js
import { showTooltip, startTour } from 'uswds-tour';
```

## API

### showTooltip(options)
Show a single tooltip/modal for a target element.

**Options:**
- `element` (Element | string): Target element or selector
- `title` (string): Title for the modal
- `description` (string): Description text
- `position` (string): 'top', 'right', 'bottom', or 'left' (default: 'bottom')
- `className` (string): Extra classes for the modal
- `showControls` (boolean): Show Next/Back controls (default: false)
- `onNext`, `onPrev`, `onClose` (function): Event handlers
- `isLastStep` (boolean): If true, "Next" button says "End Tour"

### startTour(steps, options)
Start a multi-step guided tour.

- `steps`: Array of step objects (same as showTooltip options, minus handlers)
- `options`: Optional hooks:
  - `onStart` (function): Called when tour starts
  - `onComplete` (function): Called when tour ends
  - `onStepChange` (function): Called on each step

#### Declarative Tour
You can also add `data-tour-step`, `data-tour-title`, and `data-tour-description` attributes to elements. Call `startTour()` with no arguments to auto-detect steps.

## Example

```js
USWDSTour.startTour([
  {
    element: '#myButton',
    title: 'Welcome',
    description: 'Click here to start!'
  },
  {
    element: '#nextSection',
    title: 'Next',
    description: 'This is the next step.'
  }
]);
```

## Accessibility
- Fully keyboard accessible
- ARIA roles and focus management
- Overlay and modal are screen reader friendly

## License
Apache-2.0. See LICENSE.md for details.
