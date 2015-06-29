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


var App = React.createClass({displayName: "App",
    render: function() {
        return (
            React.createElement("div", {className: "wrapper"}, 
                React.createElement("header", null, 
                    React.createElement("a", {className: "flag", href: "#petition"}), 

                    React.createElement("h1", null, 
                        "Stop War", 
                        React.createElement("br", null), 
                        "With Iran"
                    ), 

                    React.createElement("div", {className: "social"}, 
                        React.createElement("a", {className: "facebook", href: "#"}), 
                        React.createElement("a", {className: "twitter", href: "#"}), 
                        React.createElement("a", {className: "email", href: "#"})
                    )
                ), 

                React.createElement("div", {className: "meat"}, 

                    React.createElement("form", {id: "petition"}, 
                        React.createElement("h2", null, "Add your name"), 
                        React.createElement("button", null, 
                            "Click to Sign"
                        )
                    ), 

                    React.createElement("section", {className: "description"}, 
                        React.createElement("h2", null, "Don't let Republicans start another Mideast war."), 

                        "Sed sit amet ipsum mauris. ", React.createElement("a", {href: "#"}, "Maecenas"), " congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.", 

                        React.createElement("div", {className: "spacer"}), 

                        "Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis."
                    )

                ), 

                React.createElement("div", {className: "logos"}), 

                React.createElement("footer", null, 
                    "All content copyright ©2015 ", React.createElement("a", {href: "http://credoaction.com/", target: "_blank"}, "CREDO"), " and partner orgs."
                )
            )
        );
    },
});


React.render(React.createElement(App, null), document.getElementById('app'));
