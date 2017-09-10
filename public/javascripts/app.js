$(document).ready(function() {
  $('#test').click(function() {
    $('#circle-bar').addClass('p55');

    $({countNum: $('.number').text()}).animate({countNum: 55}, {
      duration: 5000,
      easing:'linear',
      step: function() {
        $('.number').text(Math.floor(this.countNum));
      },
      complete: function() {
        $('.number').text(this.countNum);
      }
    });
  });
});
