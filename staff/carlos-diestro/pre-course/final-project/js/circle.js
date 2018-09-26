var radius = '12em';
var start = -90;
var $elements = $('li');
var slice = 360 / $elements.length;

$elements.each(function(i) {
  var $self = $(this);
  var rotate = slice * i + start;
  var rotateReverse = rotate * -1;

  $self.css({
    'transform': 'rotate(' + rotate + 'deg) translate(' + radius + ') rotate(' + rotateReverse + 'deg)'
  });
});