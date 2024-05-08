const UrlBaseComanda = "https://strada-api.vercel.app/api/comanda/";

function loadTableComandas() {
    axios
        .get(UrlBaseComanda)
        .then((res) => {
            if (res.status == 200) {
                let data = res.data;
                localStorage.setItem("comandas", JSON.stringify(data));
                let tabla = data
                    .map((e, index) => {
                        return `<tr data-status=${e.estado} class="text-center">
                    <td>${parseInt(index) + 1}</td>
                    <td>${e.cod_comanda}</td>
                    <td>${e.Nom_seccion}</td>
                    <td>${e.Num_mesa}</td>
                    <td>${e.fecha}</td>
                    <td>${e.mensaje}</td>
                    <td>${e.estado == 2
                                ? '<span class="badge text-bg-warning">Pendiente</span>'
                                : e.estado == 1
                                    ? '<span class="badge text-bg-success">Terminado</span>'
                                    : '<span class="badge text-bg-danger">Cancelado</span>'
                            }</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="getUpdateComanda(${e.id_comanda
                            })">
                            <i class="fa-solid fa-pen"></i>
                        </button> 
                    </td>
                </tr>`;
                    })
                    .join("");
                $(".body-data").html(tabla);
            } else {
                swal({
                    type: "error",
                    title: "Ocurrio un error con los datos!",
                    showConfirmButton: true,
                    confirmButtonText: "Cerrar",
                }).then((result) => { });
            }
        })
        .catch((e) => console.log(e));
}

$("#select-status").on("change", function () {
    var filtro = $(this).val();
    $("#tablaComanda tbody tr").each(function () {
        var fila = $(this);
        var visible = false;
        var status = parseInt(fila.attr("data-status"));

        if (filtro === "") {
            visible = true;
        } else if (filtro == "1" && status == 1) {
            visible = true;
        } else if (filtro == "2" && status == 2) {
            visible = true;
        } else if (filtro == "0" && status == 0) {
            visible = true;
        }

        fila.toggle(visible);
    });
});

$(".selectSeccionComanda").on("change", function () {
    var id = $(this).val();
    loadMesaSeccion(id);
});

function getUpdateComanda(id){
    let data = JSON.parse(localStorage.getItem("comandas"));
    let comanda = data.filter((e) => e.id_comanda == id)
    comanda = comanda[0];

    $('#updateseccioncomanda').val(comanda.id_seccion);
    loadMesaSeccion(id);
    $('#updatedescripcioncomanda').val(comanda.mensaje);
    $('.js-actualizarcomanda').attr("idcomanda", comanda.id_comanda);
    setTimeout(() => {
        $('#updatemesacomanda').val(comanda.id_mesa);
        $("#mdlUpdateComanda").modal("show");
    }, 1000)

}

$("#moverDerecha").on("click", function() {
    $("#tablaIzquierda tr.selected").each(function() {
        const plato = $(this).find("td:first").text();
        const id = $(this).data("id");
        const cantidad = $("#cantidadDetComanda").val();
        const mensaje = $("#descripciondetcomanda").val();
        agregarPlato(id, plato, cantidad, mensaje);
        $("#descripciondetcomanda").val("");
        $(this).removeClass("selected");
    });
});

$("#moverIzquierda").on("click", function() {
    $("#tablaDerecha tr.selected").remove();
});

$("#tablaIzquierda").on("click", "tr", function() {
    $(this).toggleClass("selected");
});

function agregarPlato(id, plato, cantidad, mensaje) {
    const newRow = `<tr class="text-center" data-id=${id}>
        <td>${plato}</td>
        <td>${cantidad}</td>
        <td>${mensaje}</td>
    </tr>`;
    $("#tablaDerecha tbody").append(newRow);
}

function capturarPlatos() {
    const platos = [];
    $("#tablaDerecha tbody tr").each(function() {
        const plato = $(this).find("td:first").text();
        const id = $(this).data("id");
        const cantidad = $(this).find("td:eq(1)").text();
        const mensaje = $(this).find("td:last").text();
        platos.push({ id_plato: id, plato: plato, cantidad: cantidad, mensaje: mensaje });
    });
    return platos;
}

// Evento para capturar los platos cuando se haga clic en un botón
$(".js-agregarcomanda").on("click", function() {
    let data = JSON.parse(localStorage.getItem("usuario"));
    let id_mesa = $('#mesacomanda').val();
    let mensaje = $('#descripcioncomanda').val();
    let id_usuario = data.id_usuario;
    const platosCapturados = capturarPlatos();
    if(id_mesa != '' && mensaje != '' && 
    id_usuario != '' && platosCapturados.length > 0){
        let data = {
            id_mesa: id_mesa,
            mensaje: mensaje,
            id_usuario: id_usuario,
            platos: platosCapturados
        }
        let url = UrlBaseComanda + 'create'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 201) {
                    sweetAddSuccess();
                } else{
                    sweetError();
                }
                $("#mdlAddComanda").modal("hide");
                $('#mesacomanda').val("");
                $('#seccioncomanda').val("");
                $('#descripcioncomanda').val("");
                loadTableComandas();
            })
    } else {
        sweetAlert()
    }
});

$(".js-actualizarcomanda").on("click", function() {
    let id_mesa = $('#updatemesacomanda').val();
    let mensaje = $('#updatedescripcioncomanda').val();
    let id = $('.js-actualizarcomanda').attr("idcomanda");
    if(id_mesa != '' && mensaje != ''){
        let data = {
            id: id,
            id_mesa: id_mesa,
            mensaje: mensaje,
        }
        let url = UrlBaseComanda + 'update'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 200) {
                    sweetUpdateSuccess();
                } else{
                    sweetError();
                }
                $("#mdlUpdateComanda").modal("hide");
                $('#updatemesacomanda').val("");
                $('#updatedescripcioncomanda').val("");
                loadTableComandas();
            })
    } else {
        sweetAlert()
    }
});