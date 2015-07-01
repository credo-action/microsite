var state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);
state.pageShortName = 'stop_war_with_iran';


var signatureGoals = {
    '450': 500,
    '900': 1000,
    '2400': 2500,
    '4500': 5000,
    '9500': 10000,
    '13000': 15000,
    '22000': 25000,
    '45000': 50000,
    '70000': 75000,
    '90000': 100000,
    '140000': 150000,
    '190000': 200000,
    '240000': 250000,
    '290000': 300000,
    '340000': 350000,
    '390000': 400000,
    '490000': 500000,
};

function generateGoal(current) {
    for (var bar in signatureGoals) {
        if (current < +bar) {
            return signatureGoals[bar];
        }
    }

    return 750000;
}


function commafy(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// Setup shortcuts for AJAX.
var ajax = {
    get: function(url, callback) {
        callback = callback || function() {};

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
        };
        xhr.open('get', url, true);
        xhr.send();
    },

    post: function(url, formData, callback) {
        callback = callback || function() {};

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
        };
        xhr.open('post', url, true);
        xhr.send(formData);
    },
};


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


var SignatureProgress = React.createClass({
    componentDidMount: function() {
        window.onActionKitProgress = this.onActionKitProgress;

        var script = document.createElement('script');
        script.src = 'https://act.credoaction.com/progress/' + state.pageShortName + '?callback=onActionKitProgress';
        document.body.appendChild(script);
    },

    getInitialState: function() {
        return {
            current: 0,
            goal: 0,
            percent: -1,
        };
    },

    onActionKitProgress: function(res) {
        var current = res.total.actions;
        var goal = generateGoal(current);
        var percent = Math.floor(100 * current / goal);

        this.setState({
            current: current,
            goal: goal,
            percent: percent,
        });
    },

    render: function(e) {
        if (this.state.percent < 0) {
            return (
                <div className="progress">
                    <div className="bar">
                        <div className="filled" />
                    </div>
                </div>
            );
        }

        var css = {
            opacity: 1,
            width: Math.min(this.state.percent, 100) + '%',
        };

        return (
            <div className="progress visible">
                <div className="bar">
                    <div className="filled" style={ css } />
                </div>

                <div className="percent">
                    { this.state.percent }%
                </div>

                <div className="summary">
                    We&apos;ve reached { commafy(this.state.current) } of our goal of { commafy(this.state.goal) }.
                </div>
            </div>
        );
    },
});


var EmailForm = React.createClass({
    render: function() {
        return (
            <section className="form">

                <SignatureProgress />

                <form onSubmit={ this.onSubmit }>
                    <h2>Add your name</h2>

                    <div className="text-fields">
                        <input placeholder="First and Last Name" name="name" />
                        <input placeholder="Email" name="email" data-pattern-name="email" type="email" />
                        <input placeholder="Address" name="address" />
                        <input placeholder="Zip Code" name="zip" data-pattern-name="zip" type="tel" />
                    </div>

                    <div className="disclaimer">
                        <label>
                            <input name="consent" type="checkbox" />

                            I consent to being added to the email
                            <br />
                            list of one or more participating orgs.
                        </label>
                    </div>

                    <button>
                        Click to Sign
                    </button>
                </form>

            </section>
        );
    },

    patterns: {
        zip: /^[0-9]*(-[0-9]+)?$/,
        email: /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/i,
    },

    onSubmit: function(e) {
        e.preventDefault();

        var inputs = this.getDOMNode().querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var value = input.value.trim();

            if (!value) {
                alert('Please enter your ' + input.getAttribute('name') + '.');
                input.focus();
                return;
            }

            var patternName = input.getAttribute('data-pattern-name');
            if (patternName && this.patterns[patternName]) {
                var pattern = this.patterns[patternName];
                var regex = new RegExp(pattern);
                
                if (!regex.test(value)) {
                    alert('Please enter a valid ' + input.getAttribute('name') + '.');
                    input.focus();
                    return;
                }
            }
        }

        alert('TODO: Integrate with ActionKit.')
    },
});


var App = React.createClass({
    renderDescription: function() {
        return (
            <div className="description">
                <h2>Don&apos;t let Republicans start another Mideast war.</h2>

                Sed sit amet ipsum mauris. <a href="#petition">Maecenas</a> congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.

                <div className="spacer" />

                Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis.
            </div>
        );
    },

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
                        <a className="facebook" href="#facebook"></a>
                        <a className="twitter" href="#twitter"></a>
                        <a className="email" href="#email"></a>
                    </div>
                </header>

                <div className="meat">

                    <section className="description-mobile">{ this.renderDescription() }</section>

                    <div id="petition" />

                    <EmailForm />

                    <section className="description-desktop">{ this.renderDescription() }</section>

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
