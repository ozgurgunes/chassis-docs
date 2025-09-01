// NOTICE!!! Initially embedded in our docs this JavaScript
// file contains elements that can help you create reproducible
// use cases in StackBlitz for instance.
// In a real project please adapt this content to your needs.
// ++++++++++++++++++++++++++++++++++++++++++

/*
 * JavaScript for Chassis's docs (https://chassis-ui.com/)
 * Copyright 2011-2025 The Chassis Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global chassis: false */

export default () => {
  // --------
  // Tooltips
  // --------
  // Instantiate all tooltips in a docs or StackBlitz
  document.querySelectorAll('[data-cx-toggle="tooltip"]')
    .forEach(tooltip => {
      new chassis.Tooltip(tooltip)
    })

  // --------
  // Popovers
  // --------
  // Instantiate all popovers in docs or StackBlitz
  document.querySelectorAll('[data-cx-toggle="popover"]')
    .forEach(popover => {
      new chassis.Popover(popover)
    })

  // -------------------------------
  // Toasts
  // -------------------------------
  // Used by 'Placement' example in docs or StackBlitz
  const toastPlacement = document.getElementById('toastPlacement')
  if (toastPlacement) {
    document.getElementById('selectToastPlacement').addEventListener('change', function () {
      if (!toastPlacement.dataset.originalClass) {
        toastPlacement.dataset.originalClass = toastPlacement.className
      }

      toastPlacement.className = `${toastPlacement.dataset.originalClass} ${this.value}`
    })
  }

  // Instantiate all toasts in docs pages only
  document.querySelectorAll('.cxd-example .toast')
    .forEach(toastNode => {
      const toast = new chassis.Toast(toastNode, {
        autohide: false
      })

      toast.show()
    })

  // Instantiate all toasts in docs pages only
  // js-docs-start live-toast
  const toastTrigger = document.getElementById('liveToastButton')
  const toastLiveExample = document.getElementById('liveToast')

  if (toastTrigger) {
    const toastChassis = chassis.Toast.getOrCreateInstance(toastLiveExample)
    toastTrigger.addEventListener('click', () => {
      toastChassis.show()
    })
  }
  // js-docs-end live-toast

  // -------------------------------
  // Notifications
  // -------------------------------
  // Used in 'Show live notification' example in docs or StackBlitz

  // js-docs-start live-notification
  const notificationPlaceholder = document.getElementById('notificationPlaceholder')
  const appendNotification = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="notification ${type} dismissible fade show" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="close-button" data-cx-dismiss="notification" aria-label="Close"></button>',
      '</div>'
    ].join('')

    notificationPlaceholder.append(wrapper)
  }

  const notificationTrigger = document.getElementById('notificationButton')
  if (notificationTrigger) {
    notificationTrigger.addEventListener('click', () => {
      appendNotification('Nice, you triggered this notification message!', 'success')
    })
  }
  // js-docs-end live-notification

  // --------
  // Carousels
  // --------
  // Instantiate all non-autoplaying carousels in docs or StackBlitz
  document.querySelectorAll('.carousel:not([data-cx-ride="carousel"])')
    .forEach(carousel => {
      chassis.Carousel.getOrCreateInstance(carousel)
    })

  // -------------------------------
  // Checks & Radios
  // -------------------------------
  // Indeterminate checkbox example in docs and StackBlitz
  document.querySelectorAll('.cxd-example-indeterminate [type="checkbox"]')
    .forEach(checkbox => {
      if (checkbox.id.includes('Indeterminate')) {
        checkbox.indeterminate = true
      }
    })

  // -------------------------------
  // Links
  // -------------------------------
  // Disable empty links in docs examples only
  document.querySelectorAll('.cxd-content [href="#"]')
    .forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault()
      })
    })

  // -------------------------------
  // Modal
  // -------------------------------
  // Modal 'Varying modal content' example in docs and StackBlitz
  // js-docs-start varying-modal-window
  // JavaScript to handle dynamic content in the modal
  const dynamicModal = document.getElementById('dynamicModal')
  if (dynamicModal) {
    dynamicModal.addEventListener('show.cx.modal', event => {
      // Button that triggered the modal
      const button = event.relatedTarget

      // Extract data from data-cx-* attributes
      const recipient = button.getAttribute('data-cx-whatever')

      // Update the modal's content.
      const modalTitle = dynamicModal.querySelector('.modal-title')
      const recipientInput = dynamicModal.querySelector('#recipient-name')

      modalTitle.textContent = `New message to ${recipient}`
      recipientInput.value = recipient
    })
  }
  // js-docs-end varying-modal-window

  // -------------------------------
  // Offcanvas
  // -------------------------------
  // 'Offcanvas components' example in docs only
  const myOffcanvas = document.querySelectorAll('.cxd-example-offcanvas .offcanvas')
  if (myOffcanvas) {
    myOffcanvas.forEach(offcanvas => {
      offcanvas.addEventListener('show.cx.offcanvas', event => {
        event.preventDefault()
      }, false)
    })
  }
}
