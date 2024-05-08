const UrlBaseMesa = "http://localhost:3000/api/mesa/";

function loadTableMesa(){
    axios
    .get(UrlBaseMesa)
    .then((res) => {
        if (res.status == 200) {
            let data = res.data;
            localStorage.setItem("mesa", JSON.stringify(data))
            let tabla = data.map((e, index) => {
                return `<tr class="text-center">
                    <td>${parseInt(index)+1}</td>
                    <td>${e.numero}</td>
                    <td>${e.seccion}</td>
                    <td>${e.descripcion}</td>
                    <td>${e.estado==1?'Activo':'Desactivado'}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="getUpdateMesa(${e.id_mesa})">
                            <i class="fa-solid fa-pen"></i>
                        </button>    
                        <button type="button" class="btn btn-sm btn-info" onclick="changeStatusMesa(${e.id_mesa}, ${e.estado})">
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

$('.js-guardarmesa').click(function(){
    let numero = $('#numeromesa').val();
    let seccion = $('#seccionmesa').val();
    let descripcion = $('#descripcionmesa').val();

    configAxios()
    if(numero != '' && seccion != '' && descripcion != ''){
        let data = {
            numero: numero,
            descripcion: descripcion,
            id_seccion: seccion,
        }
        let url = UrlBaseMesa + 'create'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 201) {
                    sweetAddSuccess();
                } else{
                    sweetError();
                }
                $("#mdlAddMesa").modal("hide");
                $('#numeromesa').val("");
                $('#seccionmesa').val("");
                $('#descripcionmesa').val("");
                loadTableMesa();
            })
    }else{
        sweetAlert()
    }
})

function getUpdateMesa(id){
    let data = JSON.parse(localStorage.getItem("mesa"));
    let mesa = data.filter((e) => e.id_mesa == id)
    mesa = mesa[0];

    $('#updatenumeromesa').val(mesa.numero);
    $('#updateseccionmesa').val(mesa.id_seccion);
    $('#updatedescripcionmesa').val(mesa.descripcion);
    $('.js-actualizarmesa').attr("idmesa", mesa.id_mesa);
    $("#mdlUpdateMesa").modal("show");
}

$('.js-actualizarmesa').click(function(){
    let numero = $('#updatenumeromesa').val();
    let seccion = $('#updateseccionmesa').val();
    let descripcion = $('#updatedescripcionmesa').val();
    let id = $('.js-actualizarmesa').attr("idmesa");

    configAxios()
    if(numero != '' && seccion != '' &&  descripcion != '' && id != ''){
        let data = {
            numero: numero,
            descripcion: descripcion,
            id_seccion: seccion,
            id: id
        }
        let url = UrlBaseMesa + 'update'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 200) {
                    sweetUpdateSuccess();
                } else{
                    sweetError();
                }
                $("#mdlUpdateMesa").modal("hide");
                $('#updatenumeromesa').val("");
                $('#updateseccionmesa').val("");
                $('#updatedescripcionmesa').val("");
                loadTableMesa();
            })
    }else{
        sweetAlert()
    }
})

function changeStatusMesa(id, status){
    configAxios();
	swal({
		type: "question",
		title: `¿Quieres ${status==1?'desactivar':'activar'} la mesa?`,
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
			let url = UrlBaseMesa + "status";
			axios.put(url, data).then((res) => {
				if (res.status == 200) {
					loadTableMesa();
				} else {
					sweetError()
				}
			}).catch((e) => console.log(e));
		}
	});
}