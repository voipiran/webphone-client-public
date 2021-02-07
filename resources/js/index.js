import Vue from 'vue';
import Swal from 'sweetalert2';

const index = new Vue({
    el : '#index' ,
    methods : {
        doSome(){
            Swal.fire('','erorr accured','error');
        }
    }
});