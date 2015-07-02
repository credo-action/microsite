var state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);
state.pageShortName = 'stop_war_with_iran';
state.query = getQueryVariables();


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


function getQueryVariables() {
    var variables = {};

    var queryString = location.search.substr(1);
    var pairs = queryString.split('&');

    for (var i = 0; i < pairs.length; i++) {
        var keyValue = pairs[i].split('=');
        variables[keyValue[0]] = keyValue[1];
    }

    return variables;
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

                <form onSubmit={ this.onSubmit } method="POST" action="https://act.credoaction.com/act/" accept-charset="utf-8">
                    <h2>Add your name</h2>

                    <div className="text-fields">
                        <input placeholder="First and Last Name" name="name" />
                        <input placeholder="Email" name="email" data-pattern-name="email" type="email" />
                        <input placeholder="Address" name="address1" />
                        <input placeholder="Zip Code" name="zip" data-pattern-name="zip" type="tel" />
                    </div>

                    <div className="hidden">
                        <input type="hidden" name="page" value={ state.pageShortName } />
                        <input type="hidden" name="want_progress" value="1" />
                        <input type="hidden" name="country" value="United States" />
                        <input type="hidden" name="js" value="1" />
                        <input type="hidden" name="action_user_agent" value={ navigator.userAgent } />
                        <input type="hidden" name="form_name" value="act-petition" />
                        <input type="hidden" name="url" value={ location.href } />
                        <input type="hidden" name="opt_in" value="1" />
                        <input type="hidden" name="source" value={ state.query.source || 'CREDO' } />
                    </div>

                    <div className="disclaimer">
                        <label>
                            <input name="action_optin_iranswap" type="checkbox" />

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
        var inputs = this.getDOMNode().querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var value = input.value.trim();

            if (!value) {
                alert('Please enter your ' + input.getAttribute('name') + '.');
                input.focus();
                e.preventDefault();
                return;
            }

            var patternName = input.getAttribute('data-pattern-name');
            if (patternName && this.patterns[patternName]) {
                var pattern = this.patterns[patternName];
                var regex = new RegExp(pattern);

                if (!regex.test(value)) {
                    alert('Please enter a valid ' + input.getAttribute('name') + '.');
                    input.focus();
                    e.preventDefault();
                    return;
                }
            }
        }
    },
});


var App = React.createClass({
    renderDescription: function() {
        return (
            <div className="description">
                <h2>Sign the petition: Defend the Iran deal and stop Republicans from starting a war with Iran</h2>

                This is the final showdown to stop Republicans from starting a war with Iran.
                <div className="spacer" />

                The United States, Iran and five other world powers announced a historic deal to dramatically curb Iran&apos;s nuclear program in exchange for easing international sanctions on Iran.
                <div className="spacer" />

                Republicans are trying to sabotage the deal, put us back on the path to confrontation with Iran and start a war – but they can&apos;t do it unless Democrats help them.
                <div className="spacer" />

                We need to build an impenetrable firewall in Congress to prevent Republicans from passing any legislation to kill the deal and putting us back on the path to confrontation and war. Tell Democrats to go on record in support of the deal.
                <div className="spacer" />

                We&apos;ll send your message to your senators and member of Congress, as well as to House and Senate Democratic leadership.
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
                        <div className='sp_14462 sp_fb_small facebook'></div>
                        <div className='sp_14463 sp_tw_small twitter'></div>
                        <div className='sp_14461 sp_em_small email'></div>
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

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);
    },
});


React.render(<App />, document.getElementById('app'));
