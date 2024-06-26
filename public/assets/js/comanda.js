const UrlBaseComanda = UrlBase + "comanda/";
const UrlBaseDetComanda = UrlBase + "detcomanda/";
const UrlBasePay = UrlBase + "pagos/";

function loadTableComandas() {
    configAxios();
    axios
        .get(UrlBaseComanda)
        .then((res) => {
            if (res.status == 200) {
                let data = res.data;
                localStorage.setItem("comandas", JSON.stringify(data));
                let usuario = JSON.parse(localStorage.getItem("usuario"));
                if(usuario.rol == 2){
                    let tabla = data
                    .map((e, index) => {
                        return `<tr data-status=${e.estado} class="text-center">
                    <td>${parseInt(index) + 1}</td>
                    <td>${e.cod_comanda}</td>
                    <td>${e.Nom_seccion}</td>
                    <td>${e.Num_mesa}</td>
                    <td>${moment(e.fecha).format('DD-MM-YYYY HH:mm:ss')}</td>
                    <td>${e.mensaje}</td>
                    <td>${e.estado == 2
                                ? '<span class="badge text-bg-warning">Pendiente</span>'
                                : e.estado == 3
                                    ? '<span class="badge text-bg-success">Atendido</span>'
                                    : e.estado == 1
                                    ? '<span class="badge text-bg-info">Pagado</span>'
                                    : '<span class="badge text-bg-danger">Cancelado</span>'
                            }</td>
                    <td>
                        ${(e.estado == 1 || e.estado == 0) ? '' : e.estado == 3 ?
                            `<button type="button" class="btn btn-sm btn-success" onclick="getPayComanda(${e.id_comanda
                                })">
                                <i class="fa-solid fa-receipt"></i>
                            </button>` 
                            : 
                            `<button type="button" class="btn btn-sm btn-warning" onclick="getUpdateComanda(${e.id_comanda
                                })">
                                <i class="fa-solid fa-pen"></i>
                            </button> 
                            <button type="button" class="btn btn-sm btn-danger" onclick="UpdateStatusComanda(${e.id_comanda
                                })">
                                <i class="fa-solid fa-rotate"></i>
                            </button>`
                        }
                    </td>
                </tr>`;
                    })
                    .join("");
                $(".body-data").html(tabla);
                }else if(usuario.rol == 3){
                    const container = document.querySelector('.listComandasCocina');
                    container.innerHTML = '';
                    data.forEach(comanda => {
                        let cardHtml = `
                        <div class="col-md-4">
                            <div class="card bg-transparent">
                                <div class="card-header bg-red">
                                    Comanda: ${comanda.cod_comanda} - Mesa ${comanda.Num_mesa} (${comanda.Nom_seccion})
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${comanda.Usuario}</h5>
                                    <p class="card-text">Mensaje: ${comanda.mensaje}</p>
                                    <ul>`;
                        comanda.detalle.forEach(item => {
                            cardHtml += `<li>${item.nombre} - Cantidad: ${item.cantidad} ${item.mensaje ? `- ${item.mensaje}` : ''}</li>`;
                        });
                        cardHtml += `</ul>
                                </div>
                                <div class="card-footer text-center">
                                    <button type="button" class="btn btn-sm btn-success" onclick="UpdateStatusComanda(${comanda.id_comanda})">Atendido</button>
                                </div>
                            </div>
                        </div>`;
                        container.innerHTML += cardHtml;
                    });
                }
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

function loadDetComanda(id) {
    configAxios();
    axios
        .get(UrlBaseDetComanda + id)
        .then((res) => {
            if (res.status == 200) {
                let data = res.data;
                const container = document.querySelector('.listDetComandas');
                container.innerHTML = '';
                let cardHtml = '<ul>';
                data.forEach(item => {
                    cardHtml += `<li>${item.nombre} - Cantidad: ${item.cantidad} - Precio: ${item.precio} - Total: ${item.totalitem} 
                    ${item.mensaje ? `- ${item.mensaje}` : ''}</li>`;
                });
                sumaItem = data.reduce((suma, item) => suma + item.totalitem, 0);
                cardHtml += `</ul>`;
                $('#formapagomonto').val(sumaItem);
                container.innerHTML += cardHtml;
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
    loadMesaSeccion(comanda.id_seccion);
    $('#updatedescripcioncomanda').val(comanda.mensaje);
    $('.js-actualizarcomanda').attr("idcomanda", comanda.id_comanda);
    setTimeout(() => {
        $('#updatemesacomanda').val(comanda.id_mesa);
        $("#mdlUpdateComanda").modal("show");
    }, 1000)

}

function getPayComanda(id){
    loadDetComanda(id);
    $('.js-pagarcomanda').attr("idcomanda", id);
    setTimeout(() => {
        $("#mdlPayComanda").modal("show");
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
    $("#tablaDerecha tbody tr").remove();
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
        configAxios();
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
        configAxios();
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

$(".js-pagarcomanda").on("click", function() {
    let formapago = $('#formapagocomanda').val();
    let monto = $('#formapagomonto').val();
    let id = $('.js-pagarcomanda').attr("idcomanda");
    if(formapago != '' && monto != ''){
        let data = {
            id: id,
            formapago: formapago,
            monto: monto,
        }
        configAxios();
        axios.post(UrlBasePay, data)
            .then((res) => {
                if (res.status == 201) {
                    sweetAddSuccess();
                } else{
                    sweetError();
                }
                $("#mdlPayComanda").modal("hide");
                $('#formapagocomanda').val("");
                $('#formapagomonto').val("");
                loadTableComandas();
            })
    } else {
        sweetAlert()
    }
});

function UpdateStatusComanda(id) {
    configAxios();
    let data = JSON.parse(localStorage.getItem("usuario"));
    let msg = data.rol == 2 ? 'anular' : 'atender';
	swal({
		type: "question",
		title: `¿Quieres ${msg} la comanda?`,
		cancelButtonColor: "#FB2C2C",
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: "Si",
		cancelButtonText: "Cancelar",
		closeOnConfirm: false,
	}).then((result) => {
		if (result.value) {
			let url = UrlBaseComanda + "status/" + id;
			axios.put(url).then((res) => {
				if (res.status == 200) {
					loadTableComandas();
				} else {
					sweetError()
				}
			}).catch((e) => console.log(e));
		}
	});
}