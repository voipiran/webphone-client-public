import Vue from "vue";
import Swal from "sweetalert2";
import Axios from "axios";

const webphones = new Vue({
    el: "#webphones",
    methods: {
        async remove(id) {
            let confirmed = false;
            await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(result => {
                if (result.isConfirmed) {
                    confirmed = true;
                }
            });

            //   if confirmed , remove the webphone
            if (confirmed) {
                try {
                    Swal.showLoading();
                    await Axios.delete("/dashboard/webphones/" + id);
                    Swal.fire("Success!", "Webphone Removed.", "success");
                    setTimeout(function() {
                        location.href = "/dashboard/webphones";
                    }, 800);
                } catch (error) {
                    console.log(error);
                    Swal.fire(
                        "Failed!",
                        "Somthing went wrong , please try again later.",
                        "error"
                    );
                }
            }
        }
    }
});
