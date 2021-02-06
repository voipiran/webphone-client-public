import Vue from 'vue';

/**vue multi select  */
import Multiselect from 'vue-multiselect'

const webphones = new Vue({
    el : '#webphones',
    data : {
        status  : 'active' , 
        statusOptions : [ 'active' , 'inActive' ]
    },
    components : {
        Multiselect
    },
    mounted(){
        if(webphone){
            this.status = webphone.status;
        }
    }
});