BootstrapDialog.show({
  title: 'Button Hotkey',
  message: $('<textarea class="form-control" placeholder="Try to input multiple lines here..."></textarea>'),
  buttons: [{
    label: '(Enter) Button A',
    cssClass: 'btn-primary',
    hotkey: 13, // Enter.
    action: function() {
      alert('You pressed Enter.');
    }
  }]
});
