$(function(){

var vueData = {
    now_group : "",
    now_post : "",
    mainWindow: "main-comp"
};

var vueMethods = {

};

Vue.component('main-comp', {
    template: '#main-temp',
    data: function() {
        return {
            input_topic: "",
            input_summary: ""
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
        }
    },
    mounted: function() {

    }
});

var vm = new Vue({
    el: '#mainView',
    data: vueData,
    methods: vueMethods
});

});