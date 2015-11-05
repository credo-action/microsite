// Check for outdated browsers.
(function() {
    var isIE = /MSIE (\d+)\./.test(navigator.userAgent);
    if (isIE) {
        var version = +isIE[1];
        if (version < 10) {
            alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported. Please visit the site with a modern browser like Firefox or Chrome. Thanks!');
        }
    } else if (/Android 2\.3/.test(navigator.userAgent)) {
        alert('Unfortunately your browser, Android 2.3, is not supported. Please visit the site with a modern browser like Firefox or Chrome. Thanks!');
    } else if (typeof React === 'undefined') {
        alert('Unfortunately your browser is not supported. Please visit the site with a modern browser like Firefox or Chrome. Thanks!');
    }
})();



var state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);
state.pageShortName = 'obamas_wars';
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


function getSource() {
    if (state.query.source) {
        return state.query.source.trim().toLowerCase();
    } else {
        return null;
    }
}


function commafy(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getAKID() {
    if (state.query.akid) {
        var parts = state.query.akid.split('.');

        if (parts.length < 2) {
            return null;
        }

        return parts[1];
    } else {
        return null;
    }
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


var SignatureCount = React.createClass({
    componentDidMount: function() {
        window.onActionKitCount = this.onActionKitCount;

        var script = document.createElement('script');
        script.src = 'https://act.credoaction.com/progress/' + state.pageShortName + '?callback=onActionKitCount';
        document.body.appendChild(script);
    },

    getInitialState: function() {
        return {
            current: -1,
        };
    },

    onActionKitCount: function(res) {
        var current = res.total.actions;

        this.setState({
            current: current,
        });
    },

    render: function(e) {
        if (this.state.current < 0) {
            return (
                <div className="count" />
            );
        }
        return (
            <div className="count visible">
                <div>{ commafy(this.state.current) }</div>
                <div className="smaller">signatures</div>
            </div>
        );
    },
});


var EmailDisclaimer = React.createClass({
    hiddenFor: [
        'moveon',
    ],

    render: function() {
        var source = getSource();

        if (this.hiddenFor.indexOf(source) > -1) {
            return null;
        }

        return (
            <div className="disclaimer">
                <label>
                    You&#39;ll receive periodic updates on offers<br/>and activism opportunities.
                </label>
            </div>
        );
    },
});


var EmailForm = React.createClass({
    render: function() {
        var source, sourceField;
        source = getSource();
        if (source) {
            sourceField = (<input type="hidden" name="source" value={ getSource() } />);
        }

        return (
            <section className="form">

                <SignatureCount />

                <form onSubmit={ this.onSubmit } method="POST" action="https://act.credoaction.com/act/" accept-charset="utf-8">
                    <h2>Add your name</h2>

                    <div className="text-fields">
                        <input placeholder="First and Last Name" name="name" />
                        <input placeholder="Email" name="email" data-pattern-name="email" type="email" />
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
                        { sourceField }
                    </div>

                    <button>
                        Click to Sign
                    </button>

                    <EmailDisclaimer />

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

        try {
            sessionStorage.homeFormValues = JSON.stringify(values);
        } catch (e) {
            // Cookies disabled
        }
    },
});


var Header = React.createClass({
    render: function() {
        return (
            <header>
                <a className="flag" href="http://credoaction.com"></a>
                <div className="social">
                    <div className='sp_16670 sp_fb_small facebook'></div>
                    <div className='sp_16671 sp_tw_small twitter'></div>
                    <div className='sp_16669 sp_em_small email'></div>
                </div>`
            </header>
        );
    },
});


var Footer = React.createClass({
    render: function() {
        return (
            <footer>
                Contact <a href="mailto:press@credoaction.com">press@credoaction.com</a> for press inquries.<br/>
                &copy;2015 <a href="http://credoaction.com/" target="_blank">CREDO</a>. <a href="/terms/">Terms of Use.</a>
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
                </div>
            </div>
        );
    },
});


var HomePage = React.createClass({
    renderDescription: function() {
        return (
            <div className="description">
                <h2>Tell President Obama: Keep your promises. End the wars in Iraq, Afghanistan and Syria.</h2>

                <center>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/lUlBM6X_C5Y?rel=0" frameborder="0" allowfullscreen></iframe>
                </center>
                <div className="spacer" />

                Last week, President Obama announced that the United States will send special operations forces to Syria, where they will assist some rebel factions in Syria’s brutal civil war.<sup>1</sup>
                <div className="spacer" />

                But in 2013, President Obama promised unequivocally,   “I will not put American boots on the ground in Syria.”
                <div className="spacer" />

                This escalation is the latest in a series of broken promises on war and peace — in Iraq, Afghanistan, and now Syria.<sup>2 3 4</sup>
                <div className="spacer" />

                <strong>President Obama was elected and re-elected on promises to end George W. Bush’s failed wars, but now he’s poised to leave a legacy of broken promises and endless war. We need to speak out now against these dangerous military escalations.</strong>
                <div className="spacer" />

                The petition to President Obama reads:

                <div className="petition-text">
                    Keep your promises. End the wars in Iraq, Afghanistan and Syria.
                </div>

                <div className="footnotes">
                    Footnotes:
                    <ol>
                        <li>Nick Turse, &quot;<a href="https://theintercept.com/2015/10/30/us-to-send-special-operations-forces-to-syria/">U.S to Send Special Operations Forces to Syria</a>,&quot; The Intercept, October 30, 2015.</li>
                        <li>ibid.</li>
                        <li>Matthew Rosenberg and Michael D. Shear, &quot;<a href="http://www.nytimes.com/2015/10/16/world/asia/obama-troop-withdrawal-afghanistan.html?_r=0">In Reversal, Obama Says U.S. Soldiers Will Stay in Afghanistan to 2017</a>,&quot; New York Times, October 15, 2015.</li>
                        <li>Jeremy Diamond, &quot;<a href="http://www.cnn.com/2015/10/29/politics/iraq-isis-military-combat/">Pentagon: 'We're in combat' in Iraq</a>,&quot; CNN, October 30, 2015.</li>
                    </ol>
                </div>

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
                        Or call <a href={ "tel:" + this.getPhoneNumber('dashed') }>{ this.getPhoneNumber('pretty') }</a> to connect.
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

    getPhoneNumber: function(style) {
        var number = this.props.callNumber || '415-200-1223';
        if (style === 'dashed') {
            return number;
        } else if (style === 'pretty') {
            return '(' + number.replace(/-/, ') ');
        }
    },

    onSubmit: function(e) {
        e.preventDefault();

        var phoneField = this.refs.phone.getDOMNode();
        var phone = phoneField.value.trim().replace(/[^\d]/g, '');
        if (phone.length !== 10) {
            phoneField.focus();
            return alert('Please enter your 10 digit US phone number.');
        }

        var campaignId, url;
        campaignId = 'obamas_wars';
        url =
            'https://credo-action-call-tool.herokuapp.com/create' +
            '?campaignId=' + campaignId +
            '&userPhone=' + phone +
            '&ak_id=' + (this.props.akid  || null) +
            '&source_id=' + (this.props.source || null);

        console.log(url);
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
                        source={ this.state.source }
                        akid={ this.state.akid }
                        zip={ this.state.zip }
                    />

                    <div className="description description-call">
                        <h3>
                            Call script
                        </h3>

                        Hi, my name is { this.state.name || '[YOUR NAME]' } and I’m calling from { this.state.city || '[YOUR CITY]' }, [YOUR STATE]. 
                        President Obama recently broke his promises to end the wars in Iraq and Afghanistan, and not to put boots on the ground in Syria.
                        <div className="spacer" />

                        The president was elected and re-elected on promises to end George W. Bush’s failed wars. 
                        Now he’s poised to leave a legacy of broken promises and endless war.
                        <div className="spacer" />

                        President Obama must keep his promises by ending the wars in Iraq, Afghanistan, and Syria. Thank you.
                        <div className="spacer" />

                        <h3>
                            After you call, please share this campaign.
                        </h3>

                        <center>
                            <div className='sp_16670 sp_fb_small facebook'></div>
                            <div className='sp_16671 sp_tw_small twitter'></div>
                            <div className='sp_16669 sp_em_small email'></div>
                        </center>
                        
                    </div>
                </div>

                <Footer />
            </div>
        );
    },

    getTitle: function() {        
        return (
            <h2 className="thanks">
                Thanks for signing!  Now please call President Obama to deliver your message directly. 
                The White House counts each call, so this is a really important way to make your voice heard. 
            </h2>
        );
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
            akid: getAKID(),
            source: getSource(),
            visible: false,
        };
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);

        var values;
        try {
            values = JSON.parse(sessionStorage.homeFormValues);
        } catch (e) {
            // Let's go with the default.
        }

        if (values) {
            var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?apikey=3779f52f552743d999b2c5fe1cda70b6&zip=' + values.zip;
            ajax.get(url, this.onSunlightResponse);

            this.setState({
                name: values.name,
                source: values.source,
                zip: values.zip,
            });
        } else {
            this.setState({
                visible: true,
            });
        }

        // Get call count.
        ajax.get('https://credo-action-call-tool-meta.herokuapp.com/api/count/obamas_wars', this.onCountResponse);
    },
});

var TermsOfService = React.createClass({
    render: function() {
        return (
            <div className="wrapper terms-page">
                <Header />

                <div className="meat">

                    <h2>
                        Website Terms of Use
                    </h2>

                    <ul>
                        <li>
                            <strong>Acceptance of Terms</strong><br />
                            This website (“Site”) is provided to you subject to the following Terms of Use (“Terms”). By visiting this site, you accept these Terms.
                        </li>

                        <li>
                            <strong>Information Collection</strong><br />
                            The Site will only collect the personal information you choose to provide. Information about the internet domain and IP address from which you access the Site, the type of browser and operating system used, the date and time of your Site visit, and the Site pages you visit may be collected automatically; this information will not be used to identify you personally.
                        </li>

                        <li>
                            <strong>Information Sharing and Use</strong><br />
                            The name, email address, address, and zip code you enter on the Site will be shared with the participating organizations named on the Site. The participating organizations named on the Site may be updated at any time, including after you enter your information. Your email address and/or Site registration information may be used to offer you special commercial or other benefits and communicate with you in the future. Participating organizations may use the information you provide subject to each participating organization’s own privacy policies.
                        </li>

                        <li>
                            <strong>Permission to Call</strong><br />
                            By entering your phone number on the Site, you give express permission to call that phone number for the purpose of connecting you with legislators.
                        </li>

                        <li>
                            <strong>Website Use</strong><br />
                            You understand and agree that the Web Site is provided "AS-IS" and no guarantees are made for the performance of or your use of the site.
                        </li>

                    </ul>

                    <div className="effective-date">
                        Effective Date: July 6, 2015
                    </div>

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


(function() {
    if (/^\/terms\/?/.test(location.pathname)) {
        React.render(<TermsOfService />, document.getElementById('app'));
//    } else if (/^\/call\/?/.test(location.pathname)) {   // matches only to '/call/' pathname
    } else if (/\/call\/?/.test(location.pathname)) {
        React.render(<CallPage />, document.getElementById('app'));
    } else {
        React.render(<HomePage />, document.getElementById('app'));
    }
})();
