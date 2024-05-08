const UrlBase = "http://localhost:3000/api/menu/";

function loadTable(){
    axios
    .get(UrlBase)
    .then((res) => {
        if (res.status == 200) {
            let data = res.data;
            localStorage.setItem("menu", JSON.stringify(data))
            let tabla = data.map((e, index) => {
                return `<tr class="text-center">
                    <td>${parseInt(index)+1}</td>
                    <td>${e.nombre}</td>
                    <td>S/. ${e.precio}</td>
                    <td>${e.cantidad}</td>
                    <td>${e.tipo==1?'Entrada':e.tipo==2?'Segundo':'Postre'}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="getUpdateMenu(${e.id_menu})">
                            <i class="fa-solid fa-pen"></i>
                        </button>    
                        <button type="button" class="btn btn-sm btn-danger" onclick="deleteMenu(${e.id_menu})">
                            <i class="fa-solid fa-trash-can"></i>
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

$('.js-guardarmenu').click(function(){
    let nombre = $('#nombreMenu').val();
    let precio = $('#precioMenu').val();
    let cantidad = $('#cantidadMenu').val();
    let tipo = $('#tipoMenu').val();

    configAxios()
    if(nombre != '' && precio != '' && cantidad != '' && tipo != ''){
        let data = {
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            tipo: tipo
        }
        let url = UrlBase + 'create'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 201) {
                    sweetAddSuccess();
                } else{
                    sweetError();
                }
                $("#mdlAddMenu").modal("hide");
                $('#nombreMenu').val("");
                $('#precioMenu').val("");
                $('#cantidadMenu').val("");
                $('#tipoMenu').val("");
                loadTable();
            })
    }else{
        sweetAlert()
    }
})

function getUpdateMenu(id){
    let data = JSON.parse(localStorage.getItem("menu"));
    let menu = data.filter((e) => e.id_menu == id)
    menu = menu[0];

    $('#updatenombreMenu').val(menu.nombre);
    $('#updateprecioMenu').val(menu.precio);
    $('#updatecantidadMenu').val(menu.cantidad);
    $('#updatetipoMenu').val(menu.tipo);
    $('.js-actualizarmenu').attr("idmenu", menu.id_menu);
    $("#mdlUpdateMenu").modal("show");
}

$('.js-actualizarmenu').click(function(){
    let nombre = $('#updatenombreMenu').val();
    let precio = $('#updateprecioMenu').val();
    let cantidad = $('#updatecantidadMenu').val();
    let tipo = $('#updatetipoMenu').val();
    let id = $('.js-actualizarmenu').attr("idmenu");

    configAxios()
    if(nombre != '' && precio != '' && cantidad != '' && tipo != '' && id != ''){
        let data = {
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            tipo: tipo,
            id: id
        }
        let url = UrlBase + 'update'
        axios.post(url, data)
            .then((res) => {
                if (res.status == 200) {
                    sweetUpdateSuccess();
                } else{
                    sweetError();
                }
                $("#mdlUpdateMenu").modal("hide");
                $('#updatenombreMenu').val("");
                $('#updateprecioMenu').val("");
                $('#updatecantidadMenu').val("");
                $('#updatetipoMenu').val("");
                loadTable();
            })
    }else{
        sweetAlert()
    }
})

function deleteMenu(id){
    configAxios();
	swal({
		type: "question",
		title: "¿Quieres eliminar el menú?",
		cancelButtonColor: "#FB2C2C",
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: "Si",
		cancelButtonText: "Cancelar",
		closeOnConfirm: false,
	}).then((result) => {
		if (result.value) {
			let url = UrlBase + "delete/" + id;
			axios.put(url).then((res) => {
				if (res.status == 200) {
					loadTable();
				} else {
					sweetError()
				}
			}).catch((e) => console.log(e));
		}
	});
}