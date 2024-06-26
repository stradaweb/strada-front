const UrlBase = "https://strada-api.vercel.app/api/";
// const UrlBase = "http://localhost:3000/api/";
function cargarHeader() {
  $("#headerContainer").load("../../page/header.html");

  setTimeout(() => {
    var ruta = window.location.pathname.substring(1);
    $("#" + ruta).addClass("active");
  }, 1000);
}
