# USWDS Tour

An accessible, dependency-free JavaScript library for creating guided tours and tooltips on USWDS-based sites. Fully Section 508 compliant, easy to integrate, and flexible: define steps via HTML attributes or programmatically.

## Features
- USWDS modal styling and utility classes
- Spotlight overlay with cutout for target elements
- Keyboard navigation and focus management
- Flexible step definition: via HTML attributes or JS array
- Auto-initialization for tour start and manual tooltips
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
Start a multi-step guided tour. You can define steps in two ways:

- **Programmatic:** Pass an array of step objects to `USWDSTour.startTour(stepsArray, options)`.
- **Declarative:** Add `data-tour-step`, `data-tour-title`, and `data-tour-description` attributes to elements. Call `startTour()` with no arguments to auto-detect steps from the DOM.

#### Auto-initialization
- Add `data-tour-start` to any element (e.g., a button) to automatically attach a click listener that starts the tour—no JS required.
- Add `data-tour-trigger="your-trigger-id"` to any element to automatically show a tooltip when another element with that ID is clicked.

## Examples

**Programmatic steps:**
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

**Declarative steps:**
```html
<button data-tour-step="1" data-tour-title="Welcome" data-tour-description="Click here to start!">Start</button>
<!-- ...more steps... -->
```
Then call:
```js
USWDSTour.startTour();
```

**Auto-init tour start (no JS needed):**
```html
<button data-tour-start>Start Tour</button>
```

**Manual tooltip trigger:**
```html
<button id="show-tooltip-3">Show Tooltip</button>
<button data-tour-trigger="show-tooltip-3" ...>Target</button>
```

## Accessibility
- Fully keyboard accessible
- ARIA roles and focus management
- Overlay and modal are screen reader friendly

## License
Apache-2.0. See LICENSE.md for details.
