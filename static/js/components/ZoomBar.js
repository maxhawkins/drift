var ZoomBar = function() {
    var $el = this.$el = document.createElement("div");
    $el.className = "zoom";
    $el.innerText = 'zoom';

    // var $amount = this.$amount = document.createElement("div");
    // $amount.className = "amount";
    // this.$el.appendChild(this.$amount);

    $el.onmousedown = function(ev) {
        // XXX: abstract to handle touch events as well
        ev.preventDefault();

        window.onmousemove = function(ev) {
            ev.preventDefault();

            var amnt = (ev.clientX - this.$el.offsetLeft) / this.$el.offsetWidth;
            amnt = Math.min(1, Math.max(0, amnt));
            if (this.onchange) {
              this.onchange(amnt);
            }

        }.bind(this)
        window.onmouseup = function(ev) {
            ev.preventDefault();
            window.onmousemove = null;            
            window.onmouseup = null;
        }
    }.bind(this)
}
