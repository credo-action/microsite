var state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);


var events = {
    list: {},
    on: function(event, callback) {
        if (!this.list[event]) {
            this.list[event] = [];
        }

        this.list[event].push(callback);
    },
    trigger: function(event, data) {
        if (!this.list[event]) {
            return;
        }

        for (var i = 0; i < this.list[event].length; i++) {
            this.list[event][i](data);
        }
    },
};


var App = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <header>
                    <a className="flag" href="#petition"></a>

                    <h1>
                        Stop War
                        <br />
                        With Iran
                    </h1>

                    <div className="social">
                        <a className="facebook" href="#"></a>
                        <a className="twitter" href="#"></a>
                        <a className="email" href="#"></a>
                    </div>
                </header>

                <div className="meat">

                    <form id="petition">
                        <h2>Add your name</h2>
                        <button>
                            Click to Sign
                        </button>
                    </form>

                    <section className="description">
                        <h2>Don&apos;t let Republicans start another Mideast war.</h2>

                        Sed sit amet ipsum mauris. <a href="#">Maecenas</a> congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.

                        <div className="spacer" />

                        Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis.
                    </section>

                </div>

                <div className="logos"></div>

                <footer>
                    All content copyright &copy;2015 <a href="http://credoaction.com/" target="_blank">CREDO</a> and partner orgs.
                </footer>
            </div>
        );
    },
});


React.render(<App />, document.getElementById('app'));
