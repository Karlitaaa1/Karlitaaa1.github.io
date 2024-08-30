// URL de la API que devuelve los datos de los empleados
const apiUrl = "http://tarea1karla.somee.com/api/Empleados"; // Reemplaza con la URL real de tu API
let employeeToDeleteId = null; // Variable para almacenar el ID del empleado a eliminar

// Variable para almacenar el ID del empleado a eliminar

// Función para obtener los datos de los empleados desde la API
async function fetchEmpleados() {
    try {
        const response = await fetch(apiUrl);

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error(`Error al obtener los empleados: ${response.statusText}`);
        }

        // Intentar parsear el JSON
        const empleados = await response.json();

        // Si el JSON está vacío, lanzar un error
        if (!empleados || empleados.length === 0) {
            throw new Error('No se encontraron empleados.');
        }

        renderTable(empleados);
    } catch (error) {
        console.error('Error al obtener los empleados:', error);
    }
}

// Función para renderizar la tabla con los datos de los empleados
function renderTable(empleados) {
    const tableBody = document.querySelector('#empleadosTable tbody');
    tableBody.innerHTML = ''; // Limpiar cualquier contenido existente

    empleados.forEach(empleado => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${empleado.id}</td>
            <td>${empleado.nombre}</td>
            <td>${empleado.apellido}</td>
            <td>${empleado.edad}</td>
            <td>${empleado.telefono}</td>
            <td>${empleado.salario.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openEditModal(${empleado.id})">Actualizar</button>
                <button class="btn btn-danger btn-sm" onclick="openDeleteConfirmModal(${empleado.id})">Eliminar</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Función para abrir el modal de agregar empleado
function openAddModal() {
    document.getElementById('employeeId').value = '';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeModalLabel').innerText = 'Agregar Nuevo Empleado';
}

// Función para abrir el modal de editar empleado
async function openEditModal(id) {

    



    try {
        const response = await fetch(`${apiUrl}/${id}`);

        if (!response.ok) {
            throw new Error(`Error al obtener el empleado: ${response.statusText}`);
        }

        const empleado = await response.json();
        document.getElementById('employeeId').value = empleado.id;
        document.getElementById('nombre').value = empleado.nombre;
        document.getElementById('apellido').value = empleado.apellido;
        document.getElementById('edad').value = empleado.edad;
        document.getElementById('telefono').value = empleado.telefono;
        document.getElementById('salario').value = empleado.salario;

        document.getElementById('employeeModalLabel').innerText = 'Editar Empleado';
        const modal = new bootstrap.Modal(document.getElementById('employeeModal'));
        modal.show();
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
    }
}

// Función para abrir el modal de confirmación de eliminación
function openDeleteConfirmModal(id) {
    employeeToDeleteId = id; // Guardar el ID del empleado a eliminar
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    deleteConfirmModal.show();
}

// Función para manejar el envío del formulario
document.getElementById('employeeForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('employeeId').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = parseInt(document.getElementById('edad').value, 10); // Convertir a entero
    const telefono = document.getElementById('telefono').value;
    const salario = parseFloat(document.getElementById('salario').value); // Convertir a decimal

    const empleado = { id, nombre, apellido, edad, telefono, salario };

    try {
        let response;
        if (id) {
            // Actualizar empleado existente
            response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empleado)
            });

        } else {
            // Agregar nuevo empleado
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empleado)
            });
        }

        if (!response.ok) {
            throw new Error(`Error al ${id ? 'actualizar' : 'agregar'} el empleado: ${response.statusText}`);
        }

        // Cerrar el modal y actualizar la tabla
        const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
        modal.hide();
        fetchEmpleados();
    } catch (error) {
        console.error('Error al guardar el empleado:', error);
    }
});



// Función para manejar la confirmación de eliminación
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    if (employeeToDeleteId === null) return;

    try {
        const response = await fetch(`${apiUrl}/${employeeToDeleteId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el empleado: ${response.statusText}`);
        }

        // Cerrar el modal de confirmación y actualizar la tabla
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
        modal.hide();
        fetchEmpleados();
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
    }
});

// Llamar a la función para obtener y mostrar los empleados cuando la página se carga
document.addEventListener('DOMContentLoaded', fetchEmpleados);
async function obtenerTipoCambio() {
    try {
        // CORS proxy para evitar problemas de CORS
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicos?Indicador=318&FechaInicio=29/08/2024&FechaFinal=29/08/2024&Nombre=Stephanie&SubNiveles=N&CorreoElectronico=sterogam@gmail.com&Token=TIS5MER2LS';

        // Construir la URL completa para la solicitud
        const fullUrl = corsProxy + apiUrl;

        // Realizar la solicitud HTTP GET
        const response = await fetch(fullUrl);

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Obtener el contenido de la respuesta
        const content = await response.text();

        // Parsear el XML a un objeto DOMParser
        const parser = new DOMParser();
        const xmlDocument = parser.parseFromString(content, 'text/xml');

        // Obtener el elemento deseado del XML
        const dataElement = xmlDocument.querySelector('INGC011_CAT_INDICADORECONOMIC');
        const numValor = dataElement?.querySelector('NUM_VALOR')?.textContent || 'No disponible';

        // Mostrar el contenido en el elemento <p> con id "cambio"
        document.getElementById('cambio').textContent = `Tipo de cambio: ${numValor}`;
    } catch (error) {
        // Manejar errores
        document.getElementById('cambio').textContent = `Error al consumir la API: ${error.message}`;
    }
}

// Llamar a la función para realizar la solicitud
obtenerTipoCambio();

