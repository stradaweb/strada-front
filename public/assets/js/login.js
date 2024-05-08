const UrlBase = "http://localhost:3000/api/auth";

$("#btnLogin").click(function () {
  let codigo = $("#coduser").val();
  let pass = $("#password").val();

  if (codigo != "" && pass != "") {
    var data = { codigo: codigo, pass: pass };
    axios.post(UrlBase, data).then((res) => {
      if (res.status == 200) {
        var data = res.data[0];
        setCookie("token", data.token, 7);
        delete data.token;
        localStorage.setItem("usuario", JSON.stringify(data));
        window.location.href = "inicio";
      } else {
        swal({
          type: "error",
          title: "ocurrio un error",
          showConfirmButton: true,
          confirmButtonText: "Cerrar",
        }).then((result) => {});
      }
    });
  } else {
    swal({
      type: "error",
      title: "Datos incompletos",
      showConfirmButton: true,
      confirmButtonText: "Cerrar",
    }).then((result) => {});
  }
});

function setCookie(nombre, valor, expiracion) {
  const fechaExpiracion = new Date();
  fechaExpiracion.setTime(
    fechaExpiracion.getTime() + expiracion * 24 * 60 * 60 * 1000
  );
  const expiracionUTC = fechaExpiracion.toUTCString();
  const cookieString = `${nombre}=${valor}; expires=${expiracionUTC}; path=/`;
  document.cookie = cookieString;
}
