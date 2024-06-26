const UrlBaseSeccion = UrlBase + "seccion/";

function loadTableSeccion(){
    axios
    .get(UrlBaseSeccion)
    .then((res) => {
        if (res.status == 200) {
            let data = res.data;
            localStorage.setItem("seccion", JSON.stringify(data))
            let tabla = data.map((e, index) => {
                return `<tr class="text-center">
                    <td>${parseInt(index)+1}</td>
                    <td>${e.nombre}</td>
                    <td>${e.limite}</td>
                    <td>${e.estado==1?'Activo':'Desactivado'}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="getUpdateSeccion(${e.id_seccion})">
                            <i class="fa-solid fa-pen"></i>
                        </button>    
                        <button type="button" class="btn btn-sm btn-info" onclick="changeStatusSeccion(${e.id_seccion}, ${e.estado})">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>    
                    </td>
                </tr>`;
            }).join('');
            $('.body-data').html(tabla)
        } else {
            swal({
                type: "error",
                title: "Ocurrio un error con los datos!",
                showConfirmButton: true,
                confirmButtonText: "Cerrar",
            }).then((result) => {});
        }
    })
    .catch((e) => console.log(e))
}

function loadSelectSeccion(){
    axios
    .get(UrlBaseSeccion)
    .then((res) => {
        if (res.status == 200) {
            let data = res.data;
            data = data.filter((e) => e.estado == 1)
            let tabla = '<option value="" selected>Seleccionar</option>';
            tabla += data.map((e) => {
                return `<option value=${e.id_seccion}>${e.nombre}</option>`;
            }).join('');
            $('.select-data-seccion').html(tabla)
        } else {
            swal({
                type: "error",
                title: "Ocurrio un error con los datos!",
                showConfirmButton: true,
                confirmButtonText: "Cerrar",
            }).then((result) => {});
        }
    })
    .catch((e) => console.log(e))
}

$('.js-guardarseccion').click(function(){
    let nombre = $('#nombreSeccion').val();
    let limite = $('#limiteSeccion').val();

    configAxios()
    if(nombre != '' && limite != ''){
        let data = {
            nombre: nombre,
            limite: limite
        }
        let url = UrlBaseSeccion + 'create'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 201) {
                    sweetAddSuccess();
                } else{
                    sweetError();
                }
                $("#mdlAddSeccion").modal("hide");
                $('#limiteSeccion').val("");
                loadTable();
            })
    }else{
        sweetAlert()
    }
})

function getUpdateSeccion(id){
    let data = JSON.parse(localStorage.getItem("seccion"));
    let seccion = data.filter((e) => e.id_seccion == id)
    seccion = seccion[0];

    $('#updatenombreSeccion').val(seccion.nombre);
    $('#updatelimiteSeccion').val(seccion.limite);
    $('.js-actualizarseccion').attr("idseccion", seccion.id_seccion);
    $("#mdlUpdateSeccion").modal("show");
}

$('.js-actualizarseccion').click(function(){
    let nombre = $('#updatenombreSeccion').val();
    let limite = $('#updatelimiteSeccion').val();
    let id = $('.js-actualizarseccion').attr("idseccion");

    configAxios()
    if(nombre != '' && limite != '' && id != ''){
        let data = {
            nombre: nombre,
            limite: limite,
            id: id
        }
        let url = UrlBaseSeccion + 'update'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 200) {
                    sweetUpdateSuccess();
                } else{
                    sweetError();
                }
                $("#mdlUpdateSeccion").modal("hide");
                $('#updatenombreSeccion').val("");
                $('#updatelimiteSeccion').val("");
                loadTable();
            })
    }else{
        sweetAlert()
    }
})

function changeStatusSeccion(id, status){
    configAxios();
	swal({
		type: "question",
		title: `¿Quieres ${status==1?'desactivar':'activar'} la seccion?`,
		cancelButtonColor: "#FB2C2C",
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: "Si",
		cancelButtonText: "Cancelar",
		closeOnConfirm: false,
	}).then((result) => {
		if (result.value) {
            let data = {
                id: id,
                estado: status==1?0:1
            }
			let url = UrlBaseSeccion + "status";
			axios.put(url, data).then((res) => {
				if (res.status == 200) {
					loadTable();
				} else {
					sweetError()
				}
			}).catch((e) => console.log(e));
		}
	});
}