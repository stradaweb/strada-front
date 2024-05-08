function numero(e) {
    if (
        $.inArray(e.keyCode, [46, 8, 9, 27, 13, 109, 110, 189, 190]) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) ||
        (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
        return;
    }

    if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
    ) {
        e.preventDefault();
    }
}

var inputElements = document.querySelectorAll("input");

inputElements.forEach(function(input) {
  input.autocomplete = "off";
});

function configAxios() {
    try {
        const token = getTokenCookie();
        axios.interceptors.request.use(
            (config) => {
                config.headers.authorization =
                    "Bearer " + token;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    } catch (error) {}
}

function getTokenCookie() {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === "token") {
        return cookieValue;
      }
    }
    return null;
}

function deleteCookie(){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location = 'login';
}

function sweetError(){
    swal({
        type: "error",
        title: "ocurrio un error",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
    }).then((result) => {
    });
}

function sweetAlert(){
    swal({
        type: "info",
        title: "Datos incompletos!",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
    }).then((result) => {});
}

function sweetAddSuccess(){
    swal({
        type: "success",
        title: "Registro exitoso",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
    }).then((result) => {
    });
}

function sweetUpdateSuccess(){
    swal({
        type: "success",
        title: "Actualización exitosa",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
    }).then((result) => {
    });
}

function loadDataUser(){
    let data = JSON.parse(localStorage.getItem("usuario"));
    $("#nameUser").html(data.nombre)
}