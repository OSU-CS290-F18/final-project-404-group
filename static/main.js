$(function(){

var vueData = {
    now_group : {},
    now_post : {},
    mainWindow: "main-comp"
};

var vueMethods = {
    switch_component: function(component_name) {
        vueData.mainWindow = component_name;
    }
};

Vue.component('main-comp', {
    template: '#main-temp',
    data: function() {
        return {
            input_topic: "",
            input_summary: "",
            group_list: []
        };
    },
    methods: {
        add_group: function() {
            //alert(this.$data.input_topic + this.$data.input_summary);
            $.post('./add_group', {
                topic: this.$data.input_topic,
                summary: this.$data.input_summary
            }, function(res) {
                alert(res);
            });
        },
        get_into_group: function(id) {
            vueData.now_group = this.$data.group_list[id];
            vueMethods.switch_component("group-comp");
        }
    },
    mounted: function() {
        __this = this;
        $.get('./get_group_list', function(res) {
            if(res['code'] == 0) {
                __this.$data.group_list = __this.$data.group_list.concat(res['data']);
            } else {
                alert(res['err_msg']);
            }
        })
    }
});

Vue.component('group-comp', {
    template: "#group-temp",
    data: function() {
        return {
            topic: "",
            summary: ""
        };
    },
    methods: {
        get_into_home: function() {
            vueMethods.switch_component("main-comp");
        }
    },
    mounted: function() {
        this.$data.topic = vueData.now_group.topic;
        this.$data.summary = vueData.now_group.summary;
    }
});

var vm = new Vue({
    el: '#mainView',
    data: vueData,
    methods: vueMethods
});

});