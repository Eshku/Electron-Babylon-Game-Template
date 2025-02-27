jQuery.fn.extend({
  fadeInFlex: function (timing) {
    this.css('display', 'flex').hide().fadeIn(timing)
    return this
  },
})

$.fn.extend({
  toggleText: function (a, b) {
    return this.text(this.text() == b ? a : b)
  },
})

