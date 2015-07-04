// Check for outdated browsers.
(function() {
    var isIE = /MSIE (\d+)\./.test(navigator.userAgent);
    if (isIE) {
        var version = +isIE[1];
        if (version < 10) {
            alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
        }
    }

    if (/Android 2\.3/.test(navigator.userAgent)) {
        alert('Unfortunately your browser, Android 2.3, is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
    }
})();



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
        var values = {};
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

            values[input.name] = value;
        }

        sessionStorage.homeFormValues = JSON.stringify(values);
    },
});


var Header = React.createClass({
    render: function() {
        return (
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
        );
    },
});


var Footer = React.createClass({
    render: function() {
        return (
            <footer>
                All content copyright &copy;2015 <a href="http://credoaction.com/" target="_blank">CREDO</a> and partner orgs.
            </footer>
        );
    },
});


var Logos = React.createClass({
    render: function() {
        return (
            <div className="logos">
                <div className="constrainer">
                    <a target="_blank" href="http://credoaction.com/">
                        <img src="/images/logos/credo.png" />
                    </a>

                    <a target="_blank" href="http://www.codepink.org/">
                        <img src="/images/logos/codepink.png" />
                    </a>

                    <a target="_blank" href="http://livableworld.org/">
                        <img src="/images/logos/clw.png" />
                    </a>

                    <a target="_blank" href="http://www.dailykos.com/">
                        <img src="/images/logos/dailykos.jpg" />
                    </a>

                    <a target="_blank" href="http://justforeignpolicy.org/">
                        <img src="/images/logos/justforeignpolicy.png" />
                    </a>

                    <a target="_blank" href="http://leftaction.com/">
                        <img src="/images/logos/leftaction.png" />
                    </a>

                    <a target="_blank" href="http://moveon.org/">
                        <img src="/images/logos/moveon.png" />
                    </a>

                    <a target="_blank" href="http://other98.com/">
                        <img src="/images/logos/other98.png" />
                    </a>

                    <a target="_blank" href="http://www.pdamerica.org/">
                        <img src="/images/logos/pda.png" />
                    </a>

                    <a target="_blank" href="http://rootsaction.org/">
                        <img src="/images/logos/rootsaction.png" />
                    </a>

                    <a target="_blank" href="http://www.thenation.com/">
                        <img src="/images/logos/thenation.jpg" />
                    </a>

                    <a target="_blank" href="http://usaction.org/">
                        <img src="/images/logos/usaction.png" />
                    </a>

                    <a target="_blank" href="http://winwithoutwar.org/">
                        <img src="/images/logos/winwithoutwar.jpg" />
                    </a>
                </div>
            </div>
        );
    },
});


var HomePage = React.createClass({
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
            <div className="wrapper home-page">
                <Header />

                <div className="meat">

                    <section className="description-mobile">{ this.renderDescription() }</section>

                    <div id="petition" />

                    <EmailForm />

                    <section className="description-desktop">{ this.renderDescription() }</section>

                </div>

                <Logos />

                <Footer />
            </div>
        );
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);
    },
});


var CallForm = React.createClass({
    renderForm: function() {
        if (this.state.isCalling) {
            return (
                <div className="calling">
                    We&apos;re calling you now.
                </div>
            );
        } else {
            return (
                <div>
                    <h2>
                        Make a Call
                    </h2>

                    <input type="tel" name="phone" placeholder="Your phone number" ref="phone" />

                    <button>
                        Click to Connect
                    </button>

                    <div className="sidenote">
                        Or call <a href="tel:415-234-1515">(415) 234-1515</a> to connect.
                    </div>
                </div>
            );
        }
    },

    renderCount: function() {
        if (this.props.callCount > -1) {
            return (
                <div className="animation-fade-in">
                    <div className="headline">{ commafy(this.props.callCount) } Call{this.props.callCount !== 1 ? 's' : ''}</div>
                    <div className="label">completed</div>
                </div>
            );
        } else {
            return;
        }
    },

    onSubmit: function(e) {
        e.preventDefault();

        var phoneField = this.refs.phone.getDOMNode();
        var phone = phoneField.value.trim().replace(/[^\d]/g, '');
        if (phone.length < 10) {
            phoneField.focus();
            return alert('Please enter your 10 digit phone number.');
        }

        var campaignId, url;
        if (this.props.progressivesCount > 0) {
            campaignId = 'stop_war_with_iran_dynamic';
            url =
                'https://credo-action-call-tool.herokuapp.com/create' +
                '?campaignId=' + campaignId +
                '&userPhone=' + phone +
                '&zipcode=' + this.props.zip;
        } else {
            campaignId = 'stop_war_with_iran_static';
            url =
                'https://credo-action-call-tool.herokuapp.com/create' +
                '?campaignId=' + campaignId +
                '&userPhone=' + phone;
        }

        ajax.get(url);

        this.setState({
            isCalling: true,
        });
    },

    getInitialState: function() {
        return {
            isCalling: false,
        };
    },

    render: function() {
        return (
            <form className="call-form" onSubmit={ this.onSubmit }>
                <div className="count">
                    { this.renderCount() }
                </div>

                <div className="background">
                    { this.renderForm() }
                </div>
            </form>
        );
    },
});


var CallPage = React.createClass({
    render: function() {
        var css = {
            opacity: this.state.visible ? 1 : 0,
        };

        return (
            <div className="wrapper call-page">
                <Header />

                <div className="meat" style={ css }>

                    { this.getTitle() }

                    <div id="call-form" />

                    <CallForm
                        callCount={ this.state.callCount }
                        progressivesCount={ this.state.progressivesCount }
                        zip={ this.state.zip }
                    />

                    <div className="description description-call">
                        <h3>
                            Call script
                        </h3>

                        Hello, my name is { this.state.name || '__________' } and I&apos;m calling from { this.state.city || '__________' }. Republicans are trying to take us to war by sabotaging the Iran nuclear deal. I urge you to support the deal and stop the Republicans from starting another costly war in the Middle East.
                    </div>

                </div>

                <Logos />

                <Footer />
            </div>
        );
    },

    getTitle: function() {
        if (this.state.progressivesCount === 1) {
            return (
                <h2 className="thanks">
                    Thank you for signing. Now please call the Democrat who represents you in Congress and urge them to support the Iran nuclear deal.
                </h2>
            );
        } else if (this.state.progressivesCount > 1) {
            return (
                <h2 className="thanks">
                    Thank you for signing. Now please call the Democrats who represent you in Congress and urge them to support the Iran nuclear deal.
                </h2>
            );
        } else {
            return (
                <h2 className="thanks">
                    Thank you for signing. Now please call Democratic leaders in Congress and urge them to support the Iran nuclear deal.
                </h2>
            );
        }
    },

    onSunlightResponse: function(res) {
        var progressivesCount = 0;
        var legislators = JSON.parse(res).results;
        for (var i = 0; i < legislators.length; i++) {
            var legislator = legislators[i];
            if (legislator.party !== 'R') {
                progressivesCount++;
            }
        }

        this.setState({
            progressivesCount: progressivesCount,
            visible: true,
        });
    },

    onCountResponse: function(res) {
        var count = JSON.parse(res).count;

        this.setState({
            callCount: count,
        });
    },

    getInitialState: function() {
        return {
            callCount: -1,
            city: null,
            name: null,
            progressivesCount: 0,
            visible: false,
        };
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);

        if (sessionStorage.homeFormValues) {
            var values = JSON.parse(sessionStorage.homeFormValues);

            var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?apikey=3779f52f552743d999b2c5fe1cda70b6&zip=' + values.zip;
            ajax.get(url, this.onSunlightResponse);

            this.setState({
                name: values.name,
                zip: values.zip,
            });
        } else {
            this.setState({
                visible: true,
            });
        }

        // Get call count.
        ajax.get('https://credo-action-call-tool-meta.herokuapp.com/api/count/stop_war_with_iran_dynamic,stop_war_with_iran_static', this.onCountResponse);
    },
});


(function() {
    if (/^\/call\/?/.test(location.pathname)) {
        React.render(<CallPage />, document.getElementById('app'));
    } else {
        React.render(<HomePage />, document.getElementById('app'));
    }
})();
