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
            __this = this;
            $.post('./add_group', {
                topic: this.$data.input_topic,
                summary: this.$data.input_summary
            }, function(res) {
                if(0 == res['code']) {
                    __this.$data.group_list.unshift({
                        _id: res['data'],
                        topic: __this.$data.input_topic,
                        summary: __this.$data.input_summary
                    });
                } else {
                    alert(res['err_msg']);
                }
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
                res['data'].map(function(value, index, ar) {
                    value['post_list'] = [];
                    $.post('./get_post_list_limit', {
                        group_id: value._id
                    }, function(res2) {
                        if(res2['code'] == 0) {
                            ar[index]['post_list'] = ar[index]['post_list'].concat(res2['data'])
                        } else {
                            alert(res2['err_msg'])
                        }
                    });
                    return value;
                })
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
            summary: "",
            input_title: "",
            input_content: "",
            input_author: "",
            post_list: []
        };
    },
    methods: {
        get_into_home: function() {
            vueMethods.switch_component("main-comp");
        },
        add_post: function() {
            __this = this;
            $.post('./add_post', {
                title: this.$data.input_title,
                content: this.$data.input_content,
                author: this.$data.input_author,
                group_id: vueData.now_group._id
            }, function(res) {
                if(res['code'] == 0) {
                    __this.$data.post_list.unshift({
                        title: __this.$data.input_title,
                        author: __this.$data.input_author,
                        content: __this.$data.input_content,
                        commit_number: 0,
                        group_id: vueData.now_group._id,
                        update_time: Date.now(),
                        create_time: Date.now()
                    })
                } else {
                    alert(res['err_msg'])
                }
            })
        }
    },
    mounted: function() {
        __this = this;
        this.$data.topic = vueData.now_group.topic;
        this.$data.summary = vueData.now_group.summary;
        $.post('./get_post_list', {
            group_id: vueData.now_group._id
        },function(res) {
            if(res['code'] == 0) {
                __this.$data.post_list = __this.$data.post_list.concat(res['data']);
            } else {
                alert(res['err_msg']);
            }
        })
    }
});

Vue.component('post-comp', {
    template: "#post-temp",
    data: function() {
        return {

        };
    },
    methods: {

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